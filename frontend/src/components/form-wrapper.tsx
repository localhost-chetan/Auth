import { type PropsWithChildren } from "react";

export const FormWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="text-primary-foreground relative w-[clamp(320px,50vw,400px)] rounded-xl bg-gray-800/50 shadow-xl">
      <div className="absolute inset-0 -z-10 rounded-xl bg-white/5 backdrop-blur-xl" />
      {children}
    </div>
  );
};
