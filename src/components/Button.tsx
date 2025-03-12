
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "gradient" | "outlined" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  isLoading?: boolean;
}

const Button = ({
  children,
  variant = "gradient",
  size = "md",
  className,
  isLoading = false,
  ...props
}: ButtonProps) => {
  const sizeClasses = {
    sm: "text-sm py-2 px-4",
    md: "py-3 px-6",
    lg: "text-lg py-4 px-8",
    xl: "text-xl py-5 px-10",
  };

  const variantClasses = {
    gradient: "btn-gradient",
    outlined: "btn-outlined",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-800 dark:hover:bg-gray-800 dark:text-gray-300",
  };

  return (
    <button
      className={cn(
        "rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-wassalni-blue/50 active:scale-95 disabled:opacity-70 disabled:pointer-events-none",
        sizeClasses[size],
        variantClasses[variant],
        isLoading && "relative !text-transparent pointer-events-none",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {children}
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-white dark:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
    </button>
  );
};

export default Button;
