
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const createProposedTrip = async (
  driverId: string, origin: string, destination: string,
  departureTime: string, price: number, availableSeats: number, description?: string
) => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .insert({
        driver_id: driverId,
        lieu_depart: origin,
        lieu_arrivee: destination,
        date_heure: departureTime,
        prix: price,
        places_disponibles: availableSeats,
        statut: 'active'
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  } catch (error: any) {
    toast.error(error.message || "Failed to create trip");
    return null;
  }
};

export const getProposedTrips = async () => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('id, lieu_depart, lieu_arrivee, date_heure, prix, places_disponibles, statut, created_at, driver_id')
      .eq('statut', 'active')
      .order('date_heure', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  } catch {
    return [];
  }
};

export const updateProposedTripStatus = async (tripId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .update({ statut: status })
      .eq('id', tripId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  } catch (error: any) {
    toast.error(error.message || "Failed to update trip status");
    return null;
  }
};
