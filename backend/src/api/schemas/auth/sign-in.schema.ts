import z from "zod";
import { passwordStringSchema } from "@api/schemas/auth/password.schema";

export const signInSchema = z.object({
	email: z.email().max(255, { message: "Email must be at most 255 characters" }),
	password: passwordStringSchema,
});

export type SignInInput = z.infer<typeof signInSchema>;
