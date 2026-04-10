import { Check, X } from "lucide-react";

type PasswordCriteriaProps = {
  password: string;
};

const PasswordCriteria = ({ password }: PasswordCriteriaProps) => {
  const criteria = [
    {
      label: "At least 8 characters",
      isMet: password.length >= 8,
    },
    {
      label: "Contains uppercase letter",
      isMet: /[A-Z]/.test(password),
    },
    {
      label: "Contains lowercase letter",
      isMet: /[a-z]/.test(password),
    },
    {
      label: "Contains number",
      isMet: /\d/.test(password),
    },
    {
      label: "Contains special character",
      isMet: /[!@#$%^&*()_+-]/.test(password),
    },
  ];
  return (
    <div className="mt-2 space-y-1">
      {criteria.map(({ label, isMet }) => (
        <div key={label} className="flex items-center text-xs sm:text-sm">
          <span className="*:size-5">
            {isMet ? <Check className="text-green-400" /> : <X />}
          </span>
          <span
            className={`ml-2 ${isMet ? "text-green-500" : "text-gray-400"}`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

type PasswordStrengthMeterProps = {
  password: string;
};

const getStrengthText = (strength: number) => {
  switch (strength) {
    case 0:
      return "Very Weak";
    case 1:
      return "Weak";
    case 2:
      return "Fair";
    case 3:
      return "Good";
    case 4:
      return "Strong";
    default:
      return "Strength";
  }
};

const getStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*()_+-]/.test(password)) strength++;
  return strength;
};

const getColor = (strength: number) => {
  switch (strength) {
    case 0:
      return "bg-red-500";
    case 1:
      return "bg-red-400";
    case 2:
      return "bg-yellow-500";
    case 3:
      return "bg-green-400";
    case 4:
      return "bg-green-600";
    default:
      return "bg-gray-400/30";
  }
};

export const PasswordStrengthMeter = ({
  password,
}: PasswordStrengthMeterProps) => {
  const strength = getStrength(password);

  return (
    <div className="mt-2">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="">Password Strength</span>
        <span className="">{getStrengthText(strength)}</span>
      </div>
      <div className="flex gap-x-0.5">
        {[...Array(4)]
          // .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className={`h-2 w-1/4 rounded-sm transition-colors duration-300 ${index < strength ? getColor(strength) : "bg-gray-500"}`}
            />
          ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
};
