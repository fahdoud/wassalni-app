
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
      
      // Get user profile information
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', passengerId)
        .single();
      
      // Parse full name into first and last name
      const fullNameParts = (userProfile?.full_name || 'User').split(' ');
      const firstName = fullNameParts[0] || '';
      const lastName = fullNameParts.slice(1).join(' ') || '';
      
      // Get user email from auth
      const { data: { user } } = await supabase.auth.getUser();
      const userEmail = user?.email || '';
      
      // Create a reservation entry for mock trips with detailed information
      const { data: reservation, error: reservationError } = await supabase
        .from('reservations')
        .insert({
          trip_id: null, // No real trip ID for mock trips
          passenger_id: passengerId,
          passenger_name: userProfile?.full_name || 'User',
          passenger_first_name: firstName,
          passenger_last_name: lastName,
          passenger_email: userEmail,
          seats_reserved: seatsReserved,
          status: 'mock' as ReservationStatus,
          price: 0, // This will be updated with the actual price
          origin: 'Not specified', // This will be updated with actual origin
          destination: 'Not specified', // This will be updated with actual destination
          departure_point: 'Not specified', // This will be updated with detailed departure point
          destination_point: 'Not specified' // This will be updated with detailed destination point
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
    
    // First fetch current available seats and trip details
    const { data: currentTrip, error: tripError } = await supabase
      .from('trips')
      .select('available_seats, origin, destination, price')
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
    
    // Get user profile information
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', passengerId)
      .single();
    
    // Parse full name into first and last name
    const fullNameParts = (userProfile?.full_name || 'User').split(' ');
    const firstName = fullNameParts[0] || '';
    const lastName = fullNameParts.slice(1).join(' ') || '';
    
    // Get user email from auth
    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email || '';
    
    // Calculate total price
    const totalPrice = currentTrip.price * seatsReserved;
    
    // 1. Create the reservation with all detailed information
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .insert({
        trip_id: tripId,
        passenger_id: passengerId,
        passenger_name: userProfile?.full_name || 'User',
        passenger_first_name: firstName,
        passenger_last_name: lastName,
        passenger_email: userEmail,
        seats_reserved: seatsReserved,
        status: 'confirmed' as ReservationStatus,
        price: totalPrice,
        origin: currentTrip.origin,
        destination: currentTrip.destination,
        departure_point: currentTrip.origin, // This could be more specific in the future
        destination_point: currentTrip.destination // This could be more specific in the future
      })
      .select()
      .single();
    
    if (reservationError) {
      console.error("Error creating reservation:", reservationError);
      throw new Error(reservationError.message);
    }

    console.log("Created reservation record:", reservation);

    // 2. Update the available seats in the trip using the new function
    const { data: success, error: updateError } = await supabase
      .rpc('decrease_available_seats', {
        trip_id: tripId,
        seats_count: seatsReserved
      });

    if (updateError || !success) {
      console.error("Error updating available seats:", updateError);
      // If there's an error updating seats, try to delete the reservation
      await supabase.from('reservations').delete().eq('id', reservation.id);
      throw new Error(updateError?.message || "Failed to update seats");
    }

    // 3. Send a welcome message to the ride chat
    try {
      // Get user display info
      const userInfo = await getUserDisplayInfo(passengerId);
      
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

    // 4. Fetch the updated seat count to confirm
    const { data: updatedTrip, error: fetchError } = await supabase
      .from('trips')
      .select('available_seats')
      .eq('id', tripId)
      .single();

    if (fetchError) {
      console.error("Error fetching updated seat count:", fetchError);
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
        trip_id,
        passenger_first_name,
        passenger_last_name,
        passenger_email,
        departure_point,
        destination_point,
        price,
        origin,
        destination
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
