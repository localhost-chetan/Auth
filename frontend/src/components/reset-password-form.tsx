'use client'

import { FormWrapper } from "@components/form-wrapper"
import { InputWithIcon } from "@components/input-with-icon"
import { Lock } from "lucide-react"
import { useState, type SubmitEvent } from "react"
import { ActionButton } from "@components/action-button"
import { FormTitle } from "@components/form-title"
import { useAuthActions } from "@/store/authStore"
import { FormError } from "@components/FormError"
import { toast } from "sonner"
import { PasswordStrengthMeter } from "@components/password-strength-meter"
import { AuthSwitchLink } from "@components/auth-switch-link"
import { useRouter } from "next/navigation"

type ResetPasswordFormProps = {
    token: string
}

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [error, setError] = useState("")
    const router = useRouter()

    const { resetPassword } = useAuthActions()

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            if (newPassword !== confirmPassword) {
                setError("Passwords do not match")
                return
            }
            const message = await resetPassword(token, newPassword)
            router.push("/login")
            toast.success(message)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An error occurred")
            setError(error instanceof Error ? error.message : "An error occurred")
        }
    }

    return (
        <FormWrapper>
            <div className="p-2 sm:p-4 md:p-6 lg:p-8">
                <FormTitle title="Reset Password" />

                <form onSubmit={handleSubmit} >
                    <div className="space-y-4">
                        <InputWithIcon icon={Lock} autoFocus placeholder="New Password" required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                        <InputWithIcon icon={Lock} placeholder="Confirm Password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                    </div>

                    {error && <FormError error={error} />}

                    <PasswordStrengthMeter password={newPassword} className="my-4" />
                    <ActionButton text="Reset Password" />
                </form>
            </div>

            <AuthSwitchLink href="/login" text="Remember your password?" />
        </FormWrapper>
    )
}