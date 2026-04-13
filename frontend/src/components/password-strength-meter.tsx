import { Check, X } from "lucide-react";

const PASSWORD_CRITERIA = [
  {
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8,
  },
  {
    label: "Contains uppercase letters",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: "Contains lowercase letters",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    label: "Contains a number",
    test: (password: string) => /\d/.test(password),
  },
  {
    label: "Contains a special character",
    test: (password: string) => /[!@#$%^&*()_+-]/.test(password),
  },
];

type PasswordCriteriaProps = {
  password: string;
};

const PasswordCriteria = ({ password }: PasswordCriteriaProps) => {
  return (
    <div className="mt-2 space-y-1">
      {PASSWORD_CRITERIA.map(({ label, test }) => (
        <div key={label} className="flex items-center text-xs sm:text-sm">
          <span className="*:size-5">
            {test(password) ? <Check className="text-green-400" /> : <X />}
          </span>
          <span
            className={`ml-2 ${test(password) ? "text-green-500" : "text-gray-400"}`}
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
  return (
    PASSWORD_CRITERIA.filter((criteria) => criteria.test(password)).length - 1
  );
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
