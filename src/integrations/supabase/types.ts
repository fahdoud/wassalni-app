export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      drivers: {
        Row: {
          avatar_url: string | null
          car_model: string | null
          car_year: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          license_number: string | null
          phone: string | null
          registration_number: string | null
          updated_at: string
          user_id: string
          vehicle_photo_url: string | null
          verification_status: string | null
        }
        Insert: {
          avatar_url?: string | null
          car_model?: string | null
          car_year?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          license_number?: string | null
          phone?: string | null
          registration_number?: string | null
          updated_at?: string
          user_id: string
          vehicle_photo_url?: string | null
          verification_status?: string | null
        }
        Update: {
          avatar_url?: string | null
          car_model?: string | null
          car_year?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          license_number?: string | null
          phone?: string | null
          registration_number?: string | null
          updated_at?: string
          user_id?: string
          vehicle_photo_url?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          comment: string | null
          created_at: string | null
          feedback_type: string | null
          from_user_id: string | null
          id: string
          rating: number
          to_user_id: string | null
          trip_id: string | null
          updated_at: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          feedback_type?: string | null
          from_user_id?: string | null
          id?: string
          rating: number
          to_user_id?: string | null
          trip_id?: string | null
          updated_at?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          feedback_type?: string | null
          from_user_id?: string | null
          id?: string
          rating?: number
          to_user_id?: string | null
          trip_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          phone: string
          read_at: string | null
          sent_at: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          phone: string
          read_at?: string | null
          sent_at?: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          phone?: string
          read_at?: string | null
          sent_at?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      passengers: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string | null
          departure_point: string | null
          destination: string | null
          destination_point: string | null
          id: string
          origin: string | null
          passenger_email: string | null
          passenger_first_name: string | null
          passenger_id: string | null
          passenger_last_name: string | null
          passenger_name: string | null
          price: number | null
          reservation_date: string | null
          seats_reserved: number
          status: string | null
          trip_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          departure_point?: string | null
          destination?: string | null
          destination_point?: string | null
          id?: string
          origin?: string | null
          passenger_email?: string | null
          passenger_first_name?: string | null
          passenger_id?: string | null
          passenger_last_name?: string | null
          passenger_name?: string | null
          price?: number | null
          reservation_date?: string | null
          seats_reserved: number
          status?: string | null
          trip_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          departure_point?: string | null
          destination?: string | null
          destination_point?: string | null
          id?: string
          origin?: string | null
          passenger_email?: string | null
          passenger_first_name?: string | null
          passenger_id?: string | null
          passenger_last_name?: string | null
          passenger_name?: string | null
          price?: number | null
          reservation_date?: string | null
          seats_reserved?: number
          status?: string | null
          trip_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_passenger_id_fkey"
            columns: ["passenger_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          ride_id: string
          sender_id: string
          sender_name: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          ride_id: string
          sender_id: string
          sender_name: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          ride_id?: string
          sender_id?: string
          sender_name?: string
        }
        Relationships: []
      }
      seat_availability: {
        Row: {
          created_at: string | null
          id: string
          remaining_seats: number
          seats_available: boolean
          total_seats: number
          trip_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          remaining_seats?: number
          seats_available?: boolean
          total_seats?: number
          trip_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          remaining_seats?: number
          seats_available?: boolean
          total_seats?: number
          trip_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seat_availability_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: true
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trajets: {
        Row: {
          chauffeur_id: string
          created_at: string | null
          date_depart: string
          destination: string
          id: string
          origine: string
          places_dispo: number
          prix: number
          statut: string | null
          updated_at: string | null
        }
        Insert: {
          chauffeur_id: string
          created_at?: string | null
          date_depart: string
          destination: string
          id?: string
          origine: string
          places_dispo?: number
          prix: number
          statut?: string | null
          updated_at?: string | null
        }
        Update: {
          chauffeur_id?: string
          created_at?: string | null
          date_depart?: string
          destination?: string
          id?: string
          origine?: string
          places_dispo?: number
          prix?: number
          statut?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trips: {
        Row: {
          available_seats: number
          created_at: string | null
          departure_time: string
          description: string | null
          destination: string
          driver_id: string
          id: string
          origin: string
          price: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          available_seats: number
          created_at?: string | null
          departure_time: string
          description?: string | null
          destination: string
          driver_id: string
          id?: string
          origin: string
          price: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          available_seats?: number
          created_at?: string | null
          departure_time?: string
          description?: string | null
          destination?: string
          driver_id?: string
          id?: string
          origin?: string
          price?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vehicle_photos: {
        Row: {
          created_at: string | null
          driver_id: string
          id: string
          photo_url: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          driver_id: string
          id?: string
          photo_url: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string
          id?: string
          photo_url?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrease_available_seats: {
        Args: { trip_id: string; seats_count: number }
        Returns: undefined
      }
      decrease_seat_availability: {
        Args: { p_trip_id: string; p_seats_count: number }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
