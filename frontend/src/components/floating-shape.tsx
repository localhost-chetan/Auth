"use client";

import { motion } from "motion/react";

type FloatingShapeProps = Record<"color" | "size" | "top" | "left", string> & {
  delay: number;
};

export const FloatingShape = ({
  color,
  delay,
  left,
  size,
  top,
}: FloatingShapeProps) => {
  return (
    <motion.div
      className={`absolute rounded-full opacity-70 blur-xl ${size} ${color}`}
      style={{ top, left }}
      initial={{ x: 0, y: 0, rotate: 0 }}
      animate={{
        x: [0, `${Math.ceil(Math.random() * 1000)}px`],
        y: [0, `${Math.ceil(Math.random() * 1000)}px`],
        rotate: [0, 360],
      }}
      transition={{
        ease: "linear",
        duration: 60,
        repeat: Infinity,
        delay,
      }}
      aria-hidden
    />
  );
};
