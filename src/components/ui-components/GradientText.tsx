
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

const GradientText = ({ children, className }: GradientTextProps) => {
  return (
    <span className={cn("gradient-text", className)}>
      {children}
    </span>
  );
};

export default GradientText;
