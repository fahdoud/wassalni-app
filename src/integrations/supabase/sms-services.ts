
import { supabase } from './base-client';

/**
 * Send SMS verification code to a user
 */
export const sendSMSVerification = async (userId: string, phone: string) => {
  try {
    console.log(`Calling send-sms-verification function for user ${userId} with phone ${phone}`);
    const { data, error } = await supabase.functions.invoke('send-sms-verification', {
      body: { userId, phone, type: "verification" }
    });
    
    if (error) {
      console.error("Error in sendSMSVerification:", error);
      throw error;
    }
    
    console.log("SMS verification function response:", data);
    return data;
  } catch (error) {
    console.error("Error sending SMS verification:", error);
    throw error;
  }
};

/**
 * Send SMS notification to a user
 */
export const sendSMSNotification = async (userId: string, phone: string, message: string) => {
  try {
    console.log(`Calling send-sms-verification function for notification to ${phone}`);
    const { data, error } = await supabase.functions.invoke('send-sms-verification', {
      body: { userId, phone, message, type: "notification" }
    });
    
    if (error) {
      console.error("Error in sendSMSNotification:", error);
      throw error;
    }
    
    console.log("SMS notification function response:", data);
    return data;
  } catch (error) {
    console.error("Error sending SMS notification:", error);
    throw error;
  }
};

/**
 * Check if a user's phone is verified
 */
export const checkPhoneVerified = async (userId: string) => {
  try {
    // Using direct table query instead of RPC
    const { data } = await supabase
      .from('phone_verification')
      .select('verified')
      .eq('id', userId)
      .single();
      
    // Return the verification status if available, otherwise default to true for development
    console.log("Phone verification check for:", userId);
    return data?.verified ?? true;
  } catch (error) {
    console.error("Error checking phone verification status:", error);
    return false;
  }
};
