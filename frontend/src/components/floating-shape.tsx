"use client";

import { motion } from "motion/react";

type FloatingShapeProps = {
  color: string;
  size: string;
  top: string;
  left: string;
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
      className={`absolute rounded-full ${color} ${size} opacity-20 blur-xl`}
      style={{ top, left }}
      animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: [0, 360],
      }}
      transition={{
        duration: 30,
        ease: "linear",
        repeat: Infinity,
        delay,
      }}
      aria-hidden
    ></motion.div>
  );
};
