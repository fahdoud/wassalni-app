
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import UserControls from "./UserControls";

const DesktopNavigation = () => {
  const { t } = useLanguage();

  return (
    <nav className="hidden md:flex items-center gap-8">
      <ul className="flex items-center gap-6">
        <li>
          <a
            href="#features"
            className="text-gray-700 hover:text-wassalni-green transition-colors dark:text-gray-300 dark:hover:text-wassalni-lightGreen"
          >
            {t('nav.features')}
          </a>
        </li>
        <li>
          <a
            href="#how-it-works"
            className="text-gray-700 hover:text-wassalni-green transition-colors dark:text-gray-300 dark:hover:text-wassalni-lightGreen"
          >
            {t('nav.howItWorks')}
          </a>
        </li>
        <li>
          <Link
            to="/feedback"
            className="text-gray-700 hover:text-wassalni-green transition-colors dark:text-gray-300 dark:hover:text-wassalni-lightGreen"
          >
            {t('nav.feedback')}
          </Link>
        </li>
      </ul>
      <div className="flex items-center gap-3">
        <UserControls />
      </div>
    </nav>
  );
};

export default DesktopNavigation;
