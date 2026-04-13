"use client";

import { motion } from "motion/react";
import { Button } from "@shadcn/button";
import { Loader } from "lucide-react";

type ActionButtonProps = {
  text: string;
  type?: "button" | "submit" | "reset";
};

export const ActionButton = ({ text, type }: ActionButtonProps) => {
  const isLoading = !true;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 200, duration: 0.5 }}
      className="mt-5"
    >
      <Button
        className="text-md w-full cursor-pointer bg-linear-to-br from-green-600 to-emerald-700 px-2 py-5 shadow-2xl"
        type={type}
        disabled={isLoading}
      >
        {isLoading ? <Loader className="size-5 animate-spin" /> : text}
      </Button>
    </motion.div>
  );
};
