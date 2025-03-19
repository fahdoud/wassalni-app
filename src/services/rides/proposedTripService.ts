
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Create a proposed trip - using the trips table instead of proposed_trips
export const createProposedTrip = async (
  driverId: string,
  origin: string,
  destination: string,
  departureTime: string,
  price: number,
  availableSeats: number,
  description?: string
) => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .insert({
        driver_id: driverId,
        origin,
        destination,
        departure_time: departureTime,
        price,
        available_seats: availableSeats,
        description,
        status: 'pending'
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating proposed trip:", error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error: any) {
    console.error("Failed to create proposed trip:", error);
    toast.error(error.message || "Failed to create proposed trip");
    return null;
  }
};

// Get all proposed trips - using the trips table
export const getProposedTrips = async () => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        id,
        origin,
        destination,
        departure_time,
        price,
        available_seats,
        status,
        description,
        created_at,
        driver_id,
        profiles (full_name)
      `)
      .eq('status', 'pending')
      .order('departure_time', { ascending: true });
      
    if (error) {
      console.error("Error fetching proposed trips:", error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error("Failed to get proposed trips:", error);
    return [];
  }
};

// Update a proposed trip status - using the trips table
export const updateProposedTripStatus = async (tripId: string, status: 'pending' | 'approved' | 'rejected') => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .update({ status })
      .eq('id', tripId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating proposed trip status:", error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error: any) {
    console.error("Failed to update proposed trip status:", error);
    toast.error(error.message || "Failed to update trip status");
    return null;
  }
};
