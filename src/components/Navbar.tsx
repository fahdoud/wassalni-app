
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Button from "./Button";
import GradientText from "./ui-components/GradientText";
import Logo from "./ui-components/Logo";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          ? "py-3 bg-white/80 backdrop-blur-lg shadow-sm"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <Logo size="md" />
          <h1 className="text-2xl font-bold tracking-tight">
            <GradientText>Wassalni</GradientText>
          </h1>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            <li>
              <a
                href="#features"
                className="text-gray-700 hover:text-wassalni-green transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-wassalni-green transition-colors"
              >
                How It Works
              </a>
            </li>
            <li>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-wassalni-green transition-colors"
              >
                Testimonials
              </a>
            </li>
          </ul>
          <div className="flex items-center gap-3">
            <Button variant="outlined" size="sm">
              Sign In
            </Button>
            <Button size="sm">Sign Up</Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-slide-down">
          <nav className="container mx-auto px-4 py-4">
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="#features"
                  className="block py-2 text-gray-700 hover:text-wassalni-green transition-colors"
                  onClick={toggleMenu}
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="block py-2 text-gray-700 hover:text-wassalni-green transition-colors"
                  onClick={toggleMenu}
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="block py-2 text-gray-700 hover:text-wassalni-green transition-colors"
                  onClick={toggleMenu}
                >
                  Testimonials
                </a>
              </li>
              <li className="flex flex-col gap-2 pt-2">
                <Button variant="outlined" className="w-full">
                  Sign In
                </Button>
                <Button className="w-full">Sign Up</Button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
