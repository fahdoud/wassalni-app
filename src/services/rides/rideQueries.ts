
import { supabase } from "@/integrations/supabase/client";
import { Ride } from './types';
import { getMockRides } from './mockRides';

// Get all available rides
export const getRides = async (): Promise<Ride[]> => {
  try {
    console.log("Fetching rides with cache busting");
    
    // First try to get trips directly
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
        drivers:driver_id(full_name)
      `)
      .eq('status', 'active');
    
    if (error) {
      console.error("Error fetching rides:", error);
      throw new Error(error.message);
    }

    // If we successfully got trips, transform them to Ride objects
    if (trips && trips.length > 0) {
      console.log("Trips fetched successfully:", trips);
      
      // Transform the data to match our Ride interface
      const rides: Ride[] = trips.map(trip => {
        // Get driver name from drivers join or use fallback
        const driverName = trip.drivers ? trip.drivers.full_name : "Unknown Driver";

        return {
          id: trip.id,
          driver: driverName,
          from: trip.origin,
          to: trip.destination,
          date: new Date(trip.departure_time).toISOString().split('T')[0],
          time: new Date(trip.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          price: trip.price,
          seats: trip.available_seats,
          rating: 4.7, // Default rating - in a real app would come from reviews
          trip_id: trip.id
        };
      });

      console.log("Transformed rides data:", rides);
      return rides;
    }
    
    // If no actual database trips, return mock rides
    return getMockRides();
  } catch (error) {
    console.error("Failed to get rides:", error);
    return getMockRides();
  }
};

// Get a specific ride by ID
export const getRideById = async (rideId: string): Promise<Ride | null> => {
  // Check if the ID is from a mock ride (simple numeric ID)
  if (/^\d+$/.test(rideId)) {
    console.log("Using mock ride with ID:", rideId);
    const mockRides = getMockRides();
    const mockRide = mockRides.find(ride => ride.id === rideId);
    return mockRide || null;
  }
  
  // Otherwise try to fetch from Supabase (UUID format)
  try {
    console.log("Fetching real ride with ID:", rideId);
    
    // Fetch the trip data with driver join
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
        drivers:driver_id(full_name)
      `)
      .eq('id', rideId)
      .single();
    
    if (error) {
      console.error("Error fetching ride:", error);
      return null;
    }

    console.log("Trip data fetched:", trip);

    // Transform the trip data to our Ride interface
    const ride: Ride = {
      id: trip.id,
      driver: trip.drivers ? trip.drivers.full_name : "Unknown Driver",
      from: trip.origin,
      to: trip.destination,
      date: new Date(trip.departure_time).toISOString().split('T')[0],
      time: new Date(trip.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: trip.price,
      seats: trip.available_seats,
      rating: 4.7, // Default rating - would come from reviews
      trip_id: trip.id
    };

    console.log("Transformed ride data:", ride);
    return ride;
  } catch (error) {
    console.error("Failed to get ride:", error);
    return null;
  }
};

// Subscribe to changes for a specific ride
export const subscribeToRideUpdates = (rideId: string, callback: (ride: Ride) => void) => {
  if (/^\d+$/.test(rideId)) {
    // Mock rides don't support real-time updates
    console.log("Mock rides don't support real-time updates");
    return { unsubscribe: () => {} };
  }

  console.log("Setting up real-time subscription for ride:", rideId);
  
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
        console.log("Received real-time update for ride:", payload);
        
        // Fetch the updated ride data
        const updatedRide = await getRideById(rideId);
        if (updatedRide) {
          callback(updatedRide);
        }
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      console.log("Unsubscribing from ride updates");
      supabase.removeChannel(channel);
    }
  };
};
