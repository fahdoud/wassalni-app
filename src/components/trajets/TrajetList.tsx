
import { useEffect, useState } from "react";
import { MapPin, Calendar, Clock, User } from "lucide-react";
import { Trajet } from "@/services/trajets/types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Button from "@/components/Button";
import { useLanguage } from "@/contexts/LanguageContext";

interface TrajetListProps {
  trajets: Trajet[];
  loading: boolean;
}

const TrajetList = ({ trajets, loading }: TrajetListProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [placesDispoEnTempsReel, setPlacesDispoEnTempsReel] = useState<Record<string, number>>({});

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      setIsAuthenticated(event === 'SIGNED_IN');
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (trajets.length === 0) return;
    
    const channels: any[] = [];
    
    trajets.forEach(trajet => {
      if (trajet.id && !/^\d+$/.test(trajet.id)) {
        const channel = supabase
          .channel(`trajet-${trajet.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'trajets',
              filter: `id=eq.${trajet.id}`
            },
            (payload) => {
              console.log("Mise à jour en temps réel des places reçue:", payload);
              if (payload.new && 'places_dispo' in payload.new) {
                setPlacesDispoEnTempsReel(prev => ({
                  ...prev,
                  [trajet.id]: payload.new.places_dispo
                }));
              }
            }
          )
          .subscribe();
          
        channels.push(channel);
      }
    });
    
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [trajets]);

  const handleReserveClick = (trajetId: string) => {
    if (!isAuthenticated) {
      toast.error(t('auth.loginRequired') || "Veuillez vous connecter pour faire une réservation");
      navigate("/passenger-signin", { 
        state: { returnTo: `/reservation/${trajetId}` } 
      });
      return;
    }
    
    navigate(`/reservation/${trajetId}`);
    sessionStorage.removeItem('fromReservation');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wassalni-green"></div>
      </div>
    );
  }

  if (trajets.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">{t('rides.noRidesFound')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {trajets.map((trajet) => {
        const placesActuelles = trajet.id in placesDispoEnTempsReel 
          ? placesDispoEnTempsReel[trajet.id] 
          : trajet.places_dispo;
        
        return (
          <div 
            key={trajet.id}
            className="glass-card p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                    {trajet.chauffeur.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{trajet.chauffeur}</p>
                    <div className="flex items-center text-yellow-500 text-sm">
                      {'★'.repeat(Math.floor(trajet.note))}
                      <span className="text-gray-400 ml-1">{trajet.note}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-grow flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-wassalni-green"></div>
                    <p className="text-gray-700 dark:text-gray-300">{trajet.origine}</p>
                  </div>
                  <div className="h-px w-10 bg-gray-300 hidden md:block"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-wassalni-blue"></div>
                    <p className="text-gray-700 dark:text-gray-300">{trajet.destination}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="px-3 py-1 bg-gray-100 rounded-full dark:bg-gray-700">
                  {new Date(trajet.date).toLocaleDateString('fr-FR', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className="px-3 py-1 bg-gray-100 rounded-full dark:bg-gray-700">
                  {trajet.heure}
                </div>
                <div className={`px-3 py-1 rounded-full ${
                  placesActuelles > 0 
                    ? "bg-gray-100 dark:bg-gray-700" 
                    : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {placesActuelles > 0 
                    ? `${placesActuelles} ${placesActuelles === 1 ? t('rides.seat') : t('rides.seats')}` 
                    : t('rides.full')}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-4">
              <p className="text-2xl font-bold text-wassalni-green dark:text-wassalni-lightGreen">
                {trajet.prix} <span className="text-sm">DZD</span>
              </p>
              {placesActuelles > 0 ? (
                <Button 
                  size="sm" 
                  onClick={() => handleReserveClick(trajet.id)}
                >
                  {t('rides.reserve')}
                </Button>
              ) : (
                <Button size="sm" variant="outlined" disabled>
                  {t('rides.full')}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrajetList;
