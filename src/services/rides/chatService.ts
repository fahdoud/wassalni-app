
import { supabase } from "@/integrations/supabase/client";

export const getUserDisplayInfo = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return { id: userId, name: data.full_name || "Unknown User" };
  } catch {
    return { id: userId, name: "Unknown User" };
  }
};

export const getRideParticipants = async (rideId: string) => {
  try {
    const { data: ride, error: rideError } = await supabase
      .from('trips')
      .select('driver_id')
      .eq('id', rideId)
      .single();
    if (rideError) throw rideError;
    
    const { data: reservations, error: resError } = await supabase
      .from('reservations')
      .select('user_id')
      .eq('trip_id', rideId)
      .eq('statut', 'confirmed');
    if (resError) throw resError;
    
    return [ride.driver_id, ...(reservations || []).map(r => r.user_id)].filter(Boolean) as string[];
  } catch {
    return [];
  }
};

export const notifyRideParticipants = async (rideId: string, senderId: string, messageContent: string) => {
  try {
    const participants = await getRideParticipants(rideId);
    const { name: senderName } = await getUserDisplayInfo(senderId);
    const msg = `New message from ${senderName}: ${messageContent.substring(0, 30)}${messageContent.length > 30 ? '...' : ''}`;
    
    for (const participantId of participants) {
      if (participantId !== senderId) {
        await supabase.from('notifications').insert({
          user_id: participantId,
          message: msg,
          type: 'chat',
          titre: 'New Chat Message'
        });
      }
    }
  } catch (error) {
    console.error("Error notifying participants:", error);
  }
};
