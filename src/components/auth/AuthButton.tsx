import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const AuthButton = ({
  loading,
  disabled,
  children,
  className,
  type = "button",
  ...props
}: AuthButtonProps) => {
  return (
    <button
      type={type}
      {...props}
      disabled={disabled || loading}
      className={cn(
        "w-full h-11 rounded-xl bg-primary text-primary-foreground",
        "text-sm font-semibold tracking-wide",
        "transition-all hover:bg-primary/90 active:scale-[0.99]",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100",
        "flex items-center justify-center gap-2",
        className,
      )}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default AuthButton;
