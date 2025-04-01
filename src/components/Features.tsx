
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
  const { language } = useLanguage();
  
  // Define text based on current language
  const featuresTitle = language === 'en' ? 'Why Choose' : 
                        language === 'fr' ? 'Pourquoi Choisir' : 
                        'لماذا تختار';
                        
  const featuresSubtitle = language === 'en' ? 'Discover the features that make Wassalni the preferred ridesharing platform in Constantine.' : 
                          language === 'fr' ? 'Découvrez les fonctionnalités qui font de Wassalni la plateforme de covoiturage préférée à Constantine.' : 
                          'اكتشف الميزات التي تجعل وصلني منصة مشاركة الركوب المفضلة في قسنطينة.';

  const features = [
    {
      icon: <Car size={24} />,
      title: language === 'en' ? 'Convenient Booking' :
             language === 'fr' ? 'Réservation Pratique' :
             'حجز مريح',
      description: language === 'en' ? 'Book rides with just a few taps on your smartphone, anytime and anywhere.' :
                   language === 'fr' ? 'Réservez des trajets en quelques clics sur votre smartphone, n\'importe quand et n\'importe où.' :
                   'احجز رحلات بنقرات قليلة على هاتفك الذكي، في أي وقت وأي مكان.',
      delay: 0.1,
    },
    {
      icon: <DollarSign size={24} />,
      title: language === 'en' ? 'Cost-Effective' :
             language === 'fr' ? 'Économique' :
             'فعال من حيث التكلفة',
      description: language === 'en' ? 'Save money on transportation costs through our affordable carpooling services.' :
                   language === 'fr' ? 'Économisez sur vos frais de transport grâce à nos services de covoiturage abordables.' :
                   'وفر المال على تكاليف النقل من خلال خدمات مشاركة السيارات بأسعار معقولة.',
      delay: 0.2,
    },
    {
      icon: <Users size={24} />,
      title: language === 'en' ? 'Community-Driven' :
             language === 'fr' ? 'Communautaire' :
             'مدفوع بالمجتمع',
      description: language === 'en' ? 'Join a friendly community of trusted drivers and passengers.' :
                   language === 'fr' ? 'Rejoignez une communauté sympathique de conducteurs et passagers de confiance.' :
                   'انضم إلى مجتمع ودود من السائقين والركاب الموثوق بهم.',
      delay: 0.3,
    },
    {
      icon: <ShieldCheck size={24} />,
      title: language === 'en' ? 'Safety First' :
             language === 'fr' ? 'Sécurité Avant Tout' :
             'السلامة أولاً',
      description: language === 'en' ? 'Enjoy peace of mind with our verified drivers and passenger rating system.' :
                   language === 'fr' ? 'Voyagez l\'esprit tranquille avec nos conducteurs vérifiés et notre système d\'évaluation.' :
                   'استمتع براحة البال مع السائقين المعتمدين ونظام تقييم الركاب.',
      delay: 0.4,
    },
    {
      icon: <Zap size={24} />,
      title: language === 'en' ? 'Fast Connections' :
             language === 'fr' ? 'Connexions Rapides' :
             'اتصالات سريعة',
      description: language === 'en' ? 'Find available rides quickly with our efficient matching algorithm.' :
                   language === 'fr' ? 'Trouvez rapidement des trajets disponibles grâce à notre algorithme de mise en relation efficace.' :
                   'اعثر على الرحلات المتاحة بسرعة مع خوارزمية المطابقة الفعالة لدينا.',
      delay: 0.5,
    },
    {
      icon: <Clock size={24} />,
      title: language === 'en' ? 'Time-Saving' :
             language === 'fr' ? 'Gain de Temps' :
             'توفير الوقت',
      description: language === 'en' ? 'Reduce your commuting time by sharing rides and avoiding public transport delays.' :
                   language === 'fr' ? 'Réduisez votre temps de trajet en partageant des voyages et en évitant les retards des transports publics.' :
                   'قلل من وقت التنقل من خلال مشاركة الرحلات وتجنب تأخيرات وسائل النقل العام.',
      delay: 0.6,
    },
  ];

  return (
    <section id="features" className="section">
      <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
        <h2 className="mb-4">
          {featuresTitle} <GradientText>Wassalni</GradientText>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {featuresSubtitle}
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
