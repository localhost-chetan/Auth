import { sign } from "hono/jwt";
import { type UserId, type JWTPayload } from "@/api/schemas/user";
import { Context } from "hono";
import { getJWTPrivateKey } from "@utils/service-urls";
import { setCookie } from "hono/cookie";

const generateAccessToken = async (userId: UserId) => {
	const payload: JWTPayload = {
		sub: userId,
		exp: Date.now() / 1000 + 60 * 10, // Access Token expires in 10 minutes
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
