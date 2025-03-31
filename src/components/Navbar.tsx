
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";
import GradientText from "./ui-components/GradientText";
import Logo from "./ui-components/Logo";
import LanguageSwitcher from "./ui-components/LanguageSwitcher";
import ThemeToggle from "./ui-components/ThemeToggle";
import UserProfileMenu from "./UserProfileMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { language } = useLanguage();

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

  useEffect(() => {
    // Check current auth state
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(!!data.user);
      console.log("Auth state checked, user logged in:", !!data.user);
    };

    checkAuth();

    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      console.log("Auth state change in Navbar:", event);
      if (event === "SIGNED_IN") {
        setIsLoggedIn(true);
      } else if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Define text strings directly based on the current language
  const featuresText = language === 'en' ? 'Features' : 
                      language === 'fr' ? 'Fonctionnalités' : 
                      'المميزات';
                      
  const howItWorksText = language === 'en' ? 'How It Works' : 
                        language === 'fr' ? 'Comment Ça Marche' : 
                        'كيف يعمل';
                        
  const feedbackText = language === 'en' ? 'Feedback' : 
                      language === 'fr' ? 'Commentaires' : 
                      'تعليقات';
                      
  const signInText = language === 'en' ? 'Sign In' : 
                    language === 'fr' ? 'Se Connecter' : 
                    'تسجيل الدخول';
                    
  const signUpText = language === 'en' ? 'Sign Up' : 
                    language === 'fr' ? 'S\'inscrire' : 
                    'إنشاء حساب';

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
                {featuresText}
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-wassalni-green transition-colors dark:text-gray-300 dark:hover:text-wassalni-lightGreen"
              >
                {howItWorksText}
              </a>
            </li>
            <li>
              <Link
                to="/feedback"
                className="text-gray-700 hover:text-wassalni-green transition-colors dark:text-gray-300 dark:hover:text-wassalni-lightGreen"
              >
                {feedbackText}
              </Link>
            </li>
          </ul>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            {isLoggedIn ? (
              <UserProfileMenu />
            ) : (
              <>
                <Link to="/passenger-signin">
                  <Button variant="outlined" size="sm">
                    {signInText}
                  </Button>
                </Link>
                <Link to="/passenger-signup">
                  <Button size="sm">{signUpText}</Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {isLoggedIn && <UserProfileMenu />}
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
                  {featuresText}
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="block py-2 text-gray-700 hover:text-wassalni-green transition-colors dark:text-gray-300 dark:hover:text-wassalni-lightGreen"
                  onClick={toggleMenu}
                >
                  {howItWorksText}
                </a>
              </li>
              <li>
                <Link
                  to="/feedback"
                  className="block py-2 text-gray-700 hover:text-wassalni-green transition-colors dark:text-gray-300 dark:hover:text-wassalni-lightGreen"
                  onClick={toggleMenu}
                >
                  {feedbackText}
                </Link>
              </li>
              {!isLoggedIn && (
                <li className="flex flex-col gap-2 pt-2">
                  <Link to="/passenger-signin" onClick={toggleMenu}>
                    <Button variant="outlined" className="w-full">
                      {signInText}
                    </Button>
                  </Link>
                  <Link to="/passenger-signup" onClick={toggleMenu}>
                    <Button className="w-full">{signUpText}</Button>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
