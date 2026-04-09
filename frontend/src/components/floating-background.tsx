import { FloatingShape } from "@components/floating-shape";

export const FloatingBackground = () => {
  return (
    <div className="fixed -z-10 min-h-screen w-full bg-linear-to-br from-gray-900 via-green-900 to-emerald-900">
      <FloatingShape
        color="bg-green-700"
        size="h-36 w-44"
        delay={0}
        top="5%"
        left="7%"
      />
      <FloatingShape
        color="bg-emerald-700"
        size="h-46 w-54"
        delay={0}
        top="10%"
        left="85%"
      />
      <FloatingShape
        color="bg-green-800"
        size="h-54 w-54"
        delay={0}
        top="75%"
        left="50%"
      />
    </div>
  );
};
