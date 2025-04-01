
import { Car, Clock, DollarSign, ShieldCheck, Users, Zap } from "lucide-react";
import GradientText from "./ui-components/GradientText";
import { useLanguage } from "@/contexts/LanguageContext";

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
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const Features = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Car size={24} />,
      title: t('features.convenience'),
      description: t('features.convenienceDesc'),
      delay: 0.1,
    },
    {
      icon: <DollarSign size={24} />,
      title: t('features.cost'),
      description: t('features.costDesc'),
      delay: 0.2,
    },
    {
      icon: <Users size={24} />,
      title: t('features.community'),
      description: t('features.communityDesc'),
      delay: 0.3,
    },
    {
      icon: <ShieldCheck size={24} />,
      title: t('features.safety'),
      description: t('features.safetyDesc'),
      delay: 0.4,
    },
    {
      icon: <Zap size={24} />,
      title: t('features.fast'),
      description: t('features.fastDesc'),
      delay: 0.5,
    },
    {
      icon: <Clock size={24} />,
      title: t('features.time'),
      description: t('features.timeDesc'),
      delay: 0.6,
    },
  ];

  return (
    <section id="features" className="section">
      <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
        <h2 className="mb-4">
          {t('features.title')} <GradientText>Wassalni</GradientText>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('features.subtitle')}
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
