export type Database = {
  public: {
    Tables: {
      content: {
        Row: {
          id: string
          created_at: string
          type: string
          published: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          type: string
          published?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          type?: string
          published?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
        }
        Insert: {
          id: string
          username: string
        }
        Update: {
          id?: string
          username?: string
        }
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

