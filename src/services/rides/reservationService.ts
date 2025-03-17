
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ReservationStatus } from "./types";

// Create a reservation
export const createReservation = async (
  tripId: string, 
  passengerId: string, 
  seatsReserved: number
): Promise<boolean> => {
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
      return true;
    }
    
    // For real rides with UUID trip IDs
    console.log("Creating a real reservation with tripId:", tripId);
    
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
    const { error: updateError } = await supabase.rpc(
      'decrease_available_seats', 
      {
        trip_id: tripId,
        seats_count: seatsReserved
      }
    );

    if (updateError) {
      console.error("Error updating available seats:", updateError);
      // If there's an error updating seats, try to delete the reservation
      await supabase.from('reservations').delete().eq('id', reservation.id);
      throw new Error(updateError.message);
    }

    console.log("Reservation created successfully:", reservation);
    return true;
  } catch (error) {
    console.error("Failed to create reservation:", error);
    toast.error("Failed to create reservation. Please try again.");
    return false;
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
        trips (
          id,
          origin,
          destination,
          departure_time,
          price,
          driver_id,
          profiles (full_name)
        )
      `)
      .eq('passenger_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching user reservations:", error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error("Failed to get user reservations:", error);
    return [];
  }
};
