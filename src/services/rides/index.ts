
// Main export file for the ride services

// Export types
export type { Ride, ReservationStatus, Reservation } from './types';

// Export mock data service
export { getMockRides, getAlgerMockRides } from './mockRides';

// Export ride query services
export { getRideById } from './rideQueries';

// Export reservation service
export { createReservation, getUserReservations } from './reservationService';

// Export feedback service
export { submitFeedback, getUserFeedback } from './feedbackService';

// Export proposed trip service
export { createProposedTrip, getProposedTrips, updateProposedTripStatus } from './proposedTripService';

import { Ride } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { getMockRides, getAlgerMockRides } from "./mockRides";

export const getRides = async (): Promise<Ride[]> => {
  try {
    console.log("Fetching rides...");
    
    // Try to fetch real rides first
    const { data: trips, error } = await supabase
      .from('trips')
      .select(`
        id,
        driver_id,
        origin,
        destination,
        departure_time,
        price,
        available_seats,
        profiles:driver_id(full_name)
      `)
      .eq('status', 'active');

    if (error) {
      console.error("Error fetching trips:", error);
      throw new Error(error.message);
    }

    // If we have real rides, transform them
    if (trips && trips.length > 0) {
      console.log("Real trips found:", trips);
      
      const transformedRides: Ride[] = trips.map(trip => {
        // Get driver name from profiles join or use default
        const driverName = trip.profiles && 
          typeof trip.profiles === 'object' && 
          'full_name' in trip.profiles ? 
          String(trip.profiles.full_name || "Unknown Driver") : 
          "Unknown Driver";

        return {
          id: trip.id,
          driver: driverName,
          from: trip.origin,
          to: trip.destination,
          date: new Date(trip.departure_time).toISOString().split('T')[0],
          time: new Date(trip.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          price: trip.price,
          seats: trip.available_seats,
          rating: 4.7, // Default rating - would come from reviews in a real app
          driverGender: 'male' as 'male',
          trip_id: trip.id
        };
      });

      console.log("Transformed rides:", transformedRides);
      
      // Also add mock rides for both Constantine and Alger
      const constantineMockRides = getMockRides().map(ride => ({
        ...ride,
        driverGender: 'male' as 'male'
      }));
      
      const algerMockRides = getAlgerMockRides().map(ride => ({
        ...ride,
        driverGender: 'male' as 'male'
      }));
      
      return [...transformedRides, ...constantineMockRides, ...algerMockRides];
    }
    
    // If no real rides in DB, return mock rides for both Constantine and Alger
    console.log("No real rides found, using mock rides");
    const constantineMockRides = getMockRides().map(ride => ({
      ...ride,
      driverGender: 'male' as 'male'
    }));
    
    const algerMockRides = getAlgerMockRides().map(ride => ({
      ...ride, 
      driverGender: 'male' as 'male'
    }));
    
    return [...constantineMockRides, ...algerMockRides];
  } catch (error) {
    console.error("Failed to fetch rides:", error);
    
    // In case of error, return mock rides for both Constantine and Alger
    const constantineMockRides = getMockRides().map(ride => ({
      ...ride,
      driverGender: 'male' as 'male'
    }));
    
    const algerMockRides = getAlgerMockRides().map(ride => ({
      ...ride,
      driverGender: 'male' as 'male'
    }));
    
    return [...constantineMockRides, ...algerMockRides];
  }
};
