
import { supabase } from "@/integrations/supabase/client";
import { Reservation, ReservationStatus } from './types';
import { toast } from "sonner";

// Get all reservations for the current user
export const getUserReservations = async (): Promise<Reservation[]> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("User not authenticated");
      return [];
    }
    
    // Fetch the user's reservations
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select(`
        id,
        seats_reserved,
        status,
        created_at,
        trip_id,
        trip:trips(
          id,
          origin,
          destination,
          departure_time,
          price,
          available_seats,
          driver_id,
          driver:profiles(full_name)
        )
      `)
      .eq('passenger_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching user reservations:", error);
      return [];
    }
    
    console.log("Raw reservations data:", reservations);
    
    // Transform the data to match our Reservation interface
    const formattedReservations: Reservation[] = reservations.map(res => {
      // Safely access nested trip data
      let trip = undefined;
      
      if (res.trip) {
        // Extract the trip object - it's a single object, not an array
        const tripData = res.trip;
        
        // Handle driver name safely
        let driverName = 'Unknown Driver';
        
        if (tripData && tripData.driver && typeof tripData.driver === 'object') {
          // When the driver profile data is returned
          driverName = tripData.driver.full_name || 'Unknown Driver';
        }
          
        trip = {
          id: tripData.id,
          origin: tripData.origin,
          destination: tripData.destination,
          departure_time: tripData.departure_time,
          price: tripData.price,
          driver_id: tripData.driver_id,
          profiles: {
            full_name: driverName
          }
        };
      }

      return {
        id: res.id,
        trip_id: res.trip_id,
        passenger_id: user.id,
        seats_reserved: res.seats_reserved,
        status: res.status as ReservationStatus,
        created_at: res.created_at,
        updated_at: res.created_at,
        trip
      };
    });
    
    console.log("Formatted reservations:", formattedReservations);
    return formattedReservations;
  } catch (error) {
    console.error("Failed to get user reservations:", error);
    return [];
  }
};

// Cancel a reservation
export const cancelReservation = async (reservationId: string): Promise<boolean> => {
  try {
    // First get the reservation to get the trip ID and seats
    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select('trip_id, seats_reserved')
      .eq('id', reservationId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching reservation:", fetchError);
      return false;
    }
    
    // Update the reservation status
    const { error: updateError } = await supabase
      .from('reservations')
      .update({ status: 'cancelled' as ReservationStatus })
      .eq('id', reservationId);
      
    if (updateError) {
      console.error("Error cancelling reservation:", updateError);
      return false;
    }
    
    // Update the available seats in the trip
    if (reservation.trip_id) {
      // First get current available seats
      const { data: tripData, error: tripFetchError } = await supabase
        .from('trips')
        .select('available_seats')
        .eq('id', reservation.trip_id)
        .single();
        
      if (!tripFetchError && tripData) {
        // Update available seats
        const newSeats = tripData.available_seats + reservation.seats_reserved;
        await supabase
          .from('trips')
          .update({ available_seats: newSeats })
          .eq('id', reservation.trip_id);
      }
    }
    
    toast.success("Reservation cancelled successfully");
    return true;
  } catch (error) {
    console.error("Failed to cancel reservation:", error);
    toast.error("Failed to cancel reservation");
    return false;
  }
};
