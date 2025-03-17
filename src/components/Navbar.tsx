
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "./ui-components/LanguageSwitcher";
import ThemeToggle from "./ui-components/ThemeToggle";
import NavbarBrand from "./navigation/NavbarBrand";
import DesktopNavigation from "./navigation/DesktopNavigation";
import MobileNavigation from "./navigation/MobileNavigation";
import UserProfile from "./UserProfile";
import { LogOut } from "lucide-react";
import Button from "./Button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

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

        {/* Controls and Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-2">
              <UserProfile />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="flex items-center gap-1 p-1"
              >
                <LogOut size={16} />
              </Button>
            </div>
          ) : (
            <MobileNavigation toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
          )}
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
