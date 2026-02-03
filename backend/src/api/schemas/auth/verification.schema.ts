import z from "zod";

export const verificationSchema = z.object({
	verificationCode: z.string().min(6).max(6),
});

export type VerificationCode = z.infer<typeof verificationSchema>["verificationCode"];
