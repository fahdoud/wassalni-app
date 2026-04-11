
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type NotificationType = 'reservation_confirmed' | 'reservation_cancelled' | 'trip_updated' | 'payment_received' | 'custom';

export const sendTripNotification = async (userId: string, tripId: string, type: NotificationType) => {
  try {
    let message = '';
    switch (type) {
      case 'reservation_confirmed': message = `Your reservation for trip has been confirmed.`; break;
      case 'reservation_cancelled': message = `Your reservation has been cancelled.`; break;
      case 'trip_updated': message = `There's been an update to your trip.`; break;
      case 'payment_received': message = `Payment received. Thank you!`; break;
      default: throw new Error("Invalid notification type");
    }
    
    await supabase.from('notifications').insert({
      user_id: userId,
      message,
      type,
      titre: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    toast.error("Failed to send notification");
  }
};

export const sendCustomNotification = async (userId: string, phone: string, message: string) => {
  try {
    await supabase.from('notifications').insert({
      user_id: userId,
      message,
      type: 'custom',
      titre: 'Notification'
    });
  } catch (error) {
    console.error("Error sending custom notification:", error);
  }
};

export const getUserPhoneById = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.from('profiles').select('phone').eq('id', userId).single();
    if (error) return null;
    return data?.phone || null;
  } catch { return null; }
};

export const notifyReservation = async (userId: string, tripId: string, type: 'confirmed' | 'cancelled') => {
  try {
    await sendTripNotification(userId, tripId, type === 'confirmed' ? 'reservation_confirmed' : 'reservation_cancelled');
    return true;
  } catch { return false; }
};
