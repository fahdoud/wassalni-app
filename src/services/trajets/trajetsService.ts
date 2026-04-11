import { supabase } from "@/integrations/supabase/client";
import { Trajet, StatutReservation } from "./types";
import { getMockRides } from "@/services/rides/mockRides";

const getAlgerMockTrajets = (): Trajet[] => [
  { id: "alger1", chauffeur: "Karim Benzema", origine: "Sidi Yahia", destination: "Hydra", date: new Date().toISOString().split('T')[0], heure: "08:30", prix: 300, places_dispo: 3, note: 4.8, est_mock: true },
  { id: "alger2", chauffeur: "Mohamed Salah", origine: "Hydra", destination: "Bir Mourad Raïs", date: new Date().toISOString().split('T')[0], heure: "09:15", prix: 250, places_dispo: 2, note: 4.6, est_mock: true },
  { id: "alger3", chauffeur: "Sofiane Feghouli", origine: "Bab Ezzouar", destination: "Alger Centre", date: new Date().toISOString().split('T')[0], heure: "10:00", prix: 350, places_dispo: 4, note: 4.7, est_mock: true },
  { id: "alger4", chauffeur: "Riyad Mahrez", origine: "Kouba", destination: "El Biar", date: new Date().toISOString().split('T')[0], heure: "11:30", prix: 280, places_dispo: 1, note: 4.9, est_mock: true },
  { id: "alger5", chauffeur: "Islam Slimani", origine: "Bordj El Kiffan", destination: "Dar El Beïda", date: new Date().toISOString().split('T')[0], heure: "14:00", prix: 320, places_dispo: 3, note: 4.5, est_mock: true },
];

const mockRidesToTrajets = (rides: any[]): Trajet[] => rides.map(ride => ({
  id: ride.id, chauffeur: ride.driver, origine: ride.from, destination: ride.to,
  date: ride.date, heure: ride.time, prix: ride.price, places_dispo: ride.seats, note: ride.rating, est_mock: true
}));

export const getTrajets = async (): Promise<Trajet[]> => {
  try {
    const { data: trips, error } = await supabase
      .from('trips')
      .select('id, lieu_depart, lieu_arrivee, date_heure, prix, places_disponibles, driver_id, statut')
      .eq('statut', 'active');
    
    if (error) throw new Error(error.message);

    if (trips && trips.length > 0) {
      const dbTrajets: Trajet[] = trips.map(t => ({
        id: t.id, chauffeur: "Chauffeur", origine: t.lieu_depart || '', destination: t.lieu_arrivee || '',
        date: t.date_heure ? new Date(t.date_heure).toISOString().split('T')[0] : '',
        heure: t.date_heure ? new Date(t.date_heure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        prix: t.prix || 0, places_dispo: t.places_disponibles || 0, note: 4.7, chauffeur_id: t.driver_id || undefined
      }));
      return [...dbTrajets, ...mockRidesToTrajets(getMockRides()), ...getAlgerMockTrajets()];
    }
    
    return [...mockRidesToTrajets(getMockRides()), ...getAlgerMockTrajets()];
  } catch {
    return [...mockRidesToTrajets(getMockRides()), ...getAlgerMockTrajets()];
  }
};

export const getTrajetById = async (trajetId: string): Promise<Trajet | null> => {
  if (/^\d+$/.test(trajetId) || trajetId.startsWith('alger')) {
    const allMock = [...mockRidesToTrajets(getMockRides()), ...getAlgerMockTrajets()];
    return allMock.find(t => t.id === trajetId) || null;
  }
  
  try {
    const { data: t, error } = await supabase
      .from('trips')
      .select('id, lieu_depart, lieu_arrivee, date_heure, prix, places_disponibles, driver_id')
      .eq('id', trajetId)
      .single();
    if (error) return null;

    return {
      id: t.id, chauffeur: "Chauffeur", origine: t.lieu_depart || '', destination: t.lieu_arrivee || '',
      date: t.date_heure ? new Date(t.date_heure).toISOString().split('T')[0] : '',
      heure: t.date_heure ? new Date(t.date_heure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      prix: t.prix || 0, places_dispo: t.places_disponibles || 0, note: 4.7, chauffeur_id: t.driver_id || undefined
    };
  } catch { return null; }
};

export const subscribeToTrajetUpdates = (trajetId: string, callback: (trajet: Trajet) => void) => {
  if (/^\d+$/.test(trajetId) || trajetId.startsWith('alger')) return { unsubscribe: () => {} };

  const channel = supabase
    .channel(`trajet-${trajetId}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'trips', filter: `id=eq.${trajetId}` },
      async () => {
        const updated = await getTrajetById(trajetId);
        if (updated) callback(updated);
      }
    )
    .subscribe();

  return { unsubscribe: () => { supabase.removeChannel(channel); } };
};

export const createReservationTrajet = async (
  trajetId: string, passagerId: string, placesReservees: number
): Promise<{ success: boolean, placesDispoMisesAJour?: number }> => {
  try {
    if (/^\d+$/.test(trajetId) || trajetId.startsWith('alger')) {
      // Mock reservation
      const mockId = crypto.randomUUID();
      await supabase.from('reservations').insert({
        trip_id: mockId,
        user_id: passagerId,
        nombre_places_reservees: placesReservees,
        statut: 'confirmed'
      });
      return { success: true };
    }
    
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('places_disponibles')
      .eq('id', trajetId)
      .single();
    if (tripError) throw new Error(tripError.message);
    
    if ((trip.places_disponibles || 0) < placesReservees) return { success: false };
    
    const { error: resError } = await supabase.from('reservations').insert({
      trip_id: trajetId,
      user_id: passagerId,
      nombre_places_reservees: placesReservees,
      statut: 'confirmed'
    });
    if (resError) throw new Error(resError.message);
    
    const newSeats = (trip.places_disponibles || 0) - placesReservees;
    await supabase.from('trips').update({ places_disponibles: newSeats }).eq('id', trajetId);
    
    return { success: true, placesDispoMisesAJour: newSeats };
  } catch {
    return { success: false };
  }
};
