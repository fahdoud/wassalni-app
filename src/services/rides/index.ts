
// Main export file for the ride services
export type { Ride, ReservationStatus, Reservation } from './types';
export { getMockRides, getAlgerMockRides } from './mockRides';
export { getRideById } from './rideQueries';
export { createReservation, getUserReservations } from './reservationService';
export { submitFeedback, getUserFeedback } from './feedbackService';
export { createProposedTrip, getProposedTrips, updateProposedTripStatus } from './proposedTripService';

import { Ride } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { getMockRides, getAlgerMockRides } from "./mockRides";

export const getRides = async (): Promise<Ride[]> => {
  try {
    const { data: trips, error } = await supabase
      .from('trips')
      .select('id, driver_id, lieu_depart, lieu_arrivee, date_heure, prix, places_disponibles, statut')
      .eq('statut', 'active');

    if (error) throw new Error(error.message);

    if (trips && trips.length > 0) {
      const transformedRides: Ride[] = trips.map(trip => ({
        id: trip.id,
        driver: "Driver",
        from: trip.lieu_depart || '',
        to: trip.lieu_arrivee || '',
        date: trip.date_heure ? new Date(trip.date_heure).toISOString().split('T')[0] : '',
        time: trip.date_heure ? new Date(trip.date_heure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        price: trip.prix || 0,
        seats: trip.places_disponibles || 0,
        rating: 4.7,
        driverGender: 'male' as 'male',
        trip_id: trip.id
      }));

      const constantineMockRides = getMockRides().map(ride => ({ ...ride, driverGender: 'male' as 'male' }));
      const algerMockRides = getAlgerMockRides().map(ride => ({ ...ride, driverGender: 'male' as 'male' }));
      return [...transformedRides, ...constantineMockRides, ...algerMockRides];
    }
    
    const constantineMockRides = getMockRides().map(ride => ({ ...ride, driverGender: 'male' as 'male' }));
    const algerMockRides = getAlgerMockRides().map(ride => ({ ...ride, driverGender: 'male' as 'male' }));
    return [...constantineMockRides, ...algerMockRides];
  } catch (error) {
    console.error("Failed to fetch rides:", error);
    const constantineMockRides = getMockRides().map(ride => ({ ...ride, driverGender: 'male' as 'male' }));
    const algerMockRides = getAlgerMockRides().map(ride => ({ ...ride, driverGender: 'male' as 'male' }));
    return [...constantineMockRides, ...algerMockRides];
  }
};
