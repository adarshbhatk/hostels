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
      colleges: {
        Row: {
          created_at: string
          id: string
          location: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          location: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      hostels: {
        Row: {
          amenities: string[]
          capacity: number
          college_id: string
          created_at: string
          description: string
          distance: string
          id: string
          location: string
          mess_food: string
          name: string
          photos: string[]
          rating: number | null
          rent: string
          status: string
          type: string
          updated_at: string
          warden_email: string
          warden_name: string
          warden_phone: string
        }
        Insert: {
          amenities?: string[]
          capacity: number
          college_id: string
          created_at?: string
          description: string
          distance: string
          id?: string
          location: string
          mess_food: string
          name: string
          photos?: string[]
          rating?: number | null
          rent: string
          status?: string
          type: string
          updated_at?: string
          warden_email: string
          warden_name: string
          warden_phone: string
        }
        Update: {
          amenities?: string[]
          capacity?: number
          college_id?: string
          created_at?: string
          description?: string
          distance?: string
          id?: string
          location?: string
          mess_food?: string
          name?: string
          photos?: string[]
          rating?: number | null
          rent?: string
          status?: string
          type?: string
          updated_at?: string
          warden_email?: string
          warden_name?: string
          warden_phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostels_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          alias_name: string | null
          full_name: string
          id: string
          role: string
          use_alias_for_reviews: boolean | null
        }
        Insert: {
          alias_name?: string | null
          full_name: string
          id: string
          role?: string
          use_alias_for_reviews?: boolean | null
        }
        Update: {
          alias_name?: string | null
          full_name?: string
          id?: string
          role?: string
          use_alias_for_reviews?: boolean | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string
          created_at: string
          food_rating: number
          hostel_id: string
          id: string
          photos: string[] | null
          rating: number
          status: string
          updated_at: string
          upvotes: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          food_rating: number
          hostel_id: string
          id?: string
          photos?: string[] | null
          rating: number
          status?: string
          updated_at?: string
          upvotes?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          food_rating?: number
          hostel_id?: string
          id?: string
          photos?: string[] | null
          rating?: number
          status?: string
          updated_at?: string
          upvotes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_hostel_count: {
        Args: {
          college_id: string
        }
        Returns: number
      }
      is_admin: {
        Args: Record<PropertyKey, never>
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
