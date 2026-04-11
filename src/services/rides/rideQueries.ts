
import { supabase } from "@/integrations/supabase/client";
import { Ride } from './types';
import { getMockRides, getAlgerMockRides } from './mockRides';

export const getRides = async (): Promise<Ride[]> => {
  try {
    const { data: trips, error } = await supabase
      .from('trips')
      .select('id, lieu_depart, lieu_arrivee, date_heure, prix, places_disponibles, driver_id, statut')
      .eq('statut', 'active');
    
    if (error) throw new Error(error.message);

    if (trips && trips.length > 0) {
      const rides: Ride[] = trips.map(trip => ({
        id: trip.id,
        driver: "Driver",
        from: trip.lieu_depart || '',
        to: trip.lieu_arrivee || '',
        date: trip.date_heure ? new Date(trip.date_heure).toISOString().split('T')[0] : '',
        time: trip.date_heure ? new Date(trip.date_heure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        price: trip.prix || 0,
        seats: trip.places_disponibles || 0,
        rating: 4.7,
        trip_id: trip.id
      }));
      return rides;
    }
    
    return getMockRides();
  } catch {
    return getMockRides();
  }
};

export const getRideById = async (rideId: string): Promise<Ride | null> => {
  if (/^\d+$/.test(rideId)) {
    let mockRide = getMockRides().find(ride => ride.id === rideId);
    if (!mockRide) mockRide = getAlgerMockRides().find(ride => ride.id === rideId);
    return mockRide || null;
  }
  
  try {
    const { data: trip, error } = await supabase
      .from('trips')
      .select('id, lieu_depart, lieu_arrivee, date_heure, prix, places_disponibles, driver_id, statut')
      .eq('id', rideId)
      .single();
    
    if (error) return null;

    return {
      id: trip.id,
      driver: "Driver",
      from: trip.lieu_depart || '',
      to: trip.lieu_arrivee || '',
      date: trip.date_heure ? new Date(trip.date_heure).toISOString().split('T')[0] : '',
      time: trip.date_heure ? new Date(trip.date_heure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      price: trip.prix || 0,
      seats: trip.places_disponibles || 0,
      rating: 4.7,
      trip_id: trip.id
    };
  } catch {
    return null;
  }
};

export const subscribeToRideUpdates = (rideId: string, callback: (ride: Ride) => void) => {
  if (/^\d+$/.test(rideId)) return { unsubscribe: () => {} };

  const channel = supabase
    .channel(`ride-${rideId}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'trips', filter: `id=eq.${rideId}` },
      async () => {
        const updatedRide = await getRideById(rideId);
        if (updatedRide) callback(updatedRide);
      }
    )
    .subscribe();

  return { unsubscribe: () => { supabase.removeChannel(channel); } };
};
