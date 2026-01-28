import { type User } from "@/db/schema";
import { mailtrapClient, sender } from "@lib/clients/mailtrap";
import { VERIFICATION_EMAIL_TEMPLATE } from "@lib/templates/email-templates";

export const sendVerificationEmail = async (
	email: Pick<User, "email">["email"],
	verificationCode: Pick<User, "verificationToken">["verificationToken"],
) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Verify Your Email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("verificationCode", verificationCode),
			category: "Email Verification",
		});
		console.log(`Email sent successfully => ${response}`);
	} catch (error) {
		console.log(`Error sending email: ${error}`);
		throw new Error(`${error}`);
	}
};
