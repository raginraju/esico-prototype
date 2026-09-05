import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gradient" | "secondary";
}

export function Button({
  className,
  variant = "gradient",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold text-[13px] rounded-[3px] shadow-sm transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    gradient:
      "bg-gradient-to-r from-[#b765ff] to-[#9c45ff] hover:from-[#a852fa] hover:to-[#8d34f5] text-white py-2.5 px-6",
    primary: "bg-[#00623a] hover:bg-[#004d2e] text-white py-2.5 px-6",
    secondary: "border border-[#e8eaf0] bg-white hover:bg-neutral-50 text-[#22242a] py-2.5 px-6",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}