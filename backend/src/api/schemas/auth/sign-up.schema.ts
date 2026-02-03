import z from "zod";
import { signInSchema } from "@api/schemas/auth/sign-in.schema";

export const signUpSchema = signInSchema.extend({
	name: z.string().min(1).max(255, { message: "Name must be at most 255 characters" }),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
