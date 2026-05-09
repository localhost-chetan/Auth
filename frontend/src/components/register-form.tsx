"use client";

import { InputWithIcon } from "@components/input-with-icon";
import { Lock, Mail, User } from "lucide-react";
import { PasswordStrengthMeter } from "@components/password-strength-meter";
import { AuthSwitchLink } from "@components/auth-switch-link";
import { FormTitle } from "@components/form-title";
import { FormWrapper } from "@components/form-wrapper";
import { ActionButton } from "@components/action-button";
import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions, useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { FormError } from "@components/FormError";

export const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const error = useAuthStore((state) => (state.error));

  const { register } = useAuthActions();
  const router = useRouter();

  const handleSignUp = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const message = await register(email, password, name);
      router.push("/verify-email");
      toast.success(message);
    } catch (error) {
      toast.error((error as Error).message || "Failed to register. Please try again.");
    }
  };

  return (
    <FormWrapper>
      <div className="p-2 sm:p-4 md:p-6 lg:p-8">
        <FormTitle title="Register Now" />

        <form onSubmit={handleSignUp}>
          <div className="my-3 space-y-4">
            <InputWithIcon icon={User} placeholder="Your username" autoFocus value={name} onChange={(e) => setName(e.target.value)} />
            <InputWithIcon
              icon={Mail}
              placeholder="Your email"
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputWithIcon
              icon={Lock}
              placeholder="Your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <FormError error={error} />}

            <PasswordStrengthMeter password={password} />
          </div>
          <ActionButton text="Register" type="submit" />
        </form>
      </div>
      <AuthSwitchLink href="/login" text="Already have an account?" />
    </FormWrapper>
  );
};
