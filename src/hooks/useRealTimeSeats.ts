
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trajet } from "@/services/trajets/types";
import { Ride } from "@/services/rides/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

// Define a common interface that works with both rides and trajets
export interface SeatTrackable {
  id: string;
  trip_id?: string;
  places_dispo?: number;
  seats?: number;
}

export const useRealTimeSeats = <T extends SeatTrackable>(items: T[]) => {
  const { t } = useLanguage();
  const [seatsAvailable, setSeatsAvailable] = useState<Record<string, number>>({});

  // Set up initial seats data
  useEffect(() => {
    if (items.length === 0) return;
    
    // Initialize with the current seat values
    const initialSeats: Record<string, number> = {};
    items.forEach(item => {
      // Handle both trajet and ride data formats
      const seatCount = 'places_dispo' in item && item.places_dispo !== undefined 
        ? item.places_dispo 
        : ('seats' in item && item.seats !== undefined ? item.seats : 0);
      
      initialSeats[item.id] = seatCount;
    });
    
    console.log("Initializing real-time seats with:", initialSeats);
    setSeatsAvailable(initialSeats);
  }, [items]);

  // Subscribe to real-time seat updates
  useEffect(() => {
    if (items.length === 0) return;
    
    console.log("Setting up real-time subscriptions for seats");
    const channels: any[] = [];
    
    items.forEach(item => {
      if (item.id && !/^\d+$/.test(item.id)) {
        // Determine if this is a trajet or a ride based on the properties
        const isTrajet = 'places_dispo' in item;
        const table = isTrajet ? 'trajets' : 'trips';
        const seatField = isTrajet ? 'places_dispo' : 'available_seats';
        
        // Subscribe to direct updates to the appropriate table
        const channel = supabase
          .channel(`${table}-${item.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: table,
              filter: `id=eq.${item.id}`
            },
            (payload) => {
              console.log(`Mise à jour en temps réel des places reçue (${table}):`, payload);
              if (payload.new && seatField in payload.new) {
                const newSeatCount = payload.new[seatField];
                console.log(`Mise à jour des places en temps réel: ${table} ${item.id}, places: ${newSeatCount}`);
                
                setSeatsAvailable(prev => ({
                  ...prev,
                  [item.id]: newSeatCount
                }));
                
                // Show notification about seat update
                toast.info(t('rides.seatsUpdated'));
              }
            }
          )
          .subscribe();
          
        channels.push(channel);
        
        // Also listen for new reservations that might affect seat availability
        const reservationTable = isTrajet ? 'reservations_trajets' : 'reservations';
        const tripIdField = isTrajet ? 'trajet_id' : 'trip_id';
        const seatsReservedField = isTrajet ? 'places_reservees' : 'seats_reserved';
        
        const reservationChannel = supabase
          .channel(`${reservationTable}-${item.id}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: reservationTable,
              filter: `${tripIdField}=eq.${item.id}`
            },
            (payload) => {
              console.log(`Nouvelle réservation détectée (${reservationTable}):`, payload);
              if (payload.new && payload.new[seatsReservedField]) {
                const seatsReserved = payload.new[seatsReservedField];
                console.log(`Réservation de ${seatsReserved} places pour le ${isTrajet ? 'trajet' : 'ride'} ${item.id}`);
                
                setSeatsAvailable(prev => {
                  const currentSeats = prev[item.id] || (isTrajet 
                    ? (item as Trajet).places_dispo 
                    : (item as Ride).seats);
                    
                  const newSeats = Math.max(0, currentSeats - seatsReserved);
                  console.log(`Mise à jour des places: ${currentSeats} -> ${newSeats}`);
                  return {
                    ...prev,
                    [item.id]: newSeats
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
        if (item.trip_id) {
          const seatChannel = supabase
            .channel(`seat-${item.id}`)
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: 'seat_availability',
                filter: `trip_id=eq.${item.trip_id}`
              },
              (payload) => {
                console.log("Mise à jour de seat_availability:", payload);
                if (payload.new && 'remaining_seats' in payload.new) {
                  const remainingSeats = payload.new.remaining_seats;
                  console.log(`Mise à jour des places via seat_availability: ${remainingSeats}`);
                  
                  setSeatsAvailable(prev => ({
                    ...prev,
                    [item.id]: remainingSeats
                  }));
                  
                  // Show notification about seat update
                  toast.info(t('rides.seatsUpdated'));
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
  }, [items, t]);

  return seatsAvailable;
};
