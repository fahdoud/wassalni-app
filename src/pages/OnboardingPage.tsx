
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GradientText from '@/components/ui-components/GradientText';
import Logo from '@/components/ui-components/Logo';
import Button from '@/components/Button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';

const OnboardingPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Check if user has seen onboarding before
  useEffect(() => {
    const onboardingSeen = localStorage.getItem('wassalni_onboarding_seen');
    if (onboardingSeen === 'true') {
      setHasSeenOnboarding(true);
      navigate('/');
    }
  }, [navigate]);

  const slides = [
    {
      title: "Welcome to Wassalni",
      description: "Your premium carpooling solution in Constantine. Discover a smarter way to travel together.",
      image: "/lovable-uploads/0ed09104-7848-4012-8db2-6ee6006b35af.png",
    },
    {
      title: "Find Available Rides",
      description: "Browse through numerous available rides in your area and choose what works best for you.",
      icon: "🚗",
    },
    {
      title: "Connect with Community",
      description: "Join a trusted network of drivers and passengers to make traveling more social and affordable.",
      icon: "👥",
    },
    {
      title: "Save Money & Time",
      description: "Reduce your transportation costs while contributing to less traffic and a greener environment.",
      icon: "💰",
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    localStorage.setItem('wassalni_onboarding_seen', 'true');
    navigate('/');
  };

  if (hasSeenOnboarding) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={handlePrevious} 
              className={`p-2 rounded-full ${currentSlide === 0 ? 'invisible' : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              <ChevronLeft size={24} />
            </button>
            <Logo size="md" />
            <button 
              onClick={handleSkip} 
              className="p-2 text-sm font-medium text-wassalni-green dark:text-wassalni-lightGreen"
            >
              Skip
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full mx-1 transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-8 bg-wassalni-green' 
                    : 'w-4 bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Slide Content */}
          <div className="text-center mb-10 animate-fade-in">
            {slides[currentSlide].image ? (
              <div className="flex justify-center mb-6">
                <img 
                  src={slides[currentSlide].image} 
                  alt="Wassalni" 
                  className="w-32 h-32 object-contain"
                />
              </div>
            ) : (
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 text-5xl flex items-center justify-center bg-wassalni-green/10 rounded-full">
                  {slides[currentSlide].icon}
                </div>
              </div>
            )}
            
            <h2 className="text-2xl font-bold mb-4">
              <GradientText>{slides[currentSlide].title}</GradientText>
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* Navigation Buttons */}
          <Button
            onClick={handleNext}
            className="w-full mt-4 group"
          >
            <span className="flex items-center justify-center">
              {currentSlide < slides.length - 1 ? "Next" : "Get Started"}
              <ChevronRight size={20} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
