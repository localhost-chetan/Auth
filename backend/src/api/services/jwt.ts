import { sign } from "hono/jwt";
import { type Context } from "hono";
import { getJWTPrivateKey } from "@utils/service-urls";
import { setCookie } from "hono/cookie";
import { type JWTPayload, type UserId } from "@api/schemas/jwt";

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
		secure: isProduction, // cookie will only be sent over HTTPS in production
		sameSite: isProduction ? "strict" : "lax", // in production, cookie will only be sent for same site requests, in development, cookie will be sent for cross site requests as well
		maxAge: 24 * 60 * 60, // 24 hours
	});
};

