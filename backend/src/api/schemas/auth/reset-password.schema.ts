import z from "zod";
import { passwordStringSchema } from "@api/schemas/auth/password.schema";

export const resetPasswordSchema = z.object({
	password: passwordStringSchema,
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
