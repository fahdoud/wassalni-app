
import { Link } from "react-router-dom";
import Button from "../Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import UserControls from "./UserControls";

const DesktopNavigation = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

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
        {user ? (
          <UserControls />
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/passenger-signin">
              <Button variant="outlined" size="sm">
                {t('nav.signIn')}
              </Button>
            </Link>
            <Link to="/passenger-signup">
              <Button size="sm">{t('nav.signUp')}</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DesktopNavigation;
