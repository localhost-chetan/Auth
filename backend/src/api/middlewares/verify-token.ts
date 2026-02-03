import { type Context, type Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { getJWTPrivateKey } from "@utils/service-urls";

export const verifyToken = async (c: Context, next: Next) => {
	const accessToken = getCookie(c, "access_token");

	console.log("🚀 ~ auth.ts:15 ~ accessToken: ", accessToken);

	if (!accessToken) {
		return c.json({ message: "Unauthorized" }, 401);
	}

	try {
		const decodedPayload = await verify(accessToken, getJWTPrivateKey(), "HS256");

		console.log("🚀 ~ auth.ts:24 ~ decodedPayload: ", decodedPayload);

		if (!decodedPayload.sub) {
			return c.json({ message: "Unauthorized" }, 401);
		}

		c.set("jwtPayload", decodedPayload);
		await next();
	} catch (error) {
		console.log(`Error in verifying token => ${error}`);
		return c.json({ error: "Server Error" }, 500);
	}
};
