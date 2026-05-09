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
import { type UserId } from "@api/schemas/jwt";
import { type ApiResponse } from "@lib/types";

export const register = async (c: Context, { name, email, password }: SignUpInput) => {
	const existingUser = await drizzlePgClient
		.select({ id: userTable.id })
		.from(userTable)
		.where(eq(userTable.email, email))
		.limit(1)
		.then((result) => result.at(0));

	if (existingUser) {
		return c.json({ error: "User with this email already exists" }, 400);
	}

	const hashedPassword = await Bun.password.hash(password, { algorithm: "bcrypt" });
	const emailVerificationToken = generateOTP();

	const registeredUser = await drizzlePgClient
		.insert(userTable)
		.values({
			name,
			email,
			passwordHash: hashedPassword,
			verificationToken: emailVerificationToken,
			verificationTokenExpiresAt: sql`NOW() + interval '10 MINUTES'`,
		})
		.returning({
			id: userTable.id,
			name: userTable.name,
			email: userTable.email,
			isVerified: userTable.isVerified,
			lastLogin: userTable.lastLogin,
			createdAt: userTable.createdAt,
			updatedAt: userTable.updatedAt,
			verificationToken: userTable.verificationToken,
		})
		.then((result) => result.at(0));

	if (!registeredUser) {
		return c.json({ error: "User creation failed" }, 500);
	}

	try {
		if (!registeredUser.verificationToken) {
			return c.json({ error: "Something went wrong with verification token" }, 500);
		}
		await sendVerificationEmail(registeredUser.email, registeredUser.verificationToken);
	} catch (error) {
		return c.json({ error: error instanceof Error ? error.message : "Something went wrong" }, 500);
	}

	const { verificationToken: _, ...safeRegisteredUser } = registeredUser;

	return c.json<ApiResponse<typeof safeRegisteredUser>>(
		{ message: "Registration successful! Please check your email to verify your account.", data: safeRegisteredUser },
		201,
	);
};

export const login = async (c: Context, { email, password }: SignInInput) => {
	const user = await drizzlePgClient
		.select({
			id: userTable.id,
			email: userTable.email,
			passwordHash: userTable.passwordHash,
			lastLogin: userTable.lastLogin,
			name: userTable.name,
			isVerified: userTable.isVerified,
			createdAt: userTable.createdAt,
			updatedAt: userTable.updatedAt,
		})
		.from(userTable)
		.where(eq(userTable.email, email))
		.limit(1)
		.then((result) => result.at(0));

	// Same message for both cases — prevents email enumeration
	if (!user || !(await Bun.password.verify(password, user.passwordHash))) {
		return c.json({ error: "Invalid email or password" }, 400);
	}

	await setAccessTokenCookie(c, user.id);

	await drizzlePgClient
		.update(userTable)
		.set({ lastLogin: sql`NOW()` })
		.where(eq(userTable.id, user.id));

	const { passwordHash: _, ...safeUser } = user;

	return c.json<ApiResponse<typeof safeUser>>({ message: "Logged in successfully", data: safeUser }, 200);
};

export const logOut = (c: Context) => {
	deleteCookie(c, "access_token");
	return c.json({ message: "Logged out successfully" }, 200);
};

export const verifyEmail = async (c: Context, verificationCode: VerificationCode) => {
	const user = await drizzlePgClient
		.select({
			email: userTable.email,
			isVerified: userTable.isVerified,
			verificationToken: userTable.verificationToken,
			verificationTokenExpiresAt: userTable.verificationTokenExpiresAt,
		})
		.from(userTable)
		.where(
			and(
				eq(userTable.verificationToken, verificationCode),
				gt(userTable.verificationTokenExpiresAt, sql`NOW()`),
			),
		)
		.then((result) => result.at(0));

	if (!user) {
		return c.json({ error: "Verification token is invalid or expired" }, 400);
	}

	await drizzlePgClient
		.update(userTable)
		.set({
			isVerified: true,
			verificationToken: null,
			verificationTokenExpiresAt: null,
		})
		.where(eq(userTable.email, user.email));

	return c.json({ message: "Email verified successfully" }, 200);
};

export const forgotPassword = async (c: Context, email: string) => {
	const user = await drizzlePgClient
		.select({ id: userTable.id })
		.from(userTable)
		.where(eq(userTable.email, email))
		.then((result) => result.at(0));

	if (!user) {
		return c.json({ error: "User with this email not found" }, 404);
	}

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

	return c.json({ message: "Password reset email sent successfully" }, 200);
};

export const resetPassword = async (c: Context, token: string, password: ResetPasswordInput) => {
	const user = await drizzlePgClient
		.select({ id: userTable.id })
		.from(userTable)
		.where(and(eq(userTable.resetPasswordToken, token), gt(userTable.resetPasswordTokenExpiresAt, sql`NOW()`)))
		.then((result) => result.at(0));

	if (!user) {
		return c.json({ error: "Reset token is invalid or expired" }, 400);
	}

	const passwordHash = await Bun.password.hash(password, { algorithm: "bcrypt" });

	await drizzlePgClient
		.update(userTable)
		.set({
			passwordHash,
			resetPasswordToken: null,
			resetPasswordTokenExpiresAt: null,
		})
		.where(eq(userTable.id, user.id));

	return c.json({ message: "Password reset successfully! You can now login with your new password." }, 200);
};

export const checkAuth = async (c: Context, userId: UserId) => {
	try {
		const user = await drizzlePgClient
			.select({
				id: userTable.id,
				name: userTable.name,
				email: userTable.email,
				isVerified: userTable.isVerified,
				lastLogin: userTable.lastLogin,
				createdAt: userTable.createdAt,
				updatedAt: userTable.updatedAt,
			})
			.from(userTable)
			.where(eq(userTable.id, userId))
			.limit(1)
			.then((result) => result.at(0));

		if (!user) {
			return c.json({ error: "User not found" }, 404);
		}

		return c.json<ApiResponse<typeof user>>({ data: user }, 200);
	} catch (error) {
		return c.json({ error: "Internal server error" }, 500);
	}
};