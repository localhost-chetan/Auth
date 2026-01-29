import { Hono } from "hono";
import { logOut, signIn, signUp, verifyEmail } from "@api/controllers/user";
import { validator } from "hono/validator";
import { signUpSchema, verificationSchema } from "@api/types/user";

export const authRoute = new Hono()
	.basePath("/api/auth/")

	.post(
		"/sign-up",
		validator("json", (value, c) => {
			const { success, data } = signUpSchema.safeParse(value);

			if (success) {
				return data;
			}
			return c.json({ error: `Invalid request body, Please provide correct JSON data` }, 400);
		}),
		(c) => {
			const validBody = c.req.valid("json");
			return signUp(c, validBody);
		},
	)

	.get("/sign-in", signIn)

	.delete("/logout", (c) => {
		return logOut(c);
	})

	.post(
		"/verify-email",
		validator("json", (value, c) => {
			const { success, data } = verificationSchema.safeParse(value);

			if (success) return data;

			return c.json({ error: "Invalid Verification Code!" }, 400);
		}),
		(c) => {
			const { verificationCode } = c.req.valid("json");
			return verifyEmail(c, verificationCode);
		},
	);
