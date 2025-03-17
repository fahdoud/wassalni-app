
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import UserControls from "./UserControls";

interface MobileNavigationProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

const MobileNavigation = ({ toggleMenu, isMenuOpen }: MobileNavigationProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="md:hidden flex items-center gap-2">
      <button
        className="text-gray-700 focus:outline-none dark:text-gray-300"
        onClick={toggleMenu}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-slide-down dark:bg-gray-900">
          <nav className="container mx-auto px-4 py-4">
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="#features"
                  className="block py-2 text-gray-700 hover:text-wassalni-green transition-colors dark:text-gray-300 dark:hover:text-wassalni-lightGreen"
                  onClick={toggleMenu}
                >
                  {t('nav.features')}
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="block py-2 text-gray-700 hover:text-wassalni-green transition-colors dark:text-gray-300 dark:hover:text-wassalni-lightGreen"
                  onClick={toggleMenu}
                >
                  {t('nav.howItWorks')}
                </a>
              </li>
              <li>
                <Link
                  to="/feedback"
                  className="block py-2 text-gray-700 hover:text-wassalni-green transition-colors dark:text-gray-300 dark:hover:text-wassalni-lightGreen"
                  onClick={toggleMenu}
                >
                  {t('nav.feedback')}
                </Link>
              </li>
              <li className="pt-2">
                <div className="w-full" onClick={toggleMenu}>
                  <UserControls />
                </div>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileNavigation;
