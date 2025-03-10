
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "gradient" | "outlined" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Button = ({
  children,
  variant = "gradient",
  size = "md",
  className,
  ...props
}: ButtonProps) => {
  const sizeClasses = {
    sm: "text-sm py-2 px-4",
    md: "py-3 px-6",
    lg: "text-lg py-4 px-8",
  };

  const variantClasses = {
    gradient: "btn-gradient",
    outlined: "btn-outlined",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-800",
  };

  return (
    <button
      className={cn(
        "rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-wassalni-blue/50",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
