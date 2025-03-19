
import { supabase } from "@/integrations/supabase/client";
import { sendSMSNotification } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Notification types
export type NotificationType = 'reservation_confirmed' | 'reservation_cancelled' | 'trip_updated' | 'payment_received' | 'custom';

// Function to send a trip notification
export const sendTripNotification = async (
  userId: string, 
  phone: string, 
  tripId: string, 
  type: NotificationType
) => {
  try {
    let message = '';
    
    switch (type) {
      case 'reservation_confirmed':
        message = `Your reservation for trip ID ${tripId} has been confirmed. Thank you for using Wassalni!`;
        break;
      case 'reservation_cancelled':
        message = `Your reservation for trip ID ${tripId} has been cancelled. If you didn't request this, please contact support.`;
        break;
      case 'trip_updated':
        message = `There's been an update to your trip (ID: ${tripId}). Please check the app for details.`;
        break;
      case 'payment_received':
        message = `Payment received for trip ID ${tripId}. Thank you for using Wassalni!`;
        break;
      default:
        throw new Error("Invalid notification type");
    }
    
    const result = await sendSMSNotification(userId, phone, message);
    return result;
  } catch (error) {
    console.error("Error sending trip notification:", error);
    toast.error("Failed to send notification");
    throw error;
  }
};

// Function to send a custom notification
export const sendCustomNotification = async (
  userId: string,
  phone: string,
  message: string
) => {
  try {
    const result = await sendSMSNotification(userId, phone, message);
    return result;
  } catch (error) {
    console.error("Error sending custom notification:", error);
    toast.error("Failed to send custom notification");
    throw error;
  }
};

// Function to get user's phone from their ID
export const getUserPhoneById = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('phone')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error("Error fetching user phone:", error);
      return null;
    }
    
    return data?.phone || null;
  } catch (error) {
    console.error("Error in getUserPhoneById:", error);
    return null;
  }
};

// Notify user about a reservation
export const notifyReservation = async (
  userId: string,
  tripId: string,
  type: 'confirmed' | 'cancelled'
) => {
  try {
    const phone = await getUserPhoneById(userId);
    
    if (!phone) {
      console.error("No phone number found for user:", userId);
      return false;
    }
    
    await sendTripNotification(
      userId, 
      phone, 
      tripId, 
      type === 'confirmed' ? 'reservation_confirmed' : 'reservation_cancelled'
    );
    
    return true;
  } catch (error) {
    console.error("Failed to notify about reservation:", error);
    return false;
  }
};
