
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import GradientText from "./ui-components/GradientText";
import { useLanguage } from "@/contexts/LanguageContext";

const HowItWorks = () => {
  const { language } = useLanguage();
  const stepsRef = useRef<HTMLDivElement>(null);
  
  // Define text based on current language
  const title = language === 'en' ? 'How' : 
                language === 'fr' ? 'Comment' : 
                'كيف';
                
  const howItWorks = language === 'en' ? 'How It Works' : 
                     language === 'fr' ? 'Comment Ça Marche' : 
                     'كيف يعمل';
                     
  const subtitle = language === 'en' ? 'Follow these simple steps to start using our carpooling service.' : 
                  language === 'fr' ? 'Suivez ces étapes simples pour commencer à utiliser notre service de covoiturage.' : 
                  'اتبع هذه الخطوات البسيطة للبدء في استخدام خدمة مشاركة السيارات.';
                  
  const startJourney = language === 'en' ? 'Start Your Journey' : 
                      language === 'fr' ? 'Commencer Votre Voyage' : 
                      'ابدأ رحلتك';

  const steps = [
    {
      number: "01",
      title: language === 'en' ? 'Create an Account' : 
             language === 'fr' ? 'Créer un Compte' : 
             'إنشاء حساب',
      description: language === 'en' ? 'Sign up for free and complete your profile with your personal details.' : 
                   language === 'fr' ? 'Inscrivez-vous gratuitement et complétez votre profil avec vos informations personnelles.' : 
                   'سجل مجانًا وأكمل ملفك الشخصي ببياناتك الشخصية.',
    },
    {
      number: "02",
      title: language === 'en' ? 'Find Available Rides' : 
             language === 'fr' ? 'Trouver des Trajets' : 
             'البحث عن الرحلات المتاحة',
      description: language === 'en' ? 'Search for rides based on your location, destination, and preferred time.' : 
                   language === 'fr' ? 'Recherchez des trajets selon votre emplacement, destination et horaire préféré.' : 
                   'ابحث عن الرحلات بناءً على موقعك ووجهتك والوقت المفضل لديك.',
    },
    {
      number: "03",
      title: language === 'en' ? 'Book Your Seat' : 
             language === 'fr' ? 'Réserver une Place' : 
             'احجز مقعدك',
      description: language === 'en' ? 'Reserve your seat in a ride that matches your preferences.' : 
                   language === 'fr' ? 'Réservez votre place dans un trajet qui correspond à vos préférences.' : 
                   'احجز مقعدك في رحلة تناسب تفضيلاتك.',
    },
    {
      number: "04",
      title: language === 'en' ? 'Pay Securely' : 
             language === 'fr' ? 'Payer en Toute Sécurité' : 
             'الدفع بأمان',
      description: language === 'en' ? 'Choose your payment method and confirm your booking.' : 
                   language === 'fr' ? 'Choisissez votre moyen de paiement et confirmez votre réservation.' : 
                   'اختر طريقة الدفع وأكد حجزك.',
    },
    {
      number: "05",
      title: language === 'en' ? 'Enjoy Your Ride' : 
             language === 'fr' ? 'Profiter de Votre Trajet' : 
             'استمتع برحلتك',
      description: language === 'en' ? 'Meet your driver at the pickup location and enjoy a comfortable journey.' : 
                   language === 'fr' ? 'Rencontrez votre conducteur au point de ramassage et profitez d\'un voyage confortable.' : 
                   'قابل السائق في مكان الالتقاط واستمتع برحلة مريحة.',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up");
            // Don't unobserve to keep the animation persistent
          }
        });
      },
      { threshold: 0.1 }
    );

    if (stepsRef.current) {
      const stepElements = stepsRef.current.querySelectorAll(".step-item");
      stepElements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="section bg-gradient-to-b from-white to-blue-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
        <h2 className="mb-4">
          {title} <GradientText>Wassalni</GradientText> {howItWorks}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {subtitle}
        </p>
      </div>

      <div ref={stepsRef} className="max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="step-item flex flex-col md:flex-row items-start gap-6 mb-12"
            style={{ opacity: 1, transitionDelay: `${index * 0.1}s` }}
          >
            <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-gradient-primary text-white font-bold text-xl">
              {step.number}
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 animate-fade-in">
        <Link to="/rides">
          <Button size="lg">{startJourney}</Button>
        </Link>
      </div>
    </section>
  );
};

export default HowItWorks;
