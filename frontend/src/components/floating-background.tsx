import { FloatingShape } from "@components/floating-shape";

export const FloatingBackground = () => {
  return (
    <>
      <FloatingShape
        color="bg-green-500"
        size="size-64"
        top="-5%"
        left="-5%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="size-48"
        top="50%"
        left="25%"
        delay={2}
      />
      <FloatingShape
        color="bg-cyan-500"
        size="size-32"
        top="60%"
        left="70%"
        delay={4}
      />
    </>
  );
};
