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
          verification_status?: string | null
        }
        Relationships: []
      }
      email_verification: {
        Row: {
          created_at: string | null
          email: string
          id: string
          token_expires_at: string | null
          updated_at: string | null
          verification_token: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          token_expires_at?: string | null
          updated_at?: string | null
          verification_token?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          token_expires_at?: string | null
          updated_at?: string | null
          verification_token?: string | null
          verified?: boolean | null
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
      phone_verification: {
        Row: {
          code_expires_at: string | null
          created_at: string | null
          id: string
          phone: string
          updated_at: string | null
          verification_code: string | null
          verified: boolean | null
        }
        Insert: {
          code_expires_at?: string | null
          created_at?: string | null
          id: string
          phone: string
          updated_at?: string | null
          verification_code?: string | null
          verified?: boolean | null
        }
        Update: {
          code_expires_at?: string | null
          created_at?: string | null
          id?: string
          phone?: string
          updated_at?: string | null
          verification_code?: string | null
          verified?: boolean | null
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
          id: string
          passenger_id: string | null
          seats_reserved: number
          status: string | null
          trip_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          passenger_id?: string | null
          seats_reserved: number
          status?: string | null
          trip_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          passenger_id?: string | null
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
      reservations_trajets: {
        Row: {
          created_at: string | null
          id: string
          passager_id: string
          places_reservees: number
          statut: string | null
          trajet_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          passager_id: string
          places_reservees?: number
          statut?: string | null
          trajet_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          passager_id?: string
          places_reservees?: number
          statut?: string | null
          trajet_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_trajets_trajet_id_fkey"
            columns: ["trajet_id"]
            isOneToOne: false
            referencedRelation: "trajets"
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrease_available_seats: {
        Args: {
          trip_id: string
          seats_count: number
        }
        Returns: undefined
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
