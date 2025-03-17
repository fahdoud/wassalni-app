
import { useState, useEffect } from "react";
import LanguageSwitcher from "./ui-components/LanguageSwitcher";
import ThemeToggle from "./ui-components/ThemeToggle";
import NavbarBrand from "./navigation/NavbarBrand";
import DesktopNavigation from "./navigation/DesktopNavigation";
import MobileNavigation from "./navigation/MobileNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

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
        <NavbarBrand />

        {/* Desktop Navigation */}
        <DesktopNavigation />

        {/* Mobile Navigation and Controls */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <MobileNavigation toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
        </div>

        {/* Language and Theme Controls - Desktop */}
        <div className="hidden md:flex items-center gap-3 ml-3">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
