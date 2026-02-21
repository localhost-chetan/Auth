import { userTable } from "@/db/schema";
import { drizzlePgClient } from "@lib/clients/drizzle";
import { type Context } from "hono";
import { and, eq, gt, sql } from "drizzle-orm";
import { setAccessTokenCookie } from "@api/services/jwt";
import { sendResetPasswordResetEmail, sendVerificationEmail } from "@api/services/mail";
import { deleteCookie } from "hono/cookie";
import { generateOTP } from "@api/services/otp";
import { randomUUIDv7 } from "bun";
import { getClientUrl } from "@utils/service-urls";
import { ResetPasswordInput, VerificationCode, type SignInInput, type SignUpInput } from "@api/schemas/auth";

export const register = async (c: Context, { name, email, password }: SignUpInput) => {
	const userAlreadyExists = await drizzlePgClient
		.select({
			id: userTable.id,
		})
		.from(userTable)
		.where(eq(userTable.email, email))
		.limit(1)
		.then((result) => result.at(0));
	console.log("🚀 ~ register ~ userAlreadyExists:", userAlreadyExists);

	if (!userAlreadyExists) {
		return c.json({ error: "User with this email already exists" }, 400);
	}
	const passwordHash = await Bun.password.hash(password, {
		algorithm: "bcrypt",
	});
	// const verificationToken = Math.round(Math.random() * 10_00_000).toString();
	const verificationToken = generateOTP();

	console.log("🚀 ~ auth.ts:23 ~ signUp ~ verificationToken: ", verificationToken);

	const newUser = await drizzlePgClient
		.insert(userTable)
		.values({
			name,
			email,
			passwordHash,
			verificationToken,
			verificationTokenExpiresAt: sql`NOW() + interval '10 MINUTES'`,
		})
		.returning();
	console.log("🚀 ~ register ~ newUser:", newUser);

	// Type guard
	const createdUser = newUser.at(0);
	if (!createdUser) {
		return c.json({ error: "User creation failed!" }, 500);
	}

	await setAccessTokenCookie(c, createdUser.id);
	try {
		if (!createdUser.verificationToken) {
			return c.json({ error: "Something wrong with verification token" }, 500);
		}

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

	await drizzlePgClient
		.update(userTable)
		.set({
			lastLogin: sql`NOW()`,
		})
		.where(eq(userTable.id, user.id));

	return c.json({ message: "Logged in successfully" }, 201);
};

export const logOut = (c: Context) => {
	deleteCookie(c, "access_token");
	return c.json({ message: "Logged out successfully", success: true });
};

export const verifyEmail = async (c: Context, verificationCode: VerificationCode) => {
	const user = await drizzlePgClient
		.select({
			email: userTable.email,
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
		)
		.then((result) => result.at(0));

	console.log("🚀 ~ user.ts:99 ~ verifyEmail ~ user: ", user);

	if (!user) {
		return c.json({ error: `Your verification token is either invalid or expired` }, 400);
	}

	if (!user.email) {
		return c.json({ error: `Something wrong with user email` }, 400);
	} else {
		await drizzlePgClient
			.update(userTable)
			.set({
				isVerified: true,
				verificationToken: null,
				verificationTokenExpiresAt: null,
			})
			.where(eq(userTable.email, user.email));
	}

	return c.json({ message: "Successfully verified your email" });
};

export const forgotPassword = async (c: Context, email: string) => {
	const user = await drizzlePgClient
		.select({ id: userTable.id })
		.from(userTable)
		.where(eq(userTable.email, email))
		.then((result) => result.at(0));

	console.log("🚀 ~ auth.ts:193 ~ forgotPassword ~ user: ", user);

	if (!user) {
		return c.json({ error: "User with this email not found!" }, 400);
	}

	// Generate reset token
	const resetPasswordToken = randomUUIDv7("base64url", Date.now());

	await drizzlePgClient
		.update(userTable)
		.set({
			resetPasswordToken,
			resetPasswordTokenExpiresAt: sql`NOW() + INTERVAL '1 HOUR'`,
		})
		.where(eq(userTable.id, user.id));

	const resetUrl = `${getClientUrl()}/reset-password/${resetPasswordToken}`;
	await sendResetPasswordResetEmail(email, resetUrl);

	return c.json({ success: true, message: "Password reset email sent successfully" }, 200);
};

export const resetPassword = async (c: Context, token: string, { password }: ResetPasswordInput) => {
	const user = await drizzlePgClient
		.select({
			id: userTable.id,
		})
		.from(userTable)
		.where(and(eq(userTable.resetPasswordToken, token), gt(userTable.resetPasswordTokenExpiresAt, sql`NOW()`)))
		.then((result) => result.at(0));

	console.log("🚀 ~ auth.ts:239 ~ resetPassword ~ user: ", user);

	if (!user) {
		return c.json({ error: "Invalid or expires reset token", success: false }, 400);
	}

	const passwordHash = await Bun.password.hash(password, {
		algorithm: "bcrypt",
	});

	if (!user.id) {
		return c.json({ error: "Something wrong with user id!" }, 500);
	}
	await drizzlePgClient
		.update(userTable)
		.set({
			passwordHash,
			resetPasswordToken: null,
			resetPasswordTokenExpiresAt: null,
		})
		.where(eq(userTable.id, user.id));

	return c.json({ success: true, message: "Password updated successfully!" }, 200);
};
