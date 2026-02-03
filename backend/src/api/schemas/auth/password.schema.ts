import z from "zod";

export const passwordStringSchema = z.string().min(8).max(50, { message: "Password must be at most 50 characters" });

export type Password = z.infer<typeof passwordStringSchema>;
