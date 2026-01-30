import { userTable } from "@/db/schema";
import { drizzlePgClient } from "@lib/clients/drizzle";
import { type VerificationCode, type SignUpInput, type SignInInput } from "@api/types/user";
import { type Context } from "hono";
import { and, eq, gt, sql } from "drizzle-orm";
import { setAccessTokenCookie } from "@api/services/jwt";
import { sendVerificationEmail } from "@api/services/mail";
import { deleteCookie } from "hono/cookie";
import { generateOTP } from "../services/otp";

export const register = async (c: Context, { name, email, password }: SignUpInput) => {
	const userAlreadyExists = await drizzlePgClient.execute(sql`
        SELECT 1 FROM ${userTable} WHERE email = ${email} LIMIT 1;
    `);

	if (userAlreadyExists.length >= 1) {
		return c.json({ error: "User with this email already exists" }, 400);
	}
	const passwordHash = await Bun.password.hash(password, {
		algorithm: "bcrypt",
	});
	// const verificationToken = Math.round(Math.random() * 10_00_000).toString();
	const verificationToken = generateOTP();

	console.log("🚀 ~ user.ts:25 ~ signUp ~ verificationToken: ", verificationToken);


	console.log("🚀 ~ auth.ts:23 ~ signUp ~ verificationToken: ", verificationToken);

	// using raw sql
	// const newUser = await drizzlePgClient.execute(sql`
	//     INSERT INTO ${userTable} (name, email, password_hash, verification_token, verification_token_expires_at)
	//     VALUES (
	//         ${name},
	//         ${email},
	//         ${passwordHash},
	//         ${verificationToken},
	//         NOW() + INTERVAL '10 MINUTES'
	//     )
	//     RETURNING *
	// `);

	const newUser = await drizzlePgClient
		.insert(userTable)
		.values({
			name,
			email,
			passwordHash,
			verificationToken,
			verificationTokenExpiresAt: sql`Now() + INTERVAL '10 MINUTES'`,
		})
		.returning();

	// Type guard
	const createdUser = newUser.at(0);
	if (!createdUser) {
		return c.json({ error: "User creation failed!" }, 500);
	}

	await setAccessTokenCookie(c, createdUser.id);
	try {
		await sendVerificationEmail(createdUser.email, createdUser.verificationToken);
	} catch (error) {
		if (error instanceof Error) {
			return c.json({ error: error.message }, 400);
		}
		return c.json({ error: "Something went wrong!" }, 400);
	}

	return c.json(
		{
			message: "New User created successfully!",
			data: {
				id: createdUser.id,
				name: createdUser.name,
				email: createdUser.email,
			},
		},
		{
			status: 201,
		},
	);
};

export const login = async (c: Context, loginCredentails: SignInInput) => {
	const { email, password } = loginCredentails;

	// const users = await drizzlePgClient.execute(sql`
	// 	SELECT
	// 		id,
	// 		email,
	// 		password,
	// 		last_login
	// 	FROM
	// 		public.users
	// 	WHERE
	// 		email = ${email};
	// 	`);

	const users = await drizzlePgClient
		.select({
			id: userTable.id,
			email: userTable.email,
			passwordHash: userTable.passwordHash,
			lastLogin: userTable.lastLogin,
		})
		.from(userTable)
		.where(eq(userTable.email, email))
		.limit(1);

	const user = users.at(0);
	if (!user) {
		return c.json({ error: "Invalid credentails", success: false }, 400);
	}

	if (user.email !== email) {
		return c.json({ success: false, message: "Invalid email id" });
	}

	const isPasswordValid = await Bun.password.verify(password, user.passwordHash);

	if (!isPasswordValid) {
		return c.json({ success: false, message: `Invalid password` });
	}

	setAccessTokenCookie(c, user.id);

	await drizzlePgClient.execute(sql`
		UPDATE
			public.users
		SET
			last_login = NOW()
		WHERE
			id = ${user.id};
		`);

	return c.json({ message: "Logged in successfully" }, 201);
};

export const logOut = (c: Context) => {
	deleteCookie(c, "access_token");
	return c.json({ message: "Logged out successfully", success: true });
};

export const verifyEmail = async (c: Context, verificationCode: VerificationCode) => {
	// const isUserExists = await drizzlePgClient.execute(sql`
	// 	SELECT
	// 		is_verified,
	// 		verification_token,
	// 		verification_token_expires_at
	// 	FROM
	// 		public.users
	// 	WHERE
	// 		verification_token = ${verificationCode}
	// 			AND
	// 		verification_token_expires_at > NOW();
	// 	`);

	const isUserExists = await drizzlePgClient
		.select({
			isVerified: userTable.isVerified,
			verificationToken: userTable.verificationToken,
			verificationTokenExpiresAT: userTable.verificationTokenExpiresAt,
		})
		.from(userTable)
		.where(
			and(
				eq(userTable.verificationToken, verificationCode),
				gt(userTable.verificationTokenExpiresAt, sql`NOW()`),
			),
		);

	console.log("🚀 ~ user.ts:99 ~ verifyEmail ~ isUserExists: ", isUserExists);

	if (isUserExists.length <= 0) {
		return c.json({ error: `Your verification token is either invalid or expred` }, 400);
	}

	await drizzlePgClient.execute(sql`
		UPDATE
			public.users
		SET
			is_verified = TRUE,
			verification_token = NULL,
			verification_token_expires_at = NULL;
		`);

	return c.json({ message: "Successfully verified your email" });
};
