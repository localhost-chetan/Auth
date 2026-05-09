import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};


export const formatDate = (date: Date | null | undefined) =>
  date ? new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "N/A";

export const formatTime = (date: Date | null | undefined) =>
  date ? new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",

  }) : "N/A";