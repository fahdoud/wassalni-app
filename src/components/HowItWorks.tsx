
import { useEffect, useRef } from "react";
import Button from "./Button";
import GradientText from "./ui-components/GradientText";

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Sign up in minutes with your email or social accounts. Verify your profile to build trust with other users.",
  },
  {
    number: "02",
    title: "Find or Offer a Ride",
    description:
      "Search for available rides or offer your own by setting your route, date, time, and available seats.",
  },
  {
    number: "03",
    title: "Connect & Confirm",
    description:
      "Chat with the driver or passengers through our secure messaging system and confirm your booking.",
  },
  {
    number: "04",
    title: "Travel Together",
    description:
      "Meet at the agreed pick-up point, enjoy your journey, and split travel costs through our secure payment system.",
  },
  {
    number: "05",
    title: "Rate Your Experience",
    description:
      "After the trip, rate your experience to help build our trusted community of carpoolers.",
  },
];

const HowItWorks = () => {
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up");
            observer.unobserve(entry.target);
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
    <section id="how-it-works" className="section bg-gradient-to-b from-white to-blue-50/50">
      <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
        <h2 className="mb-4">
          How <GradientText>Wassalni</GradientText> Works
        </h2>
        <p className="text-lg text-gray-600">
          Follow these simple steps to start sharing rides and saving money
        </p>
      </div>

      <div ref={stepsRef} className="max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="step-item flex flex-col md:flex-row items-start gap-6 mb-12 opacity-0"
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-gradient-primary text-white font-bold text-xl">
              {step.number}
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 animate-fade-in">
        <Button size="lg">Start Your Journey</Button>
      </div>
    </section>
  );
};

export default HowItWorks;
