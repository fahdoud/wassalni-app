
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const getUserProposedTrips = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data: trips, error } = await supabase
      .from('trips')
      .select('id, lieu_depart, lieu_arrivee, date_heure, prix, places_disponibles, statut, created_at')
      .eq('driver_id', user.id)
      .order('date_heure', { ascending: true });
    if (error) return [];
    
    // Transform to expected format
    return (trips || []).map(t => ({
      id: t.id,
      origin: t.lieu_depart,
      destination: t.lieu_arrivee,
      departure_time: t.date_heure,
      price: t.prix,
      available_seats: t.places_disponibles,
      status: t.statut,
      created_at: t.created_at,
      reservations: []
    }));
  } catch {
    return [];
  }
};

export const cancelTrip = async (tripId: string) => {
  try {
    const { error } = await supabase
      .from('trips')
      .update({ statut: 'cancelled' })
      .eq('id', tripId);
    if (error) throw error;
    toast.success("Trip cancelled successfully");
    return true;
  } catch {
    toast.error("Failed to cancel trip");
    return false;
  }
};
