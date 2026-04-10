"use client";

import { FormTitle } from "@components/form-title";
import { FormWrapper } from "@components/form-wrapper";
import { InputWithIcon } from "@components/input-with-icon";
import { Lock, Mail } from "lucide-react";
import { ActionButton } from "@components/action-button";
import { AuthSwitchLink } from "@components/auth-switch-link";
import Link from "next/link";

export const LoginForm = () => {
  return (
    <FormWrapper>
      <div className="p-2 sm:p-4 md:p-6 lg:p-8">
        <FormTitle title="Welcome Back" />

        <form onSubmit={() => {}}>
          <div className="my-3 space-y-4">
            <InputWithIcon
              icon={Mail}
              placeholder="Your email"
              type="email"
              autoFocus
              inputMode="email"
            />
            <InputWithIcon
              icon={Lock}
              placeholder="Your password"
              type="password"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="mt-2 text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-green-500 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <ActionButton text="Login" type="submit" />
        </form>
      </div>

      <AuthSwitchLink href="/register" text="Don't have an account?" />
    </FormWrapper>
  );
};
