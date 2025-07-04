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
      pagos_cuotas: {
        Row: {
          created_at: string
          detalle_pago: string | null
          fecha_pago: string
          id: string
          id_prestamo: string
          id_usuario: string
          metodo_pago: string
          monto_pagado: number
          referencia_pago: string
          tipo_pago: string
        }
        Insert: {
          created_at?: string
          detalle_pago?: string | null
          fecha_pago?: string
          id?: string
          id_prestamo: string
          id_usuario: string
          metodo_pago: string
          monto_pagado: number
          referencia_pago: string
          tipo_pago: string
        }
        Update: {
          created_at?: string
          detalle_pago?: string | null
          fecha_pago?: string
          id?: string
          id_prestamo?: string
          id_usuario?: string
          metodo_pago?: string
          monto_pagado?: number
          referencia_pago?: string
          tipo_pago?: string
        }
        Relationships: [
          {
            foreignKeyName: "pagos_cuotas_id_prestamo_fkey"
            columns: ["id_prestamo"]
            isOneToOne: false
            referencedRelation: "prestamos"
            referencedColumns: ["id"]
          },
        ]
      }
      prestamos: {
        Row: {
          created_at: string
          cuotas_pagadas: number | null
          cuotas_totales: number | null
          detalle_pago: string | null
          dias_para_pago: number | null
          estado: string | null
          fecha_primer_pago: string | null
          fecha_solicitud: string
          fecha_ultimo_pago: string | null
          id: string
          id_usuario: string
          interes: number | null
          metodo_pago: string | null
          monto_pagado: number | null
          monto_por_cuota: number | null
          monto_prestado: number
          total_a_devolver: number | null
        }
        Insert: {
          created_at?: string
          cuotas_pagadas?: number | null
          cuotas_totales?: number | null
          detalle_pago?: string | null
          dias_para_pago?: number | null
          estado?: string | null
          fecha_primer_pago?: string | null
          fecha_solicitud?: string
          fecha_ultimo_pago?: string | null
          id?: string
          id_usuario: string
          interes?: number | null
          metodo_pago?: string | null
          monto_pagado?: number | null
          monto_por_cuota?: number | null
          monto_prestado: number
          total_a_devolver?: number | null
        }
        Update: {
          created_at?: string
          cuotas_pagadas?: number | null
          cuotas_totales?: number | null
          detalle_pago?: string | null
          dias_para_pago?: number | null
          estado?: string | null
          fecha_primer_pago?: string | null
          fecha_solicitud?: string
          fecha_ultimo_pago?: string | null
          id?: string
          id_usuario?: string
          interes?: number | null
          metodo_pago?: string | null
          monto_pagado?: number | null
          monto_por_cuota?: number | null
          monto_prestado?: number
          total_a_devolver?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birth_date: string | null
          created_at: string
          dni: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          dni?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          dni?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
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
