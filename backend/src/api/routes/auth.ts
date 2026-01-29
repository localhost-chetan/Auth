import { Hono } from "hono";
import { logOut, signIn, signUp } from "@api/controllers/user";
import { validator } from "hono/validator";
import { signUpSchema } from "@api/types/user";

export const authRoute = new Hono()
	.basePath("/api/auth/")

	.post(
		"/sign-up",
		validator("json", (value, c) => {
			const parsedBody = signUpSchema.safeParse(value);

			if (parsedBody.success) {
				return parsedBody.data;
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
	});
