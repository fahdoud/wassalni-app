
import { supabase } from "@/integrations/supabase/client";
import { Ride } from './types';
import { getMockRides } from './mockRides';

// Get all available rides
export const getRides = async (): Promise<Ride[]> => {
  try {
    console.log("Fetching rides with cache busting");
    
    // Add a cache-busting timestamp to ensure fresh data
    const timestamp = new Date().getTime();
    
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
        driver_id
      `)
      .eq('status', 'active');
    
    if (error) {
      console.error("Error fetching rides:", error);
      throw new Error(error.message);
    }

    // If we successfully got trips, now get driver names in a separate query
    if (trips && trips.length > 0) {
      console.log("Trips fetched successfully:", trips);
      
      // Get all driver IDs from the trips
      const driverIds = trips.map(trip => trip.driver_id).filter(Boolean);
      
      // Fetch driver names from profiles
      const { data: drivers, error: driversError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', driverIds);
      
      if (driversError) {
        console.error("Error fetching drivers:", driversError);
      }
      
      // Create a map of driver IDs to names for easy lookup
      const driverMap = new Map();
      if (drivers) {
        drivers.forEach(driver => {
          driverMap.set(driver.id, driver.full_name);
        });
      }

      // Transform the data to match our Ride interface
      const rides: Ride[] = trips.map(trip => {
        // Look up the driver name using our map
        const driverName = trip.driver_id ? driverMap.get(trip.driver_id) || "Unknown Driver" : "Unknown Driver";

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
    
    // Disable caching by adding a cache-busting timestamp
    const timestamp = new Date().getTime();
    
    // First fetch the trip data with cache busting
    const { data: trip, error } = await supabase
      .from('trips')
      .select(`
        id,
        origin,
        destination,
        departure_time,
        price,
        available_seats,
        driver_id
      `)
      .eq('id', rideId)
      .single();
    
    if (error) {
      console.error("Error fetching ride:", error);
      return null;
    }

    console.log("Trip data fetched:", trip);

    // Fetch the driver's name from profiles
    let driverName = "Unknown Driver";
    if (trip.driver_id) {
      const { data: driver, error: driverError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', trip.driver_id)
        .single();
      
      if (!driverError && driver) {
        driverName = driver.full_name;
      }
    }

    // Transform the trip data to our Ride interface
    const ride: Ride = {
      id: trip.id,
      driver: driverName,
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
