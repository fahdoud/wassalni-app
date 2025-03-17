
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Get all trips offered by the current user
export const getUserProposedTrips = async () => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("User not authenticated");
      return [];
    }
    
    // Fetch the user's trips
    const { data: trips, error } = await supabase
      .from('trips')
      .select(`
        id,
        origin,
        destination,
        departure_time,
        price,
        available_seats,
        status,
        created_at,
        reservations:id(
          id,
          passenger_id,
          seats_reserved,
          status,
          profiles:passenger_id(full_name)
        )
      `)
      .eq('driver_id', user.id)
      .order('departure_time', { ascending: true });
      
    if (error) {
      console.error("Error fetching user trips:", error);
      return [];
    }
    
    console.log("User proposed trips:", trips);
    return trips;
  } catch (error) {
    console.error("Failed to get user trips:", error);
    return [];
  }
};

// Cancel a trip
export const cancelTrip = async (tripId: string) => {
  try {
    const { error } = await supabase
      .from('trips')
      .update({ status: 'cancelled' })
      .eq('id', tripId);
      
    if (error) {
      console.error("Error cancelling trip:", error);
      throw new Error(error.message);
    }
    
    toast.success("Trip cancelled successfully");
    return true;
  } catch (error) {
    console.error("Failed to cancel trip:", error);
    toast.error("Failed to cancel trip");
    return false;
  }
};
