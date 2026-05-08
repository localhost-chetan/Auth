'use client';

import { FormWrapper } from "@components/form-wrapper"
import { FormTitle } from "@components/form-title"
import { useAuthActions } from "@/store/authStore"
import { InputWithIcon } from "@components/input-with-icon";
import { Mail } from "lucide-react";
import { ActionButton } from "@components/action-button";
import { AuthSwitchLink } from "@components/auth-switch-link";
import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";

const FormText = ({ text }: { text: string }) => {
    return <p className="text-secondary/85 text-sm md:text-sm text-balance text-center">{text}</p>
}

export const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const { forgotPassword } = useAuthActions()

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await forgotPassword(email)
            setIsSubmitted(true);
        } catch (error) {
            toast.error((error as Error).message || "Failed to send reset link. Please try again.");
        }
    }

    return (
        <FormWrapper >
            <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                <FormTitle title="Forgot Password" />

                {isSubmitted ? (
                    <FormText text={`If an account exists for ${email}, you'll recieve a password reset link shortly.`} />
                ) :
                    <div>
                        <FormText text="Enter your email address and we'll send you a link to reset your password." />

                        <form onSubmit={handleSubmit}>
                            <InputWithIcon required icon={Mail} placeholder="Enter your email" inputMode="email" autoFocus className="mt-5" value={email} onChange={(event) => { setEmail(event.target.value) }} />
                            <ActionButton text="Send Reset Link" />
                        </form>
                    </div>
                }
            </div>
            <AuthSwitchLink href="/login" text="Remember your password?" />
        </FormWrapper>
    )
}