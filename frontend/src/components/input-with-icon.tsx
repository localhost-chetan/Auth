import { type LucideIcon } from "lucide-react";
import { type InputHTMLAttributes } from "react";

type InputWithIconProps = InputHTMLAttributes<HTMLInputElement> & {
  icon: LucideIcon;
};

export const InputWithIcon = ({
  icon: Icon,
  placeholder,
  ...props
}: InputWithIconProps) => {
  return (
    <div className="relative">
      <Icon className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400" />
      <input
        {...props}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
      />
    </div>
  );
};
