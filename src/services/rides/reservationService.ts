
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ReservationStatus } from "./types";
import { getUserDisplayInfo } from "./chatService";

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
    
    // First fetch current trip details
    const { data: currentTrip, error: tripError } = await supabase
      .from('trips')
      .select('available_seats, origin, destination, price, departure_time')
      .eq('id', tripId)
      .single();
      
    if (tripError) {
      console.error("Error fetching current trip details:", tripError);
      throw new Error(tripError.message);
    }
    
    if (currentTrip.available_seats < seatsReserved) {
      console.error("Not enough seats available");
      toast.error("Not enough seats available");
      return { success: false };
    }
    
    // Get user display info for storing with reservation
    const userInfo = await getUserDisplayInfo(passengerId);
    
    // 1. Create the reservation with additional fields
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .insert({
        trip_id: tripId,
        passenger_id: passengerId,
        seats_reserved: seatsReserved,
        status: 'confirmed' as ReservationStatus,
        passenger_name: userInfo.name,
        origin: currentTrip.origin,
        destination: currentTrip.destination,
        price: currentTrip.price * seatsReserved,
        reservation_date: new Date().toISOString()
      })
      .select()
      .single();
    
    if (reservationError) {
      console.error("Error creating reservation:", reservationError);
      throw new Error(reservationError.message);
    }

    console.log("Created reservation record:", reservation);

    // 2. Update seat availability using the new function
    const { data: seatUpdateSuccess, error: seatUpdateError } = await supabase
      .rpc('decrease_seat_availability', {
        p_trip_id: tripId,
        p_seats_count: seatsReserved
      });

    if (seatUpdateError || !seatUpdateSuccess) {
      console.error("Error updating seat availability:", seatUpdateError);
      // If there's an error updating seats, try to delete the reservation
      await supabase.from('reservations').delete().eq('id', reservation.id);
      throw new Error(seatUpdateError?.message || "Failed to update seats");
    }
    
    // 3. Also update the available seats in the trips table for backward compatibility
    const { data: success, error: updateError } = await supabase
      .rpc('decrease_available_seats', {
        trip_id: tripId,
        seats_count: seatsReserved
      });

    if (updateError || !success) {
      console.error("Error updating available seats:", updateError);
      // No need to rollback since the primary update succeeded
      console.warn("Failed to update trips.available_seats, but seat_availability was updated successfully");
    }

    // 4. Send a welcome message to the ride chat
    try {
      // Add welcome message to the chat
      await supabase.from('ride_messages').insert({
        ride_id: tripId,
        sender_id: 'system', // Using 'system' as ID for system messages
        sender_name: 'System',
        content: `${userInfo.name} has joined the ride.`
      });
    } catch (chatError) {
      console.error("Error sending welcome message to chat:", chatError);
      // Don't throw error here, the reservation was still successful
    }

    // 5. Fetch the updated seat count to confirm
    const { data: seatAvailability, error: fetchError } = await supabase
      .from('seat_availability')
      .select('remaining_seats')
      .eq('trip_id', tripId)
      .single();

    if (fetchError) {
      console.error("Error fetching updated seat count:", fetchError);
    }

    console.log("Reservation created successfully. Updated seat availability:", seatAvailability);
    return { 
      success: true, 
      updatedSeats: seatAvailability?.remaining_seats
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
        trip_id,
        passenger_name,
        origin,
        destination,
        price,
        reservation_date
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
