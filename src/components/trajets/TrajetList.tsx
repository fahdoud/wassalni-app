
import { useEffect, useState } from "react";
import { MapPin, Calendar, Clock, User } from "lucide-react";
import { Trajet } from "@/services/trajets/types";
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
  const [placesDispoEnTempsReel, setPlacesDispoEnTempsReel] = useState<Record<string, number>>({});

  // Set up initial seats data
  useEffect(() => {
    if (trajets.length === 0) return;
    
    // Initialize with the current seat values
    const initialSeats: Record<string, number> = {};
    trajets.forEach(trajet => {
      initialSeats[trajet.id] = trajet.places_dispo;
    });
    
    console.log("Initializing real-time seats with:", initialSeats);
    setPlacesDispoEnTempsReel(initialSeats);
  }, [trajets]);

  // Subscribe to real-time seat updates
  useEffect(() => {
    if (trajets.length === 0) return;
    
    console.log("Setting up real-time subscriptions for seats");
    const channels: any[] = [];
    
    trajets.forEach(trajet => {
      if (trajet.id && !/^\d+$/.test(trajet.id)) {
        // Subscribe to direct updates to the trajet table
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
                const newPlacesDispo = payload.new.places_dispo;
                console.log(`Mise à jour des places en temps réel: trajet ${trajet.id}, places: ${newPlacesDispo}`);
                
                setPlacesDispoEnTempsReel(prev => ({
                  ...prev,
                  [trajet.id]: newPlacesDispo
                }));
              }
            }
          )
          .subscribe();
          
        channels.push(channel);
        
        // Also listen for new reservations that might affect seat availability
        const reservationChannel = supabase
          .channel(`reservation-${trajet.id}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'reservations',
              filter: `trip_id=eq.${trajet.id}`
            },
            (payload) => {
              console.log("Nouvelle réservation détectée:", payload);
              if (payload.new && payload.new.seats_reserved) {
                const seatsReserved = payload.new.seats_reserved;
                console.log(`Réservation de ${seatsReserved} places pour le trajet ${trajet.id}`);
                
                setPlacesDispoEnTempsReel(prev => {
                  const currentPlaces = prev[trajet.id] || trajet.places_dispo;
                  const newPlaces = Math.max(0, currentPlaces - seatsReserved);
                  console.log(`Mise à jour des places: ${currentPlaces} -> ${newPlaces}`);
                  return {
                    ...prev,
                    [trajet.id]: newPlaces
                  };
                });
              }
            }
          )
          .subscribe();
          
        channels.push(reservationChannel);
        
        // Only set up seat_availability subscription if trip_id is available
        if (trajet.trip_id) {
          const seatChannel = supabase
            .channel(`seat-${trajet.id}`)
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: 'seat_availability',
                filter: `trip_id=eq.${trajet.trip_id}`
              },
              (payload) => {
                console.log("Mise à jour de seat_availability:", payload);
                if (payload.new && 'remaining_seats' in payload.new) {
                  const remainingSeats = payload.new.remaining_seats;
                  console.log(`Mise à jour des places via seat_availability: ${remainingSeats}`);
                  
                  setPlacesDispoEnTempsReel(prev => ({
                    ...prev,
                    [trajet.id]: remainingSeats
                  }));
                }
              }
            )
            .subscribe();
            
          channels.push(seatChannel);
        }
      }
    });
    
    return () => {
      console.log("Cleaning up seat subscription channels");
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [trajets]);

  const handleReserveClick = (trajetId: string) => {
    navigate(`/reservation/${trajetId}`);
    // Store in sessionStorage that we're coming from a reservation
    sessionStorage.setItem('fromReservation', 'true');
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
        // Use real-time seat count if available, otherwise use the original seat count
        const placesActuelles = trajet.id in placesDispoEnTempsReel 
          ? placesDispoEnTempsReel[trajet.id] 
          : trajet.places_dispo;
        
        console.log(`Affichage du trajet ${trajet.id}: ${placesActuelles} places disponibles`);
        
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
                    <p className="text-gray-700 dark:text-gray-300 whitespace-normal break-words">{trajet.origine}</p>
                  </div>
                  <div className="h-px w-10 bg-gray-300 hidden md:block"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-wassalni-blue"></div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-normal break-words">{trajet.destination}</p>
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
