
import { Link } from "react-router-dom";
import Button from "./Button";
import GradientText from "./ui-components/GradientText";
import Logo from "./ui-components/Logo";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { language } = useLanguage();
  
  // Define text based on current language
  const tagline = language === 'en' ? 'Experience Better Carpooling' : 
                  language === 'fr' ? 'Covoiturage Amélioré' : 
                  'تجربة مشاركة السيارات بشكل أفضل';
                  
  const title = language === 'en' ? 'Your Premium Ridesharing Service in' : 
                language === 'fr' ? 'Votre Service de Covoiturage Premium à' : 
                'خدمة مشاركة الركوب المميزة في';
                
  const description = language === 'en' ? 'Wassalni connects drivers and passengers in Constantine for affordable, convenient and eco-friendly carpooling services.' : 
                      language === 'fr' ? 'Wassalni connecte conducteurs et passagers à Constantine pour des services de covoiturage abordables, pratiques et écologiques.' : 
                      'وصلني يربط السائقين والركاب في قسنطينة لخدمات مشاركة السيارات بأسعار معقولة ومريحة وصديقة للبيئة.';
                      
  const findRide = language === 'en' ? 'Find a Ride' : 
                   language === 'fr' ? 'Trouver un Trajet' : 
                   'البحث عن رحلة';
                   
  const offerRide = language === 'en' ? 'Offer a Ride' : 
                    language === 'fr' ? 'Proposer un Trajet' : 
                    'عرض رحلة';
  
  // Form translations
  const fromText = language === 'en' ? 'From' : 
                   language === 'fr' ? 'De' : 
                   'من';
                   
  const toText = language === 'en' ? 'To' : 
                 language === 'fr' ? 'À' : 
                 'إلى';
                 
  const whenText = language === 'en' ? 'When' : 
                   language === 'fr' ? 'Quand' : 
                   'متى';
                   
  const searchText = language === 'en' ? 'Search' : 
                     language === 'fr' ? 'Rechercher' : 
                     'بحث';
                     
  const departurePlaceholder = language === 'en' ? 'Enter departure location' : 
                              language === 'fr' ? 'Entrez le lieu de départ' : 
                              'أدخل موقع المغادرة';
                              
  const destinationPlaceholder = language === 'en' ? 'Enter destination location' : 
                                language === 'fr' ? 'Entrez la destination' : 
                                'أدخل موقع الوجهة';
                                
  const constantineLoc = language === 'en' ? 'Constantine, Algeria' : 
                        language === 'fr' ? 'Constantine, Algérie' : 
                        'قسنطينة، الجزائر';

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] aspect-[1/0.5] bg-gradient-radial opacity-20"></div>
        <div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] rounded-full bg-wassalni-lightGreen/20 blur-3xl"></div>
        <div className="absolute -bottom-[200px] -right-[300px] w-[500px] h-[500px] rounded-full bg-wassalni-lightBlue/20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
            <div className="inline-block px-3 py-1 bg-wassalni-green/10 text-wassalni-green text-sm font-medium rounded-full animate-fade-in dark:bg-wassalni-green/30 dark:text-wassalni-lightGreen">
              {tagline}
            </div>
            <h1 className="animate-slide-up">
              {title}
              <br />
              <GradientText>Wassalni</GradientText>
            </h1>
            <p className="text-lg text-gray-600 md:text-xl max-w-2xl mx-auto lg:mx-0 animate-slide-up dark:text-gray-300 mt-6" style={{ animationDelay: "0.2s" }}>
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Link to="/rides">
                <Button className="group transition-all duration-300 transform hover:scale-105">
                  <span className="flex items-center">
                    {findRide}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Button>
              </Link>
              <Link to="/offer-ride">
                <Button variant="outlined" className="group transition-all duration-300 transform hover:scale-105">
                  <span className="flex items-center">
                    {offerRide}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="relative aspect-[4/3] max-w-xl mx-auto">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl opacity-10 blur-xl"></div>
              <div className="relative glass-card rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="bg-gradient-to-br from-wassalni-lightGreen to-wassalni-lightBlue p-6 text-wassalni-dark">
                  <h3 className="text-xl font-semibold">{findRide}</h3>
                  <p className="text-wassalni-dark/80 text-sm mt-1">{constantineLoc}</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{fromText}</label>
                    <input
                      type="text"
                      placeholder={departurePlaceholder}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      defaultValue="Ali Mendjeli"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{toText}</label>
                    <input
                      type="text"
                      placeholder={destinationPlaceholder}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      defaultValue="City Center"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{whenText}</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <Link to="/rides">
                    <Button className="w-full mt-2 group transition-all duration-300">
                      <span className="flex items-center justify-center">
                        {searchText}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
