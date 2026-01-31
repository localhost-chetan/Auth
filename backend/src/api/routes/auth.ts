import { Hono } from "hono";
import { logOut, register, login, verifyEmail, forgotPassword } from "@api/controllers/auth";
import { validator } from "hono/validator";
import { signInSchema, signUpSchema, verificationSchema } from "@api/types/user";

export const authRoute = new Hono()
	.basePath("/api/auth/")

	// /register
	.post(
		"/register",
		validator("json", (value, c) => {
			const { success, data } = signUpSchema.safeParse(value);

			if (success) {
				return data;
			}
			return c.json({ error: `Invalid request body, Please provide correct JSON data` }, 400);
		}),
		(c) => {
			const validBody = c.req.valid("json");
			return register(c, validBody);
		},
	)

	// login
	.post(
		"/login",
		validator("json", (value, c) => {
			const { success, data } = signInSchema.safeParse(value);
			if (success) return data;

			return c.json({ error: `Invalid request body, Please provide correct JSON data` }, 400);
		}),
		(c) => {
			const validBody = c.req.valid("json");
			return login(c, validBody);
		},
	)

	// logout
	.delete("/logout", (c) => {
		return logOut(c);
	})

	// /verify-email
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
	)

	// forgot-password
	.post(
		"forgot-password",
		validator("json", (value, c) => {
			const emailSchema = signInSchema.pick({ email: true });
			const { success, data } = emailSchema.safeParse(value);

			if (success) return data;

			return c.json({ error: "Invalid email id!" }, 400);
		}),
		(c) => {
			const { email } = c.req.valid("json");
			return forgotPassword(c, email);
		},
	);
