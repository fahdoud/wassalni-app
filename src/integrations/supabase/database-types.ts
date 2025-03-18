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
          driver_id: string;
          origin: string;
          destination: string;
          departure_time: string;
          price: number;
          available_seats: number;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
          description: string | null;
        };
        Insert: {
          id?: string;
          driver_id: string;
          origin: string;
          destination: string;
          departure_time: string;
          price: number;
          available_seats: number;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          description?: string | null;
        };
        Update: {
          id?: string;
          driver_id?: string;
          origin?: string;
          destination?: string;
          departure_time?: string;
          price?: number;
          available_seats?: number;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          description?: string | null;
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
          passenger_name: string | null;
          origin: string | null;
          destination: string | null;
          price: number | null;
          reservation_date: string | null;
        };
        Insert: {
          id?: string;
          trip_id?: string | null;
          passenger_id?: string | null;
          seats_reserved: number;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          passenger_name?: string | null;
          origin?: string | null;
          destination?: string | null;
          price?: number | null;
          reservation_date?: string | null;
        };
        Update: {
          id?: string;
          trip_id?: string | null;
          passenger_id?: string | null;
          seats_reserved?: number;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          passenger_name?: string | null;
          origin?: string | null;
          destination?: string | null;
          price?: number | null;
          reservation_date?: string | null;
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
          feedback_type: string | null;
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
          feedback_type?: string | null;
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
          feedback_type?: string | null;
        };
      };
      seat_availability: {
        Row: {
          id: string;
          trip_id: string | null;
          total_seats: number;
          remaining_seats: number;
          seats_available: boolean;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          trip_id?: string | null;
          total_seats?: number;
          remaining_seats?: number;
          seats_available?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          trip_id?: string | null;
          total_seats?: number;
          remaining_seats?: number;
          seats_available?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      ride_messages: {
        Row: {
          id: string;
          ride_id: string;
          sender_id: string;
          sender_name: string;
          content: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          ride_id: string;
          sender_id: string;
          sender_name: string;
          content: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          ride_id?: string;
          sender_id?: string;
          sender_name?: string;
          content?: string;
          created_at?: string | null;
        };
      };
      trajets: {
        Row: {
          id: string;
          chauffeur_id: string;
          origine: string;
          destination: string;
          date_depart: string;
          prix: number;
          places_dispo: number;
          statut: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          chauffeur_id: string;
          origine: string;
          destination: string;
          date_depart: string;
          prix: number;
          places_dispo?: number;
          statut?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          chauffeur_id?: string;
          origine?: string;
          destination?: string;
          date_depart?: string;
          prix?: number;
          places_dispo?: number;
          statut?: string | null;
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
      decrease_seat_availability: {
        Args: {
          p_trip_id: string;
          p_seats_count: number;
        };
        Returns: boolean;
      };
      check_email_verified: {
        Args: {
          user_id: string;
        };
        Returns: boolean;
      };
      check_phone_verified: {
        Args: {
          user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {};
    CompositeTypes: {};
  };
};
