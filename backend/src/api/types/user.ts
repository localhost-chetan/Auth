import { User } from "@/db/schema";
import z from "zod";

export const signUpSchema = z.object({
	name: z.string().min(1).max(255, { error: "Name must be at most 255 characters" }),
	email: z.email().max(255, { error: "Email must be at most 255 characters" }),
	password: z.string().min(8).max(50, { error: "Password must be at most 50 characters" }),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export type JWTPayload = {
	sub: Pick<User, "id">;
	exp: number;
};
