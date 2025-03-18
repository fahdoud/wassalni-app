
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import GradientText from "@/components/ui-components/GradientText";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getTrajets } from "@/services/trajets/trajetsService";
import { Trajet } from "@/services/trajets/types";
import TrajetList from "@/components/trajets/TrajetList";
import { toast } from "sonner";

const constantineAreas = ["Ain Abid", "Ali Mendjeli", "Bekira", "Boussouf", "Didouche Mourad", "El Khroub", "Hamma Bouziane", "Zighoud Youcef"];

const TrajetsPage = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("");
  const [trajets, setTrajets] = useState<Trajet[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchTrajets = async (forceRefresh = false) => {
    setLoading(true);
    try {
      console.log("Récupération des trajets, forceRefresh:", forceRefresh);
      
      if (forceRefresh) {
        setTrajets([]);
      }
      
      const fetchedTrajets = await getTrajets();
      if (fetchedTrajets && fetchedTrajets.length > 0) {
        console.log("Trajets récupérés:", fetchedTrajets);
        setTrajets(fetchedTrajets);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des trajets:", error);
      toast.error(t('rides.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrajets(true);
    
    const handleBeforeUnload = () => {
      localStorage.setItem('trajetsPageReloaded', 'true');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    const handleFocus = () => {
      console.log("Window focused - refreshing trajets");
      fetchTrajets(true);
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Set up an interval to refresh trajets every 30 seconds
    const refreshInterval = setInterval(() => {
      console.log("Periodic refresh of trajets");
      fetchTrajets();
    }, 30000);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('focus', handleFocus);
      clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    if (location.pathname === '/trajets') {
      const fromReservation = sessionStorage.getItem('fromReservation');
      
      if (fromReservation === 'true') {
        console.log("Retour de la page de réservation, forçage de l'actualisation des trajets");
        fetchTrajets(true);
        sessionStorage.removeItem('fromReservation');
      } else {
        fetchTrajets();
      }
    }
  }, [location]);

  const filteredTrajets = filter 
    ? trajets.filter(trajet => 
        trajet.origine.toLowerCase().includes(filter.toLowerCase()) || 
        trajet.destination.toLowerCase().includes(filter.toLowerCase())
      )
    : trajets;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        <section className="section">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="mb-4">
              <GradientText>Constantine</GradientText> {t('rides.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('rides.subtitle')}
            </p>
          </div>

          <div className="mb-10 bg-gray-50 p-6 rounded-xl dark:bg-gray-800/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">{t('form.from')}</label>
                <select 
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">{t('form.selectLocation')}</option>
                  {constantineAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">{t('form.to')}</label>
                <select 
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">{t('form.selectLocation')}</option>
                  {constantineAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">{t('form.date')}</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Button className="px-8">{t('form.search')}</Button>
            </div>
          </div>

          <TrajetList trajets={filteredTrajets} loading={loading} />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TrajetsPage;
