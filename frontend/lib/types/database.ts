// Database types for type safety
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          role: "farmer" | "expert" | "admin"
          location: string | null
          farm_size: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          role?: "farmer" | "expert" | "admin"
          location?: string | null
          farm_size?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          role?: "farmer" | "expert" | "admin"
          location?: string | null
          farm_size?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      plant_diagnoses: {
        Row: {
          id: string
          user_id: string
          image_url: string
          disease_name: string | null
          confidence: number | null
          symptoms: string | null
          treatment_recommendation: string | null
          severity: "low" | "medium" | "high" | "critical" | null
          crop_type: string | null
          diagnosed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_url: string
          disease_name?: string | null
          confidence?: number | null
          symptoms?: string | null
          treatment_recommendation?: string | null
          severity?: "low" | "medium" | "high" | "critical" | null
          crop_type?: string | null
          diagnosed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          image_url?: string
          disease_name?: string | null
          confidence?: number | null
          symptoms?: string | null
          treatment_recommendation?: string | null
          severity?: "low" | "medium" | "high" | "critical" | null
          crop_type?: string | null
          diagnosed_at?: string
          created_at?: string
        }
      }
      community_posts: {
        Row: {
          id: string
          author_id: string
          title: string
          content: string
          category: "question" | "tip" | "discussion" | "success_story" | null
          tags: string[] | null
          image_url: string | null
          likes_count: number
          comments_count: number
          views_count: number
          is_pinned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          content: string
          category?: "question" | "tip" | "discussion" | "success_story" | null
          tags?: string[] | null
          image_url?: string | null
          likes_count?: number
          comments_count?: number
          views_count?: number
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          content?: string
          category?: "question" | "tip" | "discussion" | "success_story" | null
          tags?: string[] | null
          image_url?: string | null
          likes_count?: number
          comments_count?: number
          views_count?: number
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      market_rates: {
        Row: {
          id: string
          crop_name: string
          variety: string | null
          market_location: string
          state: string | null
          price_per_quintal: number
          price_change: number
          min_price: number | null
          max_price: number | null
          date: string
          source: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          crop_name: string
          variety?: string | null
          market_location: string
          state?: string | null
          price_per_quintal: number
          price_change?: number
          min_price?: number | null
          max_price?: number | null
          date?: string
          source?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          crop_name?: string
          variety?: string | null
          market_location?: string
          state?: string | null
          price_per_quintal?: number
          price_change?: number
          min_price?: number | null
          max_price?: number | null
          date?: string
          source?: string
          created_at?: string
          updated_at?: string
        }
      }
      farm_records: {
        Row: {
          id: string
          user_id: string
          record_type:
            | "planting"
            | "irrigation"
            | "fertilizer"
            | "pesticide"
            | "harvest"
            | "expense"
            | "income"
            | "other"
          crop_name: string | null
          description: string
          quantity: number | null
          unit: string | null
          cost: number
          date: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          record_type:
            | "planting"
            | "irrigation"
            | "fertilizer"
            | "pesticide"
            | "harvest"
            | "expense"
            | "income"
            | "other"
          crop_name?: string | null
          description: string
          quantity?: number | null
          unit?: string | null
          cost?: number
          date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          record_type?:
            | "planting"
            | "irrigation"
            | "fertilizer"
            | "pesticide"
            | "harvest"
            | "expense"
            | "income"
            | "other"
          crop_name?: string | null
          description?: string
          quantity?: number | null
          unit?: string | null
          cost?: number
          date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
