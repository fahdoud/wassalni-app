
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Get user info for chat display
export const getUserDisplayInfo = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    return {
      id: userId,
      name: data.full_name || "Unknown User"
    };
  } catch (error) {
    console.error("Error fetching user info:", error);
    return {
      id: userId,
      name: "Unknown User"
    };
  }
};

// Get all participants in a ride (driver + passengers)
export const getRideParticipants = async (rideId: string) => {
  try {
    // First get the ride to get the driver
    const { data: ride, error: rideError } = await supabase
      .from('trips')
      .select('driver_id')
      .eq('id', rideId)
      .single();
      
    if (rideError) throw rideError;
    
    // Then get all passengers from reservations
    const { data: reservations, error: resError } = await supabase
      .from('reservations')
      .select('passenger_id')
      .eq('trip_id', rideId)
      .eq('status', 'confirmed');
      
    if (resError) throw resError;
    
    // Combine driver and passengers
    const participantIds = [
      ride.driver_id,
      ...reservations.map(r => r.passenger_id)
    ].filter(Boolean); // Remove any null/undefined
    
    return participantIds;
  } catch (error) {
    console.error("Error fetching ride participants:", error);
    return [];
  }
};

// Send notification to all participants when a new message is added
export const notifyRideParticipants = async (
  rideId: string, 
  senderId: string, 
  messageContent: string
) => {
  try {
    // Get all participants
    const participants = await getRideParticipants(rideId);
    
    // Get sender info
    const { name: senderName } = await getUserDisplayInfo(senderId);
    
    // Create notification message
    const notificationMessage = `New message in ride chat from ${senderName}: ${messageContent.substring(0, 30)}${messageContent.length > 30 ? '...' : ''}`;
    
    // Send notification to all participants except sender
    for (const participantId of participants) {
      if (participantId !== senderId) {
        // Get participant phone
        const { data: profile } = await supabase
          .from('profiles')
          .select('phone')
          .eq('id', participantId)
          .single();
          
        if (profile?.phone) {
          // Send SMS notification - Optional, can be enabled if needed
          // await supabase.functions.invoke('send-sms-verification', {
          //   body: { 
          //     userId: participantId, 
          //     phone: profile.phone, 
          //     message: notificationMessage,
          //     type: "notification"
          //   }
          // });
          
          // Insert in-app notification
          await supabase
            .from('notifications')
            .insert({
              user_id: participantId,
              message: notificationMessage,
              type: 'chat'
            });
        }
      }
    }
  } catch (error) {
    console.error("Error notifying participants:", error);
  }
};
