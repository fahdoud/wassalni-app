
import { supabase } from "@/integrations/supabase/client";
import { Trajet } from './types';
import { toast } from "sonner";

// Get all active trajets
export const getTrajets = async (): Promise<Trajet[]> => {
  try {
    console.log("Fetching trajets...");
    
    const { data: trajets, error } = await supabase
      .from('trajets')
      .select(`
        id,
        origine,
        destination,
        date_depart,
        prix,
        places_dispo,
        chauffeur_id,
        profiles(full_name)
      `)
      .eq('statut', 'actif');
    
    if (error) {
      console.error("Error fetching trajets:", error);
      throw new Error(error.message);
    }

    if (trajets && trajets.length > 0) {
      console.log("Trajets fetched successfully:", trajets);
      
      const formattedTrajets: Trajet[] = trajets.map(trajet => {
        // Safe access to profile data with null checks
        const chauffeurName = trajet.profiles && 
          typeof trajet.profiles === 'object' && 
          trajet.profiles !== null ? 
          (trajet.profiles.full_name || "Chauffeur Inconnu") : 
          "Chauffeur Inconnu";

        return {
          id: trajet.id,
          chauffeur: chauffeurName,
          origine: trajet.origine,
          destination: trajet.destination,
          date: new Date(trajet.date_depart).toISOString().split('T')[0],
          heure: new Date(trajet.date_depart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          prix: trajet.prix,
          places_dispo: trajet.places_dispo,
          note: 4.7, // Default rating
          chauffeur_id: trajet.chauffeur_id
        };
      });

      console.log("Formatted trajets:", formattedTrajets);
      return formattedTrajets;
    }
    
    // Return empty array if no trajets
    return [];
  } catch (error) {
    console.error("Failed to get trajets:", error);
    return [];
  }
};

// Get a specific trajet by ID
export const getTrajetById = async (trajetId: string): Promise<Trajet | null> => {
  try {
    console.log("Fetching trajet with ID:", trajetId);
    
    const { data: trajet, error } = await supabase
      .from('trajets')
      .select(`
        id,
        origine,
        destination,
        date_depart,
        prix,
        places_dispo,
        chauffeur_id,
        profiles(full_name)
      `)
      .eq('id', trajetId)
      .single();
    
    if (error) {
      console.error("Error fetching trajet:", error);
      return null;
    }

    console.log("Trajet data fetched:", trajet);

    // Safe access to profile data with null checks
    const chauffeurName = trajet.profiles && 
      typeof trajet.profiles === 'object' && 
      trajet.profiles !== null ? 
      (trajet.profiles.full_name || "Chauffeur Inconnu") : 
      "Chauffeur Inconnu";

    const formattedTrajet: Trajet = {
      id: trajet.id,
      chauffeur: chauffeurName,
      origine: trajet.origine,
      destination: trajet.destination,
      date: new Date(trajet.date_depart).toISOString().split('T')[0],
      heure: new Date(trajet.date_depart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      prix: trajet.prix,
      places_dispo: trajet.places_dispo,
      note: 4.7, // Default rating
      chauffeur_id: trajet.chauffeur_id
    };

    console.log("Formatted trajet:", formattedTrajet);
    return formattedTrajet;
  } catch (error) {
    console.error("Failed to get trajet:", error);
    return null;
  }
};

// S'abonner aux changements pour un trajet spécifique
export const subscribeToTrajetUpdates = (trajetId: string, callback: (trajet: Trajet) => void) => {
  if (/^\d+$/.test(trajetId)) {
    // Les trajets simulés ne prennent pas en charge les mises à jour en temps réel
    console.log("Les trajets simulés ne prennent pas en charge les mises à jour en temps réel");
    return { unsubscribe: () => {} };
  }

  console.log("Configuration d'un abonnement en temps réel pour le trajet:", trajetId);
  
  const channel = supabase
    .channel(`trajet-${trajetId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'trajets',
        filter: `id=eq.${trajetId}`
      },
      async (payload) => {
        console.log("Mise à jour en temps réel reçue pour le trajet:", payload);
        
        // Récupérer les données mises à jour du trajet
        const trajetMisAJour = await getTrajetById(trajetId);
        if (trajetMisAJour) {
          callback(trajetMisAJour);
        }
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      console.log("Désabonnement des mises à jour du trajet");
      supabase.removeChannel(channel);
    }
  };
};

// Créer une réservation
export const createTrajetReservation = async (
  trajetId: string, 
  userId: string, 
  placesReservees: number
) => {
  try {
    // Fetch the trajet details
    const { data: trajet, error: trajetError } = await supabase
      .from('trajets')
      .select('origine, destination, prix, places_dispo')
      .eq('id', trajetId)
      .single();
      
    if (trajetError) {
      console.error("Error fetching trajet for reservation:", trajetError);
      throw new Error(trajetError.message);
    }

    // Get passenger name
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();
      
    if (userError) {
      console.error("Error fetching user profile:", userError);
      throw new Error(userError.message);
    }

    // Create the reservation in the reservations table
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .insert({
        trip_id: trajetId,
        passenger_id: userId,
        seats_reserved: placesReservees,
        passenger_name: userProfile?.full_name || "Unknown User",
        price: trajet?.prix * placesReservees,
        origin: trajet?.origine,
        destination: trajet?.destination,
        status: 'pending',
        reservation_date: new Date().toISOString()
      })
      .select()
      .single();
      
    if (reservationError) {
      console.error("Error creating reservation:", reservationError);
      throw new Error(reservationError.message);
    }

    // Update available seats count in the trajet using RPC
    const { error: updateError } = await supabase
      .rpc('decrease_available_seats', {
        trip_id: trajetId,
        seats_count: placesReservees
      });
      
    if (updateError) {
      console.error("Error updating available seats:", updateError);
      // Don't throw here, at least the reservation was created
      toast.warning("Reservation created but seat count may not be accurate");
    }

    return {
      success: true,
      reservation,
      updatedSeats: trajet ? trajet.places_dispo - placesReservees : 0 // Calculate updated seats correctly
    };
  } catch (error: any) {
    console.error("Failed to create trajet reservation:", error);
    toast.error(error.message || "Failed to create reservation");
    return { success: false };
  }
};

// Get user's trajet reservations using the reservations table
export const getUserTrajetReservations = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id,
        trip_id,
        passenger_name,
        seats_reserved,
        price,
        status,
        origin,
        destination,
        reservation_date,
        created_at
      `)
      .eq('passenger_id', userId);
      
    if (error) {
      console.error("Error fetching user reservations:", error);
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error) {
    console.error("Failed to get user reservations:", error);
    return [];
  }
};
