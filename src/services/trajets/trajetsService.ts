import { supabase } from "@/integrations/supabase/client";
import { Trajet, ReservationTrajet, StatutReservation } from "./types";
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
        profiles(full_name)
      `)
      .eq('statut', 'actif')
      .order('date_depart', { ascending: true });
      
    if (error) {
      console.error("Error fetching trajets:", error);
      throw new Error(error.message);
    }
    
    // Map to Trajet interface
    return trajets.map(trajet => {
      // Use optional chaining for safer access
      let chauffeurName = 'Chauffeur Inconnu';
      
      // Access profiles data safely with optional chaining and nullish coalescing
      if (trajet.profiles && typeof trajet.profiles === 'object' && 'full_name' in trajet.profiles) {
        const profileName = trajet.profiles.full_name;
        if (profileName) {
          chauffeurName = profileName as string;
        }
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
        places_dispo: trajet.places_dispo,
        note: 4, // Default rating
        chauffeur_id: trajet.chauffeur_id
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
        places_dispo: 4,
        note: 4.5,
        est_mock: true
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
        profiles(full_name)
      `)
      .eq('id', trajetId)
      .single();
      
    if (error) {
      console.error("Error fetching trajet:", error);
      throw new Error(error.message);
    }
    
    // Use optional chaining for safer access
    let chauffeurName = 'Chauffeur Inconnu';
      
    // Access profiles data safely with optional chaining and nullish coalescing
    if (trajet.profiles && typeof trajet.profiles === 'object' && 'full_name' in trajet.profiles) {
      const profileName = trajet.profiles.full_name;
      if (profileName) {
        chauffeurName = profileName as string;
      }
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
      places_dispo: trajet.places_dispo,
      note: 4, // Default rating
      chauffeur_id: trajet.chauffeur_id
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
      places_dispo: 0,
      note: 0,
    };
  }
};

export const bookTrajet = async (trajetId: string, userId: string, seats: number): Promise<boolean> => {
  try {
    // Get the trajet to book and user information
    const trajet = await getTrajetById(trajetId);
    
    // Get user details (full name, email, phone)
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        full_name,
        phone
      `)
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      toast.error("Erreur lors de la récupération du profil utilisateur");
      return false;
    }
    
    // Get email from auth user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error("Error getting auth user:", authError);
      toast.error("Erreur d'authentification");
      return false;
    }
    
    const userEmail = authData.user?.email || '';
    const fullName = userProfile?.full_name || userEmail;
    const phone = userProfile?.phone || '';
    
    // Check if trajet exists and has available seats
    if (!trajet || trajet.places_dispo < seats) {
      toast.error("Pas assez de places disponibles");
      return false;
    }
    
    // First update the trajets table to reduce available seats
    if (!/^\d+$/.test(trajetId)) {
      // Only update real trajets, not mock ones
      const { error: updateError } = await supabase
        .from('trajets')
        .update({ places_dispo: trajet.places_dispo - seats })
        .eq('id', trajetId);
        
      if (updateError) {
        console.error("Error updating trajet places_dispo:", updateError);
        toast.error("Erreur lors de la mise à jour des places disponibles");
        return false;
      }
    }
    
    // Then create a reservation record
    const { data, error } = await supabase
      .from('reservations')
      .insert({
        trip_id: trajetId,
        passenger_id: userId,
        seats_reserved: seats,
        status: 'confirmée' as StatutReservation,
        passenger_name: fullName,
        origin: trajet.origine,
        destination: trajet.destination,
        price: trajet.prix * seats,
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
    // Use the reservations table
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id,
        trip_id,
        passenger_id,
        seats_reserved,
        status,
        created_at,
        updated_at,
        passenger_name,
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
      passager_id: reservation.passenger_id,
      places_reservees: reservation.seats_reserved,
      statut: reservation.status as StatutReservation,
      created_at: reservation.created_at || '',
      updated_at: reservation.updated_at,
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
