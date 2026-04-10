import Link from "next/link";

type AuthSwitchLinkProps = Record<"href" | "text", string>;

export const AuthSwitchLink = ({ href, text }: AuthSwitchLinkProps) => {
  return (
    <div className="bg-primary/50 mt-4 flex items-center justify-center gap-2 rounded-b-lg py-4 text-xs sm:text-sm">
      <p>
        {`${text} `}
        <Link
          href={href}
          className="font-semibold text-green-400 hover:underline"
        >
          {href === "/login" ? "Log in" : "Register"}
        </Link>
      </p>
    </div>
  );
};
