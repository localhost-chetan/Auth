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
        x: [0, "80vw", "40vw", "-40vw", "-20vw", 0],
        y: [0, "70vh", "-40vh", "35vh", "-20vh", 0],
        rotate: [0, 360],
      }}
      transition={{
        ease: "linear",
        duration: 120,
        repeat: Infinity,
        delay,
      }}
      aria-hidden
    />
  );
};
