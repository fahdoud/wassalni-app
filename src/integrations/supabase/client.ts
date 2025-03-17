
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://rayrfitltjfymcngveiq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJheXJmaXRsdGpmeW1jbmd2ZWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMTk4NDMsImV4cCI6MjA1Nzc5NTg0M30.GUzaIk0WUy0N6JZjfA-fMJiYsmhENpc-N87babqf8_w";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Define the Database type manually here to avoid modifying the types.ts file
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: string | null;
          created_at: string | null;
          updated_at: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          avatar_url?: string | null;
        };
      };
      email_verification: {
        Row: {
          id: string;
          email: string;
          verified: boolean;
          verification_token: string | null;
          token_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          verified?: boolean;
          verification_token?: string | null;
          token_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          verified?: boolean;
          verification_token?: string | null;
          token_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      phone_verification: {
        Row: {
          id: string;
          phone: string;
          verified: boolean;
          verification_code: string | null;
          code_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          phone: string;
          verified?: boolean;
          verification_code?: string | null;
          code_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          verified?: boolean;
          verification_code?: string | null;
          code_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      trips: {
        Row: {
          id: string;
          driver_id: string | null;
          origin: string;
          destination: string;
          departure_time: string;
          price: number;
          available_seats: number;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          driver_id?: string | null;
          origin: string;
          destination: string;
          departure_time: string;
          price: number;
          available_seats: number;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          driver_id?: string | null;
          origin?: string;
          destination?: string;
          departure_time?: string;
          price?: number;
          available_seats?: number;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      reservations: {
        Row: {
          id: string;
          trip_id: string | null;
          passenger_id: string | null;
          seats_reserved: number;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          trip_id?: string | null;
          passenger_id?: string | null;
          seats_reserved: number;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          trip_id?: string | null;
          passenger_id?: string | null;
          seats_reserved?: number;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      feedback: {
        Row: {
          id: string;
          from_user_id: string | null;
          to_user_id: string | null;
          trip_id: string | null;
          rating: number;
          comment: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          from_user_id?: string | null;
          to_user_id?: string | null;
          trip_id?: string | null;
          rating: number;
          comment?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          from_user_id?: string | null;
          to_user_id?: string | null;
          trip_id?: string | null;
          rating?: number;
          comment?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
    Views: {};
    Functions: {
      decrease_available_seats: {
        Args: {
          trip_id: string;
          seats_count: number;
        };
        Returns: void;
      };
    };
    Enums: {};
    CompositeTypes: {};
  };
};

// Create a custom Supabase client with additional functionality
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Function to send email verification
export const sendEmailVerification = async (userId: string, email: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email-verification', {
      body: { userId, email, redirectUrl: window.location.origin + '/verify-email' }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error sending email verification:", error);
    throw error;
  }
};

// Function to send SMS verification
export const sendSMSVerification = async (userId: string, phone: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-sms-verification', {
      body: { userId, phone }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error sending SMS verification:", error);
    throw error;
  }
};

// Function to check if email is verified
export const checkEmailVerified = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('email_verification')
      .select('verified')
      .eq('id', userId)
      .single();
      
    if (error) {
      throw error;
    }
    
    return data?.verified || false;
  } catch (error) {
    console.error("Error checking email verification status:", error);
    return false;
  }
};

// Function to check if phone is verified
export const checkPhoneVerified = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('phone_verification')
      .select('verified')
      .eq('id', userId)
      .single();
      
    if (error) {
      throw error;
    }
    
    return data?.verified || false;
  } catch (error) {
    console.error("Error checking phone verification status:", error);
    return false;
  }
};
