
import { supabase } from "@/integrations/supabase/client";
import { Reservation, ReservationStatus } from './types';
import { toast } from "sonner";

export const getUserReservations = async (): Promise<Reservation[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('id, nombre_places_reservees, statut, created_at, trip_id, user_id, point_depart_propose, point_arrivee_propose')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) return [];
    
    // Fetch related trips
    const tripIds = (reservations || []).filter(r => r.trip_id).map(r => r.trip_id!);
    let tripMap = new Map<string, any>();
    
    if (tripIds.length > 0) {
      const { data: tripsData } = await supabase
        .from('trips')
        .select('id, lieu_depart, lieu_arrivee, date_heure, prix, driver_id')
        .in('id', tripIds);
      if (tripsData) {
        tripsData.forEach(t => tripMap.set(t.id, t));
      }
    }
    
    return (reservations || []).map(res => {
      const tripData = res.trip_id ? tripMap.get(res.trip_id) : null;
      return {
        id: res.id,
        trip_id: res.trip_id,
        passenger_id: user.id,
        seats_reserved: res.nombre_places_reservees,
        status: res.statut as ReservationStatus,
        created_at: res.created_at,
        updated_at: res.created_at,
        trip: tripData ? {
          id: tripData.id,
          origin: tripData.lieu_depart,
          destination: tripData.lieu_arrivee,
          departure_time: tripData.date_heure,
          price: tripData.prix,
          driver_id: tripData.driver_id,
          profiles: { full_name: 'Driver' }
        } : undefined
      };
    });
  } catch {
    return [];
  }
};

export const cancelReservation = async (reservationId: string): Promise<boolean> => {
  try {
    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select('trip_id, nombre_places_reservees')
      .eq('id', reservationId)
      .single();
    if (fetchError) return false;
    
    const { error: updateError } = await supabase
      .from('reservations')
      .update({ statut: 'cancelled' })
      .eq('id', reservationId);
    if (updateError) return false;
    
    if (reservation.trip_id) {
      const { data: tripData } = await supabase
        .from('trips')
        .select('places_disponibles')
        .eq('id', reservation.trip_id)
        .single();
      if (tripData) {
        const newSeats = (tripData.places_disponibles || 0) + (reservation.nombre_places_reservees || 0);
        await supabase.from('trips').update({ places_disponibles: newSeats }).eq('id', reservation.trip_id);
      }
    }
    
    toast.success("Reservation cancelled successfully");
    return true;
  } catch {
    toast.error("Failed to cancel reservation");
    return false;
  }
};
