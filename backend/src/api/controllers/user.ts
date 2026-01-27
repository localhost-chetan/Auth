import { type User, userTable } from "@/db/schema";
import { drizzlePgClient } from "@lib/clients/drizzle";
import { type SignUpInput } from "@api/types/user";
import { type Context } from "hono";
import { sql } from "drizzle-orm";
import { setAccessTokenCookie } from "@api/services/jwt";

export const signUp = async (c: Context, { name, email, password }: SignUpInput) => {
	const userAlreadyExists = await drizzlePgClient.execute(sql`
        SELECT 1 FROM ${userTable} WHERE email = ${email} LIMIT 1;
    `);

	console.log("🚀 ~ user.ts:12 ~ signUp ~ userAlreadyExists: ", userAlreadyExists);

	if (userAlreadyExists.length >= 1) {
		return c.json({ error: "User with this email already exists" }, 400);
	}
	const passwordHash = await Bun.password.hash(password, {
		algorithm: "bcrypt",
	});
	const verificationToken = Math.round(Math.random() * 10_00_000).toString();

	const newUser = (await drizzlePgClient.execute(sql`
        INSERT INTO ${userTable} (name, email, password_hash, verification_token, verification_token_expires_at)
	    VALUES (
	        ${name},
	        ${email},
	        ${passwordHash},
	        ${verificationToken},
	        NOW() + INTERVAL '1 DAY'
	    )
	    RETURNING *
	`)) as User[];

	// Type guard
	const createdUser = newUser.at(0);
	if (!createdUser) {
		return c.json({ error: "User creation failed!" }, 500);
	}

	await setAccessTokenCookie(c, { id: createdUser.id });

	return c.json(
		{ message: "New User created successfully!", data: createdUser },
		{
			status: 201,
		},
	);
};

export const signIn = async (c: Context) => {
	return c.json({ message: "Sign In Endpoint" });
};
