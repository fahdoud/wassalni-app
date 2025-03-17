
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is new (hasn't seen onboarding)
    const onboardingSeen = localStorage.getItem('wassalni_onboarding_seen');
    if (onboardingSeen !== 'true') {
      navigate('/onboarding');
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (!targetId) return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
    
    // Add animation classes on page load
    const elements = document.querySelectorAll('.stagger-animation > *');
    elements.forEach((el, index) => {
      const element = el as HTMLElement;
      setTimeout(() => {
        element.style.opacity = '1';
      }, 100 * (index + 1));
    });
    
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', function () {});
      });
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
