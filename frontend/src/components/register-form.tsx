"use client";

import { InputWithIcon } from "@components/input-with-icon";
import { Lock, Mail, User } from "lucide-react";
import { PasswordStrengthMeter } from "@components/password-strength-meter";
import { AuthSwitchLink } from "@components/auth-switch-link";
import { FormTitle } from "@components/form-title";
import { FormWrapper } from "@components/form-wrapper";
import { ActionButton } from "@components/action-button";

export const RegisterForm = () => {
  return (
    <FormWrapper>
      <div className="p-2 sm:p-4 md:p-6 lg:p-8">
        <FormTitle title="Register Now" />

        <form onSubmit={() => {}}>
          <div className="my-3 space-y-4">
            <InputWithIcon icon={User} placeholder="Your username" autoFocus />
            <InputWithIcon
              icon={Mail}
              placeholder="Your email"
              type="email"
              inputMode="email"
            />
            <InputWithIcon
              icon={Lock}
              placeholder="Your password"
              type="password"
            />
            <PasswordStrengthMeter password={`Localhost_Chetan@2361`} />
          </div>
          <ActionButton text="Register" type="submit" />
        </form>
      </div>
      <AuthSwitchLink href="/login" text="Already have an account?" />
    </FormWrapper>
  );
};
