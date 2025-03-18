import { supabase } from "@/integrations/supabase/client";
import { Trajet, ReservationTrajet } from "./types";
import { toast } from "sonner";

export const getTrajets = async (): Promise<Trajet[]> => {
  try {
    console.log("Fetching trajets from database");
    const { data: trajets, error } = await supabase
      .from('trajets')
      .select(`
        id,
        origine,
        destination,
        date_depart,
        prix,
        places_dispo,
        statut,
        created_at,
        chauffeur_id,
        profiles:chauffeur_id(full_name)
      `)
      .eq('statut', 'actif')
      .order('date_depart', { ascending: true });
      
    if (error) {
      console.error("Error fetching trajets:", error);
      throw new Error(error.message);
    }
    
    // Map to Trajet interface
    return trajets.map(trajet => {
      // Use a more robust type check for the profiles object
      let chauffeurName = 'Chauffeur Inconnu';
      
      // Check if profiles exists, is an object, and has full_name property
      if (trajet.profiles && 
          typeof trajet.profiles === 'object' && 
          trajet.profiles !== null && 
          'full_name' in trajet.profiles && 
          trajet.profiles.full_name) {
        chauffeurName = trajet.profiles.full_name;
      }
      
      // Format date and time
      const date = new Date(trajet.date_depart);
      
      return {
        id: trajet.id,
        chauffeur: chauffeurName,
        origine: trajet.origine,
        destination: trajet.destination,
        date: date.toLocaleDateString(),
        heure: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        prix: trajet.prix,
        places: trajet.places_dispo,
        note: 4, // Default rating
        trajet_id: trajet.id
      };
    });
  } catch (error) {
    console.error("Failed to get trajets:", error);
    return [];
  }
};

export const getTrajetById = async (trajetId: string): Promise<Trajet> => {
  try {
    // For mock trajets, return a mock trajet
    if (/^\d+$/.test(trajetId)) {
      console.log("Getting mock trajet with ID:", trajetId);
      return {
        id: trajetId,
        chauffeur: "Chauffeur Demo",
        origine: "Origine Demo",
        destination: "Destination Demo",
        date: "2023-01-01",
        heure: "10:00",
        prix: 500,
        places: 4,
        note: 4.5,
        is_mock: true
      };
    }
    
    // For real trajets with UUID IDs, fetch from database
    console.log("Fetching real trajet with ID:", trajetId);
    const { data: trajet, error } = await supabase
      .from('trajets')
      .select(`
        id,
        origine,
        destination,
        date_depart,
        prix,
        places_dispo,
        statut,
        created_at,
        chauffeur_id,
        profiles:chauffeur_id(full_name)
      `)
      .eq('id', trajetId)
      .single();
      
    if (error) {
      console.error("Error fetching trajet:", error);
      throw new Error(error.message);
    }
    
    // Use a more robust type check for the profiles object
    let chauffeurName = 'Chauffeur Inconnu';
      
    // Check if profiles exists, is an object, and has full_name property
    if (trajet.profiles && 
        typeof trajet.profiles === 'object' && 
        trajet.profiles !== null && 
        'full_name' in trajet.profiles && 
        trajet.profiles.full_name) {
      chauffeurName = trajet.profiles.full_name;
    }
    
    // Format date and time
    const date = new Date(trajet.date_depart);
    
    // Map the database trajet to our Trajet interface
    return {
      id: trajet.id,
      chauffeur: chauffeurName,
      origine: trajet.origine,
      destination: trajet.destination,
      date: date.toLocaleDateString(),
      heure: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      prix: trajet.prix,
      places: trajet.places_dispo,
      note: 4, // Default rating
      trajet_id: trajet.id
    };
  } catch (error) {
    console.error("Failed to get trajet:", error);
    toast.error("Échec de chargement des détails du trajet");
    
    // Return a default trajet with error indication
    return {
      id: trajetId,
      chauffeur: "Erreur",
      origine: "Impossible de charger le trajet",
      destination: "Veuillez réessayer",
      date: "",
      heure: "",
      prix: 0,
      places: 0,
      note: 0,
    };
  }
};

export const bookTrajet = async (trajetId: string, userId: string, seats: number): Promise<boolean> => {
  try {
    const trajet = await getTrajetById(trajetId);
    
    // Check if trajet exists and has available seats
    if (!trajet || trajet.places < seats) {
      toast.error("Pas assez de places disponibles");
      return false;
    }
    
    // Use the reservations table instead of a non-existent reservations_trajets table
    const { data, error } = await supabase
      .from('reservations')
      .insert({
        trip_id: trajetId,  // Use trip_id for trajet_id
        passenger_id: userId,
        seats_reserved: seats,
        status: 'pending',
        origin: trajet.origine,
        destination: trajet.destination,
        price: trajet.prix,
        reservation_date: new Date().toISOString()
      });
    
    if (error) {
      console.error("Error booking trajet:", error);
      toast.error("Erreur lors de la réservation");
      return false;
    }
    
    toast.success("Réservation effectuée avec succès!");
    return true;
  } catch (error) {
    console.error("Failed to book trajet:", error);
    toast.error("Erreur lors de la réservation");
    return false;
  }
};

// Function to get reservations for a user
export const getUserReservations = async (userId: string): Promise<ReservationTrajet[]> => {
  try {
    // Use the reservations table instead of a non-existent reservations_trajets table
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id,
        trip_id,
        seats_reserved,
        status,
        created_at,
        origin,
        destination,
        price,
        reservation_date
      `)
      .eq('passenger_id', userId);
    
    if (error) {
      console.error("Error fetching user reservations:", error);
      throw new Error(error.message);
    }
    
    // Map to ReservationTrajet interface
    return data.map(reservation => ({
      id: reservation.id,
      trajet_id: reservation.trip_id,
      passager_id: userId,
      places_reservees: reservation.seats_reserved,
      statut: reservation.status,
      created_at: reservation.created_at,
      origine: reservation.origin || '',
      destination: reservation.destination || '',
      prix: reservation.price || 0,
      date_reservation: reservation.reservation_date || reservation.created_at
    }));
  } catch (error) {
    console.error("Failed to get user reservations:", error);
    return [];
  }
};
