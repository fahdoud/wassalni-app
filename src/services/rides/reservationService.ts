
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ReservationStatus } from "./types";

// Create a reservation
export const createReservation = async (
  tripId: string, 
  passengerId: string, 
  seatsReserved: number
): Promise<{ success: boolean, updatedSeats?: number }> => {
  try {
    // For mock rides, create a real reservation with a "mock" tag
    if (/^\d+$/.test(tripId)) {
      console.log("Creating a mock reservation with ID:", tripId);
      
      // Create a reservation entry for mock trips
      const { data: reservation, error: reservationError } = await supabase
        .from('reservations')
        .insert({
          trip_id: null, // No real trip ID for mock trips
          passenger_id: passengerId,
          seats_reserved: seatsReserved,
          status: 'mock' as ReservationStatus
        })
        .select()
        .single();
      
      if (reservationError) {
        console.error("Error creating mock reservation:", reservationError);
        throw new Error(reservationError.message);
      }
      
      console.log("Mock reservation created successfully:", reservation);
      
      // For mock rides, we manually decrement the seats in the mock data
      // The UI will update based on the response, but next time the page loads
      // it will show the original seat count since mock data is static
      return { success: true };
    }
    
    // For real rides with UUID trip IDs
    console.log("Creating a real reservation with tripId:", tripId);
    
    // First fetch current available seats
    const { data: currentTrip, error: tripError } = await supabase
      .from('trips')
      .select('available_seats')
      .eq('id', tripId)
      .single();
      
    if (tripError) {
      console.error("Error fetching current trip seats:", tripError);
      throw new Error(tripError.message);
    }
    
    if (currentTrip.available_seats < seatsReserved) {
      console.error("Not enough seats available");
      toast.error("Not enough seats available");
      return { success: false };
    }
    
    // 1. Create the reservation
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .insert({
        trip_id: tripId,
        passenger_id: passengerId,
        seats_reserved: seatsReserved,
        status: 'confirmed' as ReservationStatus
      })
      .select()
      .single();
    
    if (reservationError) {
      console.error("Error creating reservation:", reservationError);
      throw new Error(reservationError.message);
    }

    console.log("Created reservation record:", reservation);

    // 2. Update the available seats in the trip
    const { data: updatedTrip, error: updateError } = await supabase.rpc(
      'decrease_available_seats', 
      {
        trip_id: tripId,
        seats_count: seatsReserved
      }
    ).then(() => 
      // Fetch the updated trip to get the new available_seats count
      supabase
        .from('trips')
        .select('available_seats')
        .eq('id', tripId)
        .single()
    );

    if (updateError) {
      console.error("Error updating available seats:", updateError);
      // If there's an error updating seats, try to delete the reservation
      await supabase.from('reservations').delete().eq('id', reservation.id);
      throw new Error(updateError.message);
    }

    console.log("Reservation created successfully. Updated trip:", updatedTrip);
    return { 
      success: true, 
      updatedSeats: updatedTrip?.available_seats
    };
  } catch (error) {
    console.error("Failed to create reservation:", error);
    toast.error("Failed to create reservation. Please try again.");
    return { success: false };
  }
};

// Get all reservations for a user
export const getUserReservations = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id,
        seats_reserved,
        status,
        created_at,
        trip_id
      `)
      .eq('passenger_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching user reservations:", error);
      throw new Error(error.message);
    }
    
    // If we have trips data, fetch the trip details in a separate query
    if (data && data.length > 0) {
      const tripIds = data
        .filter(res => res.trip_id)
        .map(res => res.trip_id);
      
      if (tripIds.length > 0) {
        const { data: tripsData, error: tripsError } = await supabase
          .from('trips')
          .select(`
            id,
            origin,
            destination,
            departure_time,
            price,
            driver_id
          `)
          .in('id', tripIds);
        
        if (!tripsError && tripsData) {
          // Create a map of trip data
          const tripMap = new Map();
          tripsData.forEach(trip => {
            tripMap.set(trip.id, trip);
          });
          
          // Add trip data to reservations
          return data.map(res => {
            const tripData = res.trip_id ? tripMap.get(res.trip_id) : null;
            return {
              ...res,
              trips: tripData
            };
          });
        }
      }
    }
    
    return data;
  } catch (error) {
    console.error("Failed to get user reservations:", error);
    return [];
  }
};
