
import React from "react";
import { Link } from "react-router-dom";
import { Car, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface RoleSwitcherProps {
  currentRole: "passenger" | "driver";
  passengerLink: string;
  driverLink: string;
}

const RoleSwitcher = ({
  currentRole,
  passengerLink,
  driverLink,
}: RoleSwitcherProps) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-sm mx-auto mb-8 p-1 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center">
      <Link
        to={passengerLink}
        className={cn(
          "w-1/2 py-3 flex items-center justify-center gap-2 rounded-full transition-all duration-300",
          currentRole === "passenger"
            ? "bg-white dark:bg-gray-700 shadow-md text-wassalni-green dark:text-wassalni-lightGreen font-medium"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        )}
      >
        <User size={16} />
        <span>{t("auth.asPassenger")}</span>
      </Link>
      <Link
        to={driverLink}
        className={cn(
          "w-1/2 py-3 flex items-center justify-center gap-2 rounded-full transition-all duration-300",
          currentRole === "driver"
            ? "bg-white dark:bg-gray-700 shadow-md text-wassalni-green dark:text-wassalni-lightGreen font-medium"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        )}
      >
        <Car size={16} />
        <span>{t("auth.asDriver")}</span>
      </Link>
    </div>
  );
};

export default RoleSwitcher;
