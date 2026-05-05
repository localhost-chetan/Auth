"use client";

import { FormTitle } from "@components/form-title";
import { FormWrapper } from "@components/form-wrapper";
import { InputWithIcon } from "@components/input-with-icon";
import { Lock, Mail } from "lucide-react";
import { ActionButton } from "@components/action-button";
import { AuthSwitchLink } from "@components/auth-switch-link";
import Link from "next/link";
import { useAuthActions, useAuthStore } from "@/store/authStore";
import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormError } from "@components/FormError";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter()

  const { login } = useAuthActions()
  const error = useAuthStore((state) => state.error);

  const handleLogin = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await login(email, password);
      router.push("/dashboard")
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error((error as Error).message || "Failed to login. Please try again.");
    }
  }

  return (
    <FormWrapper>
      <div className="p-2 sm:p-4 md:p-6 lg:p-8">
        <FormTitle title="Welcome Back" />

        <form onSubmit={handleLogin}>
          <div className="my-3 space-y-4">
            <InputWithIcon
              icon={Mail}
              placeholder="Your email"
              type="email"
              autoFocus
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
          </div>

          <div className="mt-2 text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-green-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {error && <FormError error={error} />}

          <ActionButton text="Login" type="submit" />
        </form>
      </div>

      <AuthSwitchLink href="/register" text="Don't have an account?" />
    </FormWrapper>
  );
};
