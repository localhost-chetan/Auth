import { MailtrapClient } from "mailtrap";
import { getMailtrapAPIKey } from "@utils/service-urls";

export const mailtrapClient = new MailtrapClient({
	token: getMailtrapAPIKey(),
});

export const sender = {
	email: "hello@demomailtrap.co",
	name: "Chetan",
};
