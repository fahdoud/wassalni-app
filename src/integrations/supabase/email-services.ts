
import { supabase } from './base-client';

/**
 * Send email verification to a user
 */
export const sendEmailVerification = async (userId: string, email: string) => {
  try {
    console.log(`Calling send-email-verification function for user ${userId} with email ${email}`);
    const { data, error } = await supabase.functions.invoke('send-email-verification', {
      body: { 
        userId, 
        email, 
        redirectUrl: window.location.origin + '/verify-email',
        type: "verification"
      }
    });
    
    if (error) {
      console.error("Error in sendEmailVerification:", error);
      throw error;
    }
    
    console.log("Email verification function response:", data);
    return data;
  } catch (error) {
    console.error("Error sending email verification:", error);
    throw error;
  }
};

/**
 * Send welcome email to a new user
 */
export const sendWelcomeEmail = async (userId: string, email: string, fullName: string) => {
  try {
    console.log(`Calling send-email-verification function for welcome email to ${email}`);
    const { data, error } = await supabase.functions.invoke('send-email-verification', {
      body: { 
        userId, 
        email,
        fullName,
        type: "welcome"
      }
    });
    
    if (error) {
      console.error("Error in sendWelcomeEmail:", error);
      throw error;
    }
    
    console.log("Welcome email function response:", data);
    return data;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
};

/**
 * Check if a user's email is verified
 */
export const checkEmailVerified = async (userId: string) => {
  try {
    // Update to use RPC instead of direct query
    const { data, error } = await supabase.rpc('check_email_verified', { 
      user_id: userId 
    });
      
    if (error) {
      console.error("Error checking email verification status:", error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error("Error checking email verification status:", error);
    return false;
  }
};
