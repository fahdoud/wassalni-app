
import { supabase } from "@/integrations/supabase/client";
import { Ride } from "./types";
import { toast } from "sonner";

// Get all rides with their driver information
export const getRides = async (): Promise<Ride[]> => {
  try {
    const { data: trips, error } = await supabase
      .from('trips')
      .select(`
        id,
        origin,
        destination,
        departure_time,
        price,
        available_seats,
        status,
        driver_id,
        profiles:driver_id(full_name)
      `)
      .eq('status', 'active')
      .order('departure_time', { ascending: true });
      
    if (error) {
      console.error("Error fetching rides:", error);
      throw new Error(error.message);
    }
    
    return trips.map(trip => {
      // Safe extraction of driver name with type checking
      let driverName = 'Unknown Driver';
      
      if (trip.profiles && 
          typeof trip.profiles === 'object' && 
          trip.profiles !== null &&
          'full_name' in trip.profiles &&
          typeof trip.profiles.full_name === 'string') {
        driverName = trip.profiles.full_name;
      }
      
      // Format date and time
      const date = new Date(trip.departure_time);
      const formattedDate = date.toLocaleDateString();
      const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      return {
        id: trip.id,
        driver: driverName,
        origin: trip.origin,
        destination: trip.destination,
        departureDate: formattedDate,
        departureTime: formattedTime,
        price: trip.price,
        seats: trip.available_seats,
        trip_id: trip.id,
        timestamp: new Date(trip.departure_time).getTime()
      };
    });
  } catch (error) {
    console.error("Failed to get rides:", error);
    toast.error("Failed to load rides");
    return [];
  }
};

// Get a ride by ID
export const getRideById = async (rideId: string): Promise<Ride> => {
  try {
    // For mock rides with numeric IDs
    if (/^\d+$/.test(rideId)) {
      console.log("Getting mock ride:", rideId);
      return {
        id: rideId,
        driver: "Demo Driver",
        origin: "Demo Origin",
        destination: "Demo Destination",
        departureDate: "2023-06-15",
        departureTime: "10:00 AM",
        price: 2500,
        seats: 3,
        driverRating: 4.7,
        is_mock: true
      };
    }
    
    // For real rides with UUID IDs
    console.log("Fetching real ride:", rideId);
    const { data: trip, error } = await supabase
      .from('trips')
      .select(`
        id,
        origin,
        destination,
        departure_time,
        price,
        available_seats,
        status,
        driver_id,
        profiles:driver_id(full_name)
      `)
      .eq('id', rideId)
      .single();
      
    if (error) {
      console.error("Error fetching ride:", error);
      throw new Error(error.message);
    }
    
    // Safe extraction of driver name with type checking
    let driverName = 'Unknown Driver';
    
    if (trip.profiles && 
        typeof trip.profiles === 'object' && 
        trip.profiles !== null &&
        'full_name' in trip.profiles &&
        typeof trip.profiles.full_name === 'string') {
      driverName = trip.profiles.full_name;
    }
    
    // Format date and time
    const date = new Date(trip.departure_time);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Map the database trip to our Ride interface
    return {
      id: trip.id,
      driver: driverName,
      origin: trip.origin,
      destination: trip.destination,
      departureDate: formattedDate,
      departureTime: formattedTime,
      price: trip.price,
      seats: trip.available_seats,
      driverRating: 4.5, // Default rating
      trip_id: trip.id,
      timestamp: date.getTime()
    };
  } catch (error) {
    console.error("Failed to get ride:", error);
    toast.error("Failed to load ride details");
    
    // Return a default ride with error indication
    return {
      id: rideId || "error",
      driver: "Error",
      origin: "Could not load ride",
      destination: "Please try again",
      departureDate: "",
      departureTime: "",
      price: 0,
      seats: 0,
      driverRating: 0
    };
  }
};

// Listen for updates to a specific ride
export const subscribeToRideUpdates = (rideId: string, callback: (ride: Ride) => void) => {
  const channel = supabase
    .channel(`ride-updates-${rideId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'trips',
        filter: `id=eq.${rideId}`
      },
      async (payload) => {
        if (payload.new) {
          console.log("Ride update received:", payload.new);
          
          // Get the full ride details including joined data
          const { data: trip, error } = await supabase
            .from('trips')
            .select(`
              id,
              origin,
              destination,
              departure_time,
              price,
              available_seats,
              status,
              driver_id,
              profiles:driver_id(full_name)
            `)
            .eq('id', rideId)
            .single();
            
          if (error) {
            console.error("Error fetching updated ride:", error);
            return;
          }
          
          // Safe extraction of driver name with type checking
          let driverName = 'Unknown Driver';
          
          if (trip.profiles && 
              typeof trip.profiles === 'object' && 
              trip.profiles !== null &&
              'full_name' in trip.profiles &&
              typeof trip.profiles.full_name === 'string') {
            driverName = trip.profiles.full_name;
          }
          
          // Format date and time
          const date = new Date(trip.departure_time);
          const formattedDate = date.toLocaleDateString();
          const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          // Call the callback with the updated ride
          callback({
            id: trip.id,
            driver: driverName,
            origin: trip.origin,
            destination: trip.destination,
            departureDate: formattedDate,
            departureTime: formattedTime,
            price: trip.price,
            seats: trip.available_seats,
            driverRating: 4.5, // Default rating
            trip_id: trip.id,
            timestamp: date.getTime()
          });
        }
      }
    )
    .subscribe();
    
  return {
    unsubscribe: () => {
      console.log("Unsubscribing from ride updates:", rideId);
      supabase.removeChannel(channel);
    }
  };
};
