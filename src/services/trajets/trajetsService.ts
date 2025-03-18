import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trajet } from "./types";

// Create a trajet
export const createTrajet = async (
  chauffeur_id: string,
  origine: string,
  destination: string,
  date_depart: string,
  prix: number,
  places_dispo: number
) => {
  try {
    const { data, error } = await supabase
      .from('trajets')
      .insert({
        chauffeur_id,
        origine,
        destination,
        date_depart,
        prix,
        places_dispo,
        statut: 'pending'
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating trajet:", error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error: any) {
    console.error("Failed to create trajet:", error);
    toast.error(error.message || "Failed to create trajet");
    return null;
  }
};

// Get all trajets
export const getTrajets = async (): Promise<Trajet[]> => {
  try {
    const { data, error } = await supabase
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
        profiles (full_name)
      `)
      .eq('statut', 'pending')
      .order('date_depart', { ascending: true });
      
    if (error) {
      console.error("Error fetching trajets:", error);
      throw new Error(error.message);
    }
    
    return data as Trajet[];
  } catch (error) {
    console.error("Failed to get trajets:", error);
    return [];
  }
};

// Update a trajet status
export const updateTrajetStatus = async (trajetId: string, statut: 'pending' | 'approved' | 'rejected') => {
  try {
    const { data, error } = await supabase
      .from('trajets')
      .update({ statut })
      .eq('id', trajetId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating trajet status:", error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error: any) {
    console.error("Failed to update trajet status:", error);
    toast.error(error.message || "Failed to update trajet status");
    return null;
  }
};

// Get all trajets offered by the current user
export const getUserTrajets = async () => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("User not authenticated");
      return [];
    }
    
    // Fetch the user's trajets
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
        reservations_trajets:id(
          id,
          passager_id,
          places_reservees,
          statut,
          profiles:passager_id(full_name)
        )
      `)
      .eq('chauffeur_id', user.id)
      .order('date_depart', { ascending: true });
      
    if (error) {
      console.error("Error fetching user trajets:", error);
      return [];
    }
    
    console.log("User proposed trajets:", trajets);
    return trajets;
  } catch (error) {
    console.error("Failed to get user trajets:", error);
    return [];
  }
};

// Cancel a trajet
export const cancelTrajet = async (trajetId: string) => {
  try {
    const { error } = await supabase
      .from('trajets')
      .update({ statut: 'cancelled' })
      .eq('id', trajetId);
      
    if (error) {
      console.error("Error cancelling trajet:", error);
      throw new Error(error.message);
    }
    
    toast.success("Trajet cancelled successfully");
    return true;
  } catch (error) {
    console.error("Failed to cancel trajet:", error);
    toast.error("Failed to cancel trajet");
    return false;
  }
};

// Get trajet by ID
export const getTrajetById = async (trajetId: string): Promise<Trajet | null> => {
  try {
    const { data, error } = await supabase
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
        profiles (full_name)
      `)
      .eq('id', trajetId)
      .single();
      
    if (error) {
      console.error("Error fetching trajet:", error);
      return null;
    }
    
    return data as Trajet;
  } catch (error) {
    console.error("Failed to get trajet:", error);
    return null;
  }
};

// Book a trajet
export const bookTrajet = async (trajetId: string, passagerId: string, places_reservees: number) => {
  try {
    // First fetch current trajet details
    const { data: currentTrajet, error: trajetError } = await supabase
      .from('trajets')
      .select('places_dispo, prix')
      .eq('id', trajetId)
      .single();
      
    if (trajetError) {
      console.error("Error fetching current trajet details:", trajetError);
      throw new Error(trajetError.message);
    }
    
    if (currentTrajet.places_dispo < places_reservees) {
      console.error("Not enough seats available");
      toast.error("Not enough seats available");
      return false;
    }
    
    // Get user display info for storing with reservation
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', passagerId)
      .single();
    
    // Create a reservation entry
    const { data, error } = await (supabase as any)
      .from('reservations_trajets')
      .insert({
        trajet_id: trajetId,
        passager_id: passagerId,
        places_reservees: places_reservees,
        statut: 'confirmed',
        passager_name: userProfile?.full_name,
        prix: currentTrajet.prix * places_reservees
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating reservation:", error);
      throw new Error(error.message);
    }
    
    // Update available seats in the trajet
    const { error: updateError } = await supabase
      .from('trajets')
      .update({ places_dispo: currentTrajet.places_dispo - places_reservees })
      .eq('id', trajetId);
      
    if (updateError) {
      console.error("Error updating available seats:", updateError);
      throw new Error(updateError.message);
    }
    
    toast.success("Trajet booked successfully");
    return true;
  } catch (error) {
    console.error("Failed to book trajet:", error);
    toast.error("Failed to book trajet");
    return false;
  }
};

// Get all reservations for a trajet
export const getTrajetReservations = async (trajetId: string) => {
  try {
    const { data, error } = await supabase
      .from('reservations_trajets')
      .select(`
        id,
        passager_id,
        places_reservees,
        statut,
        created_at,
        passager_name
      `)
      .eq('trajet_id', trajetId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching trajet reservations:", error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error("Failed to get trajet reservations:", error);
    return [];
  }
};
