
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";
import GradientText from "./ui-components/GradientText";
import Logo from "./ui-components/Logo";
import LanguageSwitcher from "./ui-components/LanguageSwitcher";
import ThemeToggle from "./ui-components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-white/80 backdrop-blur-lg shadow-sm dark:bg-gray-900/80"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo size="md" />
          <h1 className="text-2xl font-bold tracking-tight">
            <GradientText>Wassalni</GradientText>
          </h1>
        </Link>

        {/* Desktop Navigation */}
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
                to="/rides"
                className="text-gray-700 hover:text-wassalni-green transition-colors dark:text-gray-300 dark:hover:text-wassalni-lightGreen"
              >
                {t('nav.testimonials')}
              </Link>
            </li>
          </ul>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button variant="outlined" size="sm">
              {t('nav.signIn')}
            </Button>
            <Button size="sm">{t('nav.signUp')}</Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            className="text-gray-700 focus:outline-none dark:text-gray-300"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
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
                  to="/rides"
                  className="block py-2 text-gray-700 hover:text-wassalni-green transition-colors dark:text-gray-300 dark:hover:text-wassalni-lightGreen"
                  onClick={toggleMenu}
                >
                  {t('nav.testimonials')}
                </Link>
              </li>
              <li className="flex flex-col gap-2 pt-2">
                <Button variant="outlined" className="w-full">
                  {t('nav.signIn')}
                </Button>
                <Button className="w-full">{t('nav.signUp')}</Button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
