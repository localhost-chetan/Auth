import { Resend } from "resend";
import { getResendAPIKey } from "@utils/service-urls";

export const resendClient = new Resend(getResendAPIKey());
