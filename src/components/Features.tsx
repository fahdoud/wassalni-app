
import { Car, Clock, DollarSign, ShieldCheck, Users, Zap } from "lucide-react";
import GradientText from "./ui-components/GradientText";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => (
  <div 
    className="feature-card animate-fade-in" 
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="h-12 w-12 mb-4 flex items-center justify-center rounded-full bg-gradient-primary text-white">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: <Car size={24} />,
      title: "Convenient Travel",
      description:
        "Find rides to your exact destination, no more transfers or waiting at stops.",
      delay: 0.1,
    },
    {
      icon: <DollarSign size={24} />,
      title: "Cost Effective",
      description:
        "Save money by sharing fuel costs and tolls with fellow travelers.",
      delay: 0.2,
    },
    {
      icon: <Users size={24} />,
      title: "Community Building",
      description:
        "Connect with like-minded travelers and build your own trusted network.",
      delay: 0.3,
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Safe & Secure",
      description:
        "Verified profiles, ratings, and reviews ensure a safe experience for everyone.",
      delay: 0.4,
    },
    {
      icon: <Zap size={24} />,
      title: "Fast & Flexible",
      description:
        "Book instantly or plan ahead with our easy-to-use platform.",
      delay: 0.5,
    },
    {
      icon: <Clock size={24} />,
      title: "Time Saving",
      description:
        "No rigid schedules. Travel when it suits you with our flexible options.",
      delay: 0.6,
    },
  ];

  return (
    <section id="features" className="section">
      <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
        <h2 className="mb-4">
          Why Choose <GradientText>Wassalni</GradientText>
        </h2>
        <p className="text-lg text-gray-600">
          Our platform makes carpooling simple, safe, and enjoyable for everyone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            delay={feature.delay}
          />
        ))}
      </div>
    </section>
  );
};

export default Features;
