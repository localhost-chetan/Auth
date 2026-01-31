import { resendClient } from "@lib/clients/resend";
import { type Email, type VerificationCode } from "@api/types/user";

export const sendVerificationEmail = async (email: Email, verificationCode: VerificationCode) => {
	if (!verificationCode) {
		throw new Error("Verification code is missing!");
	}

	const recipient = [email];

	const { data, error } = await resendClient.emails.send({
		from: "Auth <onboarding@resend.dev>",
		to: recipient,
		subject: "Verify Your Email",
		text: `Your verification code is ${verificationCode}`,
	});

	if (!error) {
		console.log(`Email sent successfully => ${JSON.stringify(data)}`);
	} else {
		throw new Error(error?.message);
	}
};

export const sendResetPasswordResetEmail = async (email: Email, resetUrl: string) => {
	const recipient = [email];
	const { data, error } = await resendClient.emails.send({
		from: "Auth <onboarding@resend.dev>",
		to: recipient,
		subject: "Reset Password",
		text: resetUrl,
	});

	if (!error) {
		console.log(`Email sent successfully => ${JSON.stringify(data)}`);
	} else {
		throw new Error(error?.message);
	}
};
