export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      drivers: {
        Row: {
          created_at: string | null
          date_expiration_permis: string | null
          id: string
          note_moyenne: number | null
          numero_permis: string | null
          user_id: string | null
          verifie: boolean | null
        }
        Insert: {
          created_at?: string | null
          date_expiration_permis?: string | null
          id?: string
          note_moyenne?: number | null
          numero_permis?: string | null
          user_id?: string | null
          verifie?: boolean | null
        }
        Update: {
          created_at?: string | null
          date_expiration_permis?: string | null
          id?: string
          note_moyenne?: number | null
          numero_permis?: string | null
          user_id?: string | null
          verifie?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feedbacks: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          statut: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          statut?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          statut?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedbacks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          lu: boolean | null
          message: string | null
          titre: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lu?: boolean | null
          message?: string | null
          titre?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lu?: boolean | null
          message?: string | null
          titre?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          created_at: string | null
          id: string
          methode: string | null
          montant: number | null
          reservation_id: string | null
          statut: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          methode?: string | null
          montant?: number | null
          reservation_id?: string | null
          statut?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          methode?: string | null
          montant?: number | null
          reservation_id?: string | null
          statut?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          commentaire: string | null
          created_at: string | null
          from_user_id: string | null
          id: string
          note: number | null
          to_driver_id: string | null
          trip_id: string | null
        }
        Insert: {
          commentaire?: string | null
          created_at?: string | null
          from_user_id?: string | null
          id?: string
          note?: number | null
          to_driver_id?: string | null
          trip_id?: string | null
        }
        Update: {
          commentaire?: string | null
          created_at?: string | null
          from_user_id?: string | null
          id?: string
          note?: number | null
          to_driver_id?: string | null
          trip_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_to_driver_id_fkey"
            columns: ["to_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          created_at: string | null
          heure_proposee: string | null
          id: string
          nombre_places_reservees: number | null
          point_arrivee_propose: string | null
          point_depart_propose: string | null
          statut: string | null
          trip_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          heure_proposee?: string | null
          id?: string
          nombre_places_reservees?: number | null
          point_arrivee_propose?: string | null
          point_depart_propose?: string | null
          statut?: string | null
          trip_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          heure_proposee?: string | null
          id?: string
          nombre_places_reservees?: number | null
          point_arrivee_propose?: string | null
          point_depart_propose?: string | null
          statut?: string | null
          trip_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          ride_id: string
          sender_id: string
          sender_name: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          ride_id: string
          sender_id: string
          sender_name: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          ride_id?: string
          sender_id?: string
          sender_name?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount_total: number | null
          commission_amount: number | null
          created_at: string | null
          driver_amount: number | null
          driver_id: string | null
          id: string
          rider_id: string | null
          trip_id: string | null
          type: string | null
        }
        Insert: {
          amount_total?: number | null
          commission_amount?: number | null
          created_at?: string | null
          driver_amount?: number | null
          driver_id?: string | null
          id?: string
          rider_id?: string | null
          trip_id?: string | null
          type?: string | null
        }
        Update: {
          amount_total?: number | null
          commission_amount?: number | null
          created_at?: string | null
          driver_amount?: number | null
          driver_id?: string | null
          id?: string
          rider_id?: string | null
          trip_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          created_at: string | null
          date_heure: string | null
          driver_id: string | null
          id: string
          lieu_arrivee: string | null
          lieu_depart: string | null
          places_disponibles: number | null
          prix: number | null
          statut: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          date_heure?: string | null
          driver_id?: string | null
          id?: string
          lieu_arrivee?: string | null
          lieu_depart?: string | null
          places_disponibles?: number | null
          prix?: number | null
          statut?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          date_heure?: string | null
          driver_id?: string | null
          id?: string
          lieu_arrivee?: string | null
          lieu_depart?: string | null
          places_disponibles?: number | null
          prix?: number | null
          statut?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          mot_de_passe: string | null
          nom: string | null
          statut: string | null
          telephone: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          mot_de_passe?: string | null
          nom?: string | null
          statut?: string | null
          telephone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          mot_de_passe?: string | null
          nom?: string | null
          statut?: string | null
          telephone?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          created_at: string | null
          driver_id: string | null
          id: string
          immatriculation: string | null
          marque: string | null
          modele: string | null
          nombre_places_total: number | null
        }
        Insert: {
          created_at?: string | null
          driver_id?: string | null
          id?: string
          immatriculation?: string | null
          marque?: string | null
          modele?: string | null
          nombre_places_total?: number | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string | null
          id?: string
          immatriculation?: string | null
          marque?: string | null
          modele?: string | null
          nombre_places_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
