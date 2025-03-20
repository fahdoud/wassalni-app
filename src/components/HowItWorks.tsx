import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import GradientText from "./ui-components/GradientText";
import { useLanguage } from "@/contexts/LanguageContext";

const HowItWorks = () => {
  const { t } = useLanguage();
  const stepsRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      number: "01",
      title: t('how.step1'),
      description: t('how.step1Desc'),
    },
    {
      number: "02",
      title: t('how.step2'),
      description: t('how.step2Desc'),
    },
    {
      number: "03",
      title: t('how.step3'),
      description: t('how.step3Desc'),
    },
    {
      number: "04",
      title: t('how.step4'),
      description: t('how.step4Desc'),
    },
    {
      number: "05",
      title: t('how.step5'),
      description: t('how.step5Desc'),
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
          {t('how.title')} <GradientText>Wassalni</GradientText> {t('nav.howItWorks')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('how.subtitle')}
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
          <Button size="lg">{t('how.startJourney')}</Button>
        </Link>
      </div>
    </section>
  );
};

export default HowItWorks;
