import { sign } from "hono/jwt";
import { type Context } from "hono";
import { getJWTPrivateKey } from "@utils/service-urls";
import { setCookie } from "hono/cookie";
import { type JWTPayload, type UserId } from "@api/schemas/jwt";
import { drizzlePgClient } from "@lib/clients/drizzle";
import { sql } from "drizzle-orm";

const generateAccessToken = async (userId: UserId) => {
	const payload: JWTPayload = {
		sub: userId,
		exp: Date.now() / 1000 + 60 * 60, // Access Token expires in 60 minutes
	};

	return sign(payload, getJWTPrivateKey(), "HS256");
};

export const setAccessTokenCookie = async (c: Context, userId: UserId) => {
	const isProduction = process.env.NODE_ENV === "production";

	setCookie(c, "access_token", await generateAccessToken(userId), {
		httpOnly: true, // cookie can not be accessed by client side Javascript, only accessed by the server
		secure: isProduction,
		sameSite: isProduction ? "strict" : "none",
		maxAge: 24 * 60 * 60, // 24 hours
	});
};

export const checkAuth = async (c: Context, userId: UserId) => {
	try {
		const user = (
			await drizzlePgClient.execute(sql`
			SELECT
				id,
				name,
				email,
				is_verified
			FROM
				public.users
			WHERE
				id = ${userId};
			`)
		).at(0);

		console.log("🚀 ~ jwt.ts:45 ~ checkAuth ~ user: ", user);

		if (!user) {
			return c.json({ success: false, message: "User not found" }, 400);
		}

		return c.json({ success: true, user });
	} catch (error) {
		console.log(`Error in checkAuth => ${error}`);
		return c.json({ success: false, message: error });
	}
};
