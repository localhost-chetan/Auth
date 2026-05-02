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

export const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const error = useAuthStore((state) => (state.error));
  const { register } = useAuthActions();
  const router = useRouter();

  const handleSignUp = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle sign-up logic here

    try {
      await register(email, password, name);
      router.push("/verify-email");

    } catch (error) {
      console.error("Error occurred while registering: ", error);
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

            {error && <p className="text-destructive brightness-125 text-sm font-semibold mt-2">{error}</p>}

            <PasswordStrengthMeter password={password} />
          </div>
          <ActionButton text="Register" type="submit" />
        </form>
      </div>
      <AuthSwitchLink href="/login" text="Already have an account?" />
    </FormWrapper>
  );
};
