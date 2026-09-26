export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string;
          full_name: string | null;
          id: string;
        };
        Insert: {
          created_at?: string;
          full_name?: string | null;
          id: string;
        };
        Update: {
          created_at?: string;
          full_name?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      authors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          id: string
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          body: string | null
          category_id: string | null
          cover_image_alt: string | null
          cover_image_url: string | null
          tags: string[]
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          category_id?: string | null
          cover_image_alt?: string | null
          cover_image_url?: string | null
          tags?: string[]
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string | null
          category_id?: string | null
          cover_image_alt?: string | null
          cover_image_url?: string | null
          tags?: string[]
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      case_studies: {
        Row: {
          body: string | null
          client_name: string | null
          cover_image_alt: string | null
          cover_image_url: string | null
          tags: string[]
          created_at: string
          featured: boolean
          id: string
          industry_id: string | null
          results: Json | null
          seo_description: string | null
          seo_title: string | null
          service_id: string | null
          slug: string
          status: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          client_name?: string | null
          cover_image_alt?: string | null
          cover_image_url?: string | null
          tags?: string[]
          created_at?: string
          featured?: boolean
          id?: string
          industry_id?: string | null
          results?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          service_id?: string | null
          slug: string
          status?: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          client_name?: string | null
          cover_image_alt?: string | null
          cover_image_url?: string | null
          tags?: string[]
          created_at?: string
          featured?: boolean
          id?: string
          industry_id?: string | null
          results?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          service_id?: string | null
          slug?: string
          status?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_studies_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_studies_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      industries: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          client_company: string | null
          client_name: string
          created_at: string
          featured: boolean
          id: string
          quote: string
          rating: number | null
          service_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          client_company?: string | null
          client_name: string
          created_at?: string
          featured?: boolean
          id?: string
          quote: string
          rating?: number | null
          service_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          client_company?: string | null
          client_name?: string
          created_at?: string
          featured?: boolean
          id?: string
          quote?: string
          rating?: number | null
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          name: string
          published: boolean
          role: string
          sort_order: number
          tone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          published?: boolean
          role: string
          sort_order?: number
          tone?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          published?: boolean
          role?: string
          sort_order?: number
          tone?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          consent: boolean
          landing_page: string | null
          referrer: string | null
          utm_content: string | null
          utm_term: string | null
          admin_notes: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          service_id: string | null
          source_page: string | null
          status: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          consent?: boolean
          landing_page?: string | null
          referrer?: string | null
          utm_content?: string | null
          utm_term?: string | null
          admin_notes?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          service_id?: string | null
          source_page?: string | null
          status?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          consent?: boolean
          landing_page?: string | null
          referrer?: string | null
          utm_content?: string | null
          utm_term?: string | null
          admin_notes?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          service_id?: string | null
          source_page?: string | null
          status?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          source_page: string | null
          status: string
          unsubscribe_token: string
          unsubscribed_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source_page?: string | null
          status?: string
          unsubscribe_token?: string
          unsubscribed_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source_page?: string | null
          status?: string
          unsubscribe_token?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          consent: boolean
          landing_page: string | null
          referrer: string | null
          source_page: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          admin_notes: string | null
          budget_range: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          project_timeline: string | null
          service_ids: string[] | null
          status: string
        }
        Insert: {
          consent?: boolean
          landing_page?: string | null
          referrer?: string | null
          source_page?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          admin_notes?: string | null
          budget_range?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          project_timeline?: string | null
          service_ids?: string[] | null
          status?: string
        }
        Update: {
          consent?: boolean
          landing_page?: string | null
          referrer?: string | null
          source_page?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          admin_notes?: string | null
          budget_range?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          project_timeline?: string | null
          service_ids?: string[] | null
          status?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          cluster: string
          created_at: string
          deliverables: Json
          hero_copy: string | null
          id: string
          name: string
          process_steps: Json
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          cluster: string
          created_at?: string
          deliverables?: Json
          hero_copy?: string | null
          id?: string
          name: string
          process_steps?: Json
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          cluster?: string
          created_at?: string
          deliverables?: Json
          hero_copy?: string | null
          id?: string
          name?: string
          process_steps?: Json
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      form_submission_log: {
        Row: {
          created_at: string
          form: string
          id: number
          ip_hash: string
        }
        Insert: {
          created_at?: string
          form: string
          id?: number
          ip_hash: string
        }
        Update: {
          created_at?: string
          form?: string
          id?: number
          ip_hash?: string
        }
        Relationships: []
      }
      audit_requests: {
        Row: {
          landing_page: string | null;
          notes: string | null;
          referrer: string | null;
          source_page: string | null;
          utm_campaign: string | null;
          utm_content: string | null;
          utm_medium: string | null;
          utm_source: string | null;
          utm_term: string | null;
          business_type: string;
          consent: boolean;
          created_at: string;
          email: string;
          id: string;
          name: string;
          website_url: string;
        };
        Insert: {
          landing_page?: string | null;
          notes?: string | null;
          referrer?: string | null;
          source_page?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          utm_term?: string | null;
          business_type: string;
          consent?: boolean;
          created_at?: string;
          email: string;
          id?: string;
          name: string;
          website_url: string;
        };
        Update: {
          landing_page?: string | null;
          notes?: string | null;
          referrer?: string | null;
          source_page?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          utm_term?: string | null;
          business_type?: string;
          consent?: boolean;
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
          website_url?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      prune_form_submission_log: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
