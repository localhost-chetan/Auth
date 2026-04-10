"use client";

import { Button } from "@shadcn/button";
import { motion } from "motion/react";
import { InputWithIcon } from "@components/input-with-icon";
import { Lock, Mail, User } from "lucide-react";
import { PasswordStrengthMeter } from "@components/password-strength-meter";
import { AuthSwitchLink } from "@components/auth-switch-link";

export const RegisterForm = () => {
  return (
    <div className="text-primary-foreground relative w-[clamp(330px,50vw,400px)] rounded-xl bg-gray-800/50 shadow-xl">
      <div className="absolute inset-0 -z-10 rounded-xl bg-white/5 backdrop-blur-xl" />
      <div className="p-2 sm:p-4 md:p-6 lg:p-8">
        <h1 className="mb-6 bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-center text-lg font-bold text-transparent md:text-2xl">
          Register Now
        </h1>

        <form onSubmit={() => {}}>
          <div className="my-3 space-y-4">
            <InputWithIcon icon={User} placeholder="Your username" autoFocus />
            <InputWithIcon icon={Mail} placeholder="Your email" type="email" />
            <InputWithIcon
              icon={Lock}
              placeholder="Your password"
              type="password"
            />
            <PasswordStrengthMeter password={`ChetanSeervi_2361`} />
          </div>

          <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 200, duration: 0.3 }}
          >
            <Button
              className="text-md w-full cursor-pointer bg-linear-to-br from-green-600 to-emerald-600 px-2 py-5 shadow-2xl"
              type="submit"
            >
              Register
            </Button>
          </motion.div>
        </form>
      </div>
      <AuthSwitchLink href="/login" text="Already have an account?" />
    </div>
  );
};
