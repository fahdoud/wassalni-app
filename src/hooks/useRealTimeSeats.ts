
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trajet } from "@/services/trajets/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export const useRealTimeSeats = (trajets: Trajet[]) => {
  const { t } = useLanguage();
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
                
                // Show notification about seat update
                toast.info(t('rides.seatsUpdated'));
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
                
                // Show notification about seat update from reservation
                toast.info(t('rides.reservationMade'));
              }
            }
          )
          .subscribe();
          
        channels.push(reservationChannel);
        
        // Add seat_availability subscription if trip_id is available
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
                  
                  // Show notification about seat update
                  toast.info(t('rides.seatsUpdated'));
                }
              }
            )
            .subscribe();
            
          channels.push(seatChannel);
        }
        
        // Also listen for reservations_trajets table
        const reservationTrajetChannel = supabase
          .channel(`reservation-trajet-${trajet.id}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'reservations_trajets',
              filter: `trajet_id=eq.${trajet.id}`
            },
            (payload) => {
              console.log("Nouvelle réservation trajet détectée:", payload);
              if (payload.new && payload.new.places_reservees) {
                const placesReservees = payload.new.places_reservees;
                console.log(`Réservation de ${placesReservees} places pour le trajet ${trajet.id}`);
                
                setPlacesDispoEnTempsReel(prev => {
                  const currentPlaces = prev[trajet.id] || trajet.places_dispo;
                  const newPlaces = Math.max(0, currentPlaces - placesReservees);
                  console.log(`Mise à jour des places après réservation: ${currentPlaces} -> ${newPlaces}`);
                  return {
                    ...prev,
                    [trajet.id]: newPlaces
                  };
                });
                
                // Show notification about seat update from reservation
                toast.info(t('rides.reservationMade'));
              }
            }
          )
          .subscribe();
          
        channels.push(reservationTrajetChannel);
      }
    });
    
    return () => {
      console.log("Cleaning up seat subscription channels");
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [trajets, t]);

  return placesDispoEnTempsReel;
};
