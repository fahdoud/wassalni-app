
import { supabase } from "@/integrations/supabase/client";
import { Ride } from "./types";
import { toast } from "sonner";

export const getRideById = async (rideId: string): Promise<Ride> => {
  try {
    // For mock rides, return a mock ride
    if (/^\d+$/.test(rideId)) {
      console.log("Getting mock ride with ID:", rideId);
      return {
        id: rideId,
        driver: "Mock Driver",
        from: "Mock Origin",
        to: "Mock Destination",
        date: "2023-01-01",
        time: "10:00 AM",
        price: 500,
        seats: 4,
        rating: 4.5,
        is_mock: true
      };
    }
    
    // For real rides with UUID IDs, fetch from database
    console.log("Fetching real ride with ID:", rideId);
    const { data: trip, error } = await supabase
      .from('trips')
      .select(`
        id,
        origin,
        destination,
        departure_time,
        price,
        available_seats,
        driver_id,
        profiles:driver_id(full_name)
      `)
      .eq('id', rideId)
      .single();
      
    if (error) {
      console.error("Error fetching ride:", error);
      throw new Error(error.message);
    }
    
    // Extract the driver name from the profiles join
    // Fixed: Added optional chaining to prevent null reference error
    const driverName = trip.profiles?.full_name || 'Unknown Driver';
    
    // Map the database trip to our Ride interface
    return {
      id: trip.id,
      driver: driverName,
      from: trip.origin,
      to: trip.destination,
      date: new Date(trip.departure_time).toLocaleDateString(),
      time: new Date(trip.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: trip.price,
      seats: trip.available_seats,
      rating: 4, // Default rating (not stored in trips table)
      trip_id: trip.id
    };
  } catch (error) {
    console.error("Failed to get ride:", error);
    toast.error("Failed to load ride details");
    
    // Return a default ride with error indication
    return {
      id: rideId,
      driver: "Error",
      from: "Could not load ride",
      to: "Please try again",
      date: "",
      time: "",
      price: 0,
      seats: 0,
      rating: 0,
    };
  }
};

export const getSimilarRides = async (rideId: string): Promise<Ride[]> => {
  try {
    // For mock rides, return mock similar rides
    if (/^\d+$/.test(rideId)) {
      console.log("Getting mock similar rides for ID:", rideId);
      return Array(3).fill(null).map((_, idx) => ({
        id: `mock-similar-${idx}`,
        driver: `Similar Driver ${idx + 1}`,
        from: "Similar Origin",
        to: "Similar Destination",
        date: "2023-01-02",
        time: "11:00 AM",
        price: 450 + (idx * 50),
        seats: 2 + idx,
        rating: 4.0 + (idx * 0.2),
        is_mock: true
      }));
    }
    
    // Get the original ride's origin and destination
    const { data: originalTrip, error: originalError } = await supabase
      .from('trips')
      .select('origin, destination')
      .eq('id', rideId)
      .single();
      
    if (originalError) {
      console.error("Error fetching original trip:", originalError);
      throw new Error(originalError.message);
    }
    
    // Find trips with same origin and destination, excluding the original
    const { data: trips, error } = await supabase
      .from('trips')
      .select(`
        id,
        origin,
        destination,
        departure_time,
        price,
        available_seats,
        driver_id,
        profiles:driver_id(full_name)
      `)
      .eq('origin', originalTrip.origin)
      .eq('destination', originalTrip.destination)
      .neq('id', rideId)
      .eq('status', 'active')
      .order('departure_time', { ascending: true })
      .limit(5);
      
    if (error) {
      console.error("Error fetching similar rides:", error);
      throw new Error(error.message);
    }
    
    // Map to Ride interface
    return trips.map(trip => {
      // Fixed: Added optional chaining to prevent null reference error
      const driverName = trip.profiles?.full_name || 'Unknown Driver';
      
      return {
        id: trip.id,
        driver: driverName,
        from: trip.origin,
        to: trip.destination,
        date: new Date(trip.departure_time).toLocaleDateString(),
        time: new Date(trip.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price: trip.price,
        seats: trip.available_seats,
        rating: 4, // Default rating
        trip_id: trip.id
      };
    });
  } catch (error) {
    console.error("Failed to get similar rides:", error);
    return [];
  }
};

export const subscribeToRideUpdates = (rideId: string, callback: (ride: Ride) => void) => {
  // Mock data doesn't need real-time updates
  if (/^\d+$/.test(rideId)) {
    console.log("Not subscribing to updates for mock ride:", rideId);
    return {
      unsubscribe: () => {}
    };
  }
  
  console.log("Setting up real-time subscription for ride:", rideId);
  
  // Set up channel for real-time updates
  const channel = supabase
    .channel(`ride-${rideId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'trips',
        filter: `id=eq.${rideId}`
      },
      async (payload) => {
        console.log("Received real-time ride update:", payload);
        // Fetch the complete ride data
        const { data: trip, error } = await supabase
          .from('trips')
          .select(`
            id,
            origin,
            destination,
            departure_time,
            price,
            available_seats,
            driver_id,
            profiles:driver_id(full_name)
          `)
          .eq('id', rideId)
          .single();
          
        if (error) {
          console.error("Error fetching updated ride:", error);
          return;
        }
        
        // Fixed: Added optional chaining to prevent null reference error
        const driverName = trip.profiles?.full_name || 'Unknown Driver';
        
        const updatedRide: Ride = {
          id: trip.id,
          driver: driverName,
          from: trip.origin,
          to: trip.destination,
          date: new Date(trip.departure_time).toLocaleDateString(),
          time: new Date(trip.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          price: trip.price,
          seats: trip.available_seats,
          rating: 4, // Default rating
          trip_id: trip.id
        };
        
        callback(updatedRide);
      }
    )
    .subscribe();
    
  // Return unsubscribe function
  return {
    unsubscribe: () => {
      console.log("Unsubscribing from ride updates for ride:", rideId);
      supabase.removeChannel(channel);
    }
  };
};
