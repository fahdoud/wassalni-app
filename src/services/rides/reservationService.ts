
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ReservationStatus } from "./types";
import { getUserDisplayInfo } from "./chatService";
import { getMockRides, getAlgerMockRides } from "./mockRides";

export const createReservation = async (
  tripId: string, passengerId: string, seatsReserved: number
): Promise<{ success: boolean, updatedSeats?: number }> => {
  try {
    // Mock rides
    if (/^\d+$/.test(tripId)) {
      let mockRide = getMockRides().find(r => r.id === tripId) || getAlgerMockRides().find(r => r.id === tripId);
      if (!mockRide) throw new Error('Mock ride not found');
      
      const mockTripId = crypto.randomUUID();
      const { error } = await supabase
        .from('reservations')
        .insert({
          trip_id: mockTripId,
          user_id: passengerId,
          nombre_places_reservees: seatsReserved,
          statut: 'confirmed',
          point_depart_propose: mockRide.from,
          point_arrivee_propose: mockRide.to
        });
      if (error) throw new Error(error.message);
      return { success: true };
    }
    
    // Real rides
    const { data: currentTrip, error: tripError } = await supabase
      .from('trips')
      .select('places_disponibles, lieu_depart, lieu_arrivee, prix')
      .eq('id', tripId)
      .single();
    if (tripError) throw new Error(tripError.message);
    
    if ((currentTrip.places_disponibles || 0) < seatsReserved) {
      toast.error("Not enough seats available");
      return { success: false };
    }
    
    const { error: resError } = await supabase
      .from('reservations')
      .insert({
        trip_id: tripId,
        user_id: passengerId,
        nombre_places_reservees: seatsReserved,
        statut: 'confirmed',
        point_depart_propose: currentTrip.lieu_depart,
        point_arrivee_propose: currentTrip.lieu_arrivee
      });
    if (resError) throw new Error(resError.message);
    
    // Update available seats
    const newSeats = (currentTrip.places_disponibles || 0) - seatsReserved;
    await supabase.from('trips').update({ places_disponibles: newSeats }).eq('id', tripId);
    
    // Send welcome message to chat
    try {
      const userInfo = await getUserDisplayInfo(passengerId);
      await supabase.from('ride_messages').insert({
        ride_id: tripId,
        sender_id: passengerId,
        sender_name: 'System',
        content: `${userInfo.name} has joined the ride.`
      });
    } catch {}
    
    return { success: true, updatedSeats: newSeats };
  } catch (error) {
    console.error("Failed to create reservation:", error);
    toast.error("Failed to create reservation.");
    return { success: false };
  }
};

export const getUserReservations = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('id, nombre_places_reservees, statut, created_at, trip_id, user_id, point_depart_propose, point_arrivee_propose')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    
    if (data && data.length > 0) {
      const tripIds = data.filter(r => r.trip_id).map(r => r.trip_id!);
      if (tripIds.length > 0) {
        const { data: tripsData } = await supabase
          .from('trips')
          .select('id, lieu_depart, lieu_arrivee, date_heure, prix, driver_id')
          .in('id', tripIds);
        
        if (tripsData) {
          const tripMap = new Map(tripsData.map(t => [t.id, t]));
          return data.map(res => ({
            ...res,
            seats_reserved: res.nombre_places_reservees,
            status: res.statut,
            trips: res.trip_id ? tripMap.get(res.trip_id) : null
          }));
        }
      }
    }
    return data;
  } catch {
    return [];
  }
};
