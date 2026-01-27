import { sign } from "hono/jwt";
import { type JWTPayload } from "@api/types/user";
import { Context } from "hono";
import { type User } from "@/db/schema";
import { getJWTPrivateKey } from "@utils/service-urls";
import { setCookie } from "hono/cookie";

const generateAccessToken = async (userId: Pick<User, "id">) => {
	const payload: JWTPayload = {
		sub: userId,
		exp: Date.now() / 1000 + 60 * 60 * 24, // Access Token expires in 10 minutes
	};

	return sign(payload, getJWTPrivateKey(), "HS256");
};

export const setAccessTokenCookie = async (c: Context, userId: Pick<User, "id">) => {
	setCookie(c, "access_token", await generateAccessToken(userId), {
		httpOnly: true, // cookie can not be accessed by client side Javascript, only accessed by the server
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 24 * 60 * 60, // 24 hours
	});
};
