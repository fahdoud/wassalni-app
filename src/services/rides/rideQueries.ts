
import { supabase } from "@/integrations/supabase/client";
import { Ride } from './types';
import { getMockRides } from './mockRides';

// Get all available rides
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
        driver_id,
        profiles(full_name)
      `)
      .eq('status', 'active')
      .gt('available_seats', 0);
    
    if (error) {
      console.error("Error fetching rides:", error);
      throw new Error(error.message);
    }

    // Transform the data to match our Ride interface
    const rides: Ride[] = trips.map(trip => {
      // Handle the case where profiles is an array or object
      const driverName = trip.profiles 
        ? Array.isArray(trip.profiles) 
          ? trip.profiles[0]?.full_name 
          : trip.profiles.full_name
        : "Unknown Driver";

      return {
        id: trip.id,
        driver: driverName || "Unknown Driver",
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

    return rides;
  } catch (error) {
    console.error("Failed to get rides:", error);
    return [];
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
        profiles(full_name)
      `)
      .eq('id', rideId)
      .single();
    
    if (error) {
      console.error("Error fetching ride:", error);
      return null;
    }

    // Handle the case where profiles is an array or object
    const driverName = trip.profiles 
      ? Array.isArray(trip.profiles) 
        ? trip.profiles[0]?.full_name 
        : trip.profiles.full_name
      : "Unknown Driver";

    // Transform the trip data to our Ride interface
    const ride: Ride = {
      id: trip.id,
      driver: driverName || "Unknown Driver",
      from: trip.origin,
      to: trip.destination,
      date: new Date(trip.departure_time).toISOString().split('T')[0],
      time: new Date(trip.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: trip.price,
      seats: trip.available_seats,
      rating: 4.7, // Default rating - would come from reviews
      trip_id: trip.id
    };

    return ride;
  } catch (error) {
    console.error("Failed to get ride:", error);
    return null;
  }
};
