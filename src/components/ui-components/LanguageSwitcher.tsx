
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={cn("relative group", className)}>
      <button
        className="flex items-center gap-1 text-gray-700 hover:text-wassalni-green transition-colors dark:text-gray-300 dark:hover:text-wassalni-lightGreen"
      >
        <Globe size={18} />
        <span className="uppercase text-sm">{language}</span>
      </button>
      <div className="absolute right-0 mt-2 py-2 w-32 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 dark:bg-gray-800">
        <button
          onClick={() => setLanguage('en')}
          className={`block w-full text-left px-4 py-2 text-sm ${
            language === 'en'
              ? 'text-wassalni-green font-medium dark:text-wassalni-lightGreen'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage('fr')}
          className={`block w-full text-left px-4 py-2 text-sm ${
            language === 'fr'
              ? 'text-wassalni-green font-medium dark:text-wassalni-lightGreen'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          Français
        </button>
        <button
          onClick={() => setLanguage('ar')}
          className={`block w-full text-left px-4 py-2 text-sm ${
            language === 'ar'
              ? 'text-wassalni-green font-medium dark:text-wassalni-lightGreen'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          العربية
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
