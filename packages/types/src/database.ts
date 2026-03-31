export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Enums: {
      activity_type: "flashcard" | "quiz" | "video" | "reading" | "trainer_signoff" | "scenario";
      app_role: "platform_admin" | "group_admin" | "location_manager" | "trainer" | "staff";
      board_type: "lineup" | "menu_updates" | "beverage_updates" | "operations" | "training_updates";
      brand_scope: "group" | "restaurant" | "location";
      certification_status: "in_progress" | "earned" | "expired";
      membership_status: "invited" | "active" | "suspended";
      post_status: "draft" | "published" | "archived";
    };
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          is_platform_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          is_platform_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          is_platform_admin?: boolean;
          updated_at?: string;
        };
      };
      groups: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          name?: string;
          slug?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
      };
      restaurants: {
        Row: {
          id: string;
          group_id: string;
          name: string;
          slug: string;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          group_id: string;
          name: string;
          slug: string;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          group_id?: string;
          name?: string;
          slug?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
      };
      locations: {
        Row: {
          id: string;
          group_id: string;
          restaurant_id: string;
          name: string;
          slug: string;
          timezone: string;
          city: string | null;
          state_region: string | null;
          country_code: string | null;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          group_id: string;
          restaurant_id: string;
          name: string;
          slug: string;
          timezone?: string;
          city?: string | null;
          state_region?: string | null;
          country_code?: string | null;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          group_id?: string;
          restaurant_id?: string;
          name?: string;
          slug?: string;
          timezone?: string;
          city?: string | null;
          state_region?: string | null;
          country_code?: string | null;
          updated_at?: string;
          archived_at?: string | null;
        };
      };
      group_memberships: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          role: Database["public"]["Enums"]["app_role"];
          status: Database["public"]["Enums"]["membership_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          role: Database["public"]["Enums"]["app_role"];
          status?: Database["public"]["Enums"]["membership_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          role?: Database["public"]["Enums"]["app_role"];
          status?: Database["public"]["Enums"]["membership_status"];
          updated_at?: string;
        };
      };
      memberships: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          user_id: string;
          role: Database["public"]["Enums"]["app_role"];
          status: Database["public"]["Enums"]["membership_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          user_id: string;
          role: Database["public"]["Enums"]["app_role"];
          status?: Database["public"]["Enums"]["membership_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          role?: Database["public"]["Enums"]["app_role"];
          status?: Database["public"]["Enums"]["membership_status"];
          updated_at?: string;
        };
      };
      invites: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          invited_by: string;
          email: string;
          role: Database["public"]["Enums"]["app_role"];
          invite_token: string;
          expires_at: string;
          accepted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          invited_by: string;
          email: string;
          role: Database["public"]["Enums"]["app_role"];
          invite_token: string;
          expires_at: string;
          accepted_at?: string | null;
          created_at?: string;
        };
        Update: {
          accepted_at?: string | null;
        };
      };
      brand_settings: {
        Row: {
          id: string;
          scope: Database["public"]["Enums"]["brand_scope"];
          group_id: string | null;
          restaurant_id: string | null;
          location_id: string | null;
          brand_name: string;
          logo_url: string | null;
          primary_color: string;
          accent_color: string;
          surface_color: string;
          typeface_heading: string;
          typeface_body: string;
          nav_label_overrides: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          scope: Database["public"]["Enums"]["brand_scope"];
          group_id?: string | null;
          restaurant_id?: string | null;
          location_id?: string | null;
          brand_name: string;
          logo_url?: string | null;
          primary_color?: string;
          accent_color?: string;
          surface_color?: string;
          typeface_heading?: string;
          typeface_body?: string;
          nav_label_overrides?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          brand_name?: string;
          logo_url?: string | null;
          primary_color?: string;
          accent_color?: string;
          surface_color?: string;
          typeface_heading?: string;
          typeface_body?: string;
          nav_label_overrides?: Json;
          updated_at?: string;
        };
      };
      menu_categories: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          name: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          name: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          name?: string;
          sort_order?: number;
          updated_at?: string;
          archived_at?: string | null;
        };
      };
      menu_items: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          category_id: string | null;
          name: string;
          menu_description: string;
          chef_notes: string | null;
          tableside_description: string | null;
          pos_reference: string | null;
          seasonal_tag: string | null;
          photo_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          category_id?: string | null;
          name: string;
          menu_description: string;
          chef_notes?: string | null;
          tableside_description?: string | null;
          pos_reference?: string | null;
          seasonal_tag?: string | null;
          photo_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          category_id?: string | null;
          name?: string;
          menu_description?: string;
          chef_notes?: string | null;
          tableside_description?: string | null;
          pos_reference?: string | null;
          seasonal_tag?: string | null;
          photo_url?: string | null;
          is_active?: boolean;
          updated_at?: string;
          archived_at?: string | null;
        };
      };
      allergens: {
        Row: {
          id: string;
          name: string;
          code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          code?: string;
        };
      };
      menu_item_allergens: {
        Row: {
          menu_item_id: string;
          allergen_id: string;
          created_at: string;
        };
        Insert: {
          menu_item_id: string;
          allergen_id: string;
          created_at?: string;
        };
        Update: never;
      };
      beverage_categories: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          name: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          name: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          name?: string;
          sort_order?: number;
          updated_at?: string;
          archived_at?: string | null;
        };
      };
      beverage_items: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          category_id: string | null;
          name: string;
          item_type: string;
          description: string | null;
          producer: string | null;
          region: string | null;
          vintage: string | null;
          abv: number | null;
          serving_notes: string | null;
          photo_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          category_id?: string | null;
          name: string;
          item_type: string;
          description?: string | null;
          producer?: string | null;
          region?: string | null;
          vintage?: string | null;
          abv?: number | null;
          serving_notes?: string | null;
          photo_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          category_id?: string | null;
          name?: string;
          item_type?: string;
          description?: string | null;
          producer?: string | null;
          region?: string | null;
          vintage?: string | null;
          abv?: number | null;
          serving_notes?: string | null;
          photo_url?: string | null;
          is_active?: boolean;
          updated_at?: string;
          archived_at?: string | null;
        };
      };
      pairings: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          menu_item_id: string;
          beverage_item_id: string;
          notes: string | null;
          strength: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          menu_item_id: string;
          beverage_item_id: string;
          notes?: string | null;
          strength?: number;
          created_at?: string;
        };
        Update: {
          notes?: string | null;
          strength?: number;
        };
      };
      training_programs: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          name: string;
          description: string | null;
          is_required: boolean;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          name: string;
          description?: string | null;
          is_required?: boolean;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
          is_required?: boolean;
          updated_at?: string;
          archived_at?: string | null;
        };
      };
      training_modules: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          program_id: string;
          title: string;
          description: string | null;
          sort_order: number;
          estimated_minutes: number | null;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          program_id: string;
          title: string;
          description?: string | null;
          sort_order?: number;
          estimated_minutes?: number | null;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          title?: string;
          description?: string | null;
          sort_order?: number;
          estimated_minutes?: number | null;
          updated_at?: string;
          archived_at?: string | null;
        };
      };
      lessons: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          module_id: string;
          title: string;
          content_markdown: string | null;
          video_url: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          module_id: string;
          title: string;
          content_markdown?: string | null;
          video_url?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          title?: string;
          content_markdown?: string | null;
          video_url?: string | null;
          sort_order?: number;
          updated_at?: string;
          archived_at?: string | null;
        };
      };
      activities: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          lesson_id: string;
          activity_type: Database["public"]["Enums"]["activity_type"];
          title: string;
          payload: Json;
          min_pass_score: number | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          lesson_id: string;
          activity_type: Database["public"]["Enums"]["activity_type"];
          title: string;
          payload?: Json;
          min_pass_score?: number | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type"];
          title?: string;
          payload?: Json;
          min_pass_score?: number | null;
          sort_order?: number;
          updated_at?: string;
          archived_at?: string | null;
        };
      };
      quizzes: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          activity_id: string;
          title: string;
          randomize_questions: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          activity_id: string;
          title: string;
          randomize_questions?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          randomize_questions?: boolean;
          updated_at?: string;
        };
      };
      quiz_questions: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          quiz_id: string;
          prompt: string;
          explanation: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          quiz_id: string;
          prompt: string;
          explanation?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          prompt?: string;
          explanation?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
      };
      quiz_options: {
        Row: {
          id: string;
          question_id: string;
          option_text: string;
          is_correct: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          option_text: string;
          is_correct?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          option_text?: string;
          is_correct?: boolean;
          sort_order?: number;
        };
      };
      activity_attempts: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          activity_id: string;
          user_id: string;
          score: number | null;
          passed: boolean | null;
          attempt_no: number;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          activity_id: string;
          user_id: string;
          score?: number | null;
          passed?: boolean | null;
          attempt_no?: number;
          submitted_at?: string;
        };
        Update: never;
      };
      trainer_signoffs: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          activity_id: string;
          staff_user_id: string;
          trainer_user_id: string | null;
          status: "pending" | "approved" | "rejected";
          notes: string | null;
          signed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          activity_id: string;
          staff_user_id: string;
          trainer_user_id?: string | null;
          status?: "pending" | "approved" | "rejected";
          notes?: string | null;
          signed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          trainer_user_id?: string | null;
          status?: "pending" | "approved" | "rejected";
          notes?: string | null;
          signed_at?: string | null;
          updated_at?: string;
        };
      };
      certifications: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
          updated_at?: string;
          archived_at?: string | null;
        };
      };
      certification_requirements: {
        Row: {
          id: string;
          certification_id: string;
          requirement_type: "module" | "activity" | "minimum_score";
          reference_id: string | null;
          min_score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          certification_id: string;
          requirement_type: "module" | "activity" | "minimum_score";
          reference_id?: string | null;
          min_score?: number | null;
          created_at?: string;
        };
        Update: {
          requirement_type?: "module" | "activity" | "minimum_score";
          reference_id?: string | null;
          min_score?: number | null;
        };
      };
      user_certifications: {
        Row: {
          id: string;
          certification_id: string;
          user_id: string;
          status: Database["public"]["Enums"]["certification_status"];
          awarded_at: string | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          certification_id: string;
          user_id: string;
          status?: Database["public"]["Enums"]["certification_status"];
          awarded_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: Database["public"]["Enums"]["certification_status"];
          awarded_at?: string | null;
          expires_at?: string | null;
          updated_at?: string;
        };
      };
      boards: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          board_type: Database["public"]["Enums"]["board_type"];
          title: string;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          board_type: Database["public"]["Enums"]["board_type"];
          title: string;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          board_type?: Database["public"]["Enums"]["board_type"];
          title?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
      };
      posts: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          board_id: string;
          author_user_id: string;
          title: string;
          body_markdown: string;
          status: Database["public"]["Enums"]["post_status"];
          publish_at: string | null;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          board_id: string;
          author_user_id: string;
          title: string;
          body_markdown: string;
          status?: Database["public"]["Enums"]["post_status"];
          publish_at?: string | null;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          title?: string;
          body_markdown?: string;
          status?: Database["public"]["Enums"]["post_status"];
          publish_at?: string | null;
          updated_at?: string;
          archived_at?: string | null;
        };
      };
      post_acknowledgements: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          acknowledged_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          acknowledged_at?: string;
        };
        Update: never;
      };
      user_lesson_progress: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          lesson_id: string;
          user_id: string;
          completed_at: string | null;
          progress_percent: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          lesson_id: string;
          user_id: string;
          completed_at?: string | null;
          progress_percent?: number;
          updated_at?: string;
        };
        Update: {
          completed_at?: string | null;
          progress_percent?: number;
          updated_at?: string;
        };
      };
      user_module_progress: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          module_id: string;
          user_id: string;
          completion_percent: number;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          module_id: string;
          user_id: string;
          completion_percent?: number;
          completed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          completion_percent?: number;
          completed_at?: string | null;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          user_id: string;
          title: string;
          body: string;
          action_url: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          user_id: string;
          title: string;
          body: string;
          action_url?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          read_at?: string | null;
        };
      };
      notification_preferences: {
        Row: {
          id: string;
          group_id: string;
          location_id: string;
          user_id: string;
          lineup_enabled: boolean;
          training_enabled: boolean;
          communications_enabled: boolean;
          quiet_hours_start: string | null;
          quiet_hours_end: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          location_id: string;
          user_id: string;
          lineup_enabled?: boolean;
          training_enabled?: boolean;
          communications_enabled?: boolean;
          quiet_hours_start?: string | null;
          quiet_hours_end?: string | null;
          updated_at?: string;
        };
        Update: {
          lineup_enabled?: boolean;
          training_enabled?: boolean;
          communications_enabled?: boolean;
          quiet_hours_start?: string | null;
          quiet_hours_end?: string | null;
          updated_at?: string;
        };
      };
      audit_events: {
        Row: {
          id: string;
          group_id: string | null;
          location_id: string | null;
          actor_user_id: string | null;
          event_type: string;
          entity_table: string;
          entity_id: string;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id?: string | null;
          location_id?: string | null;
          actor_user_id?: string | null;
          event_type: string;
          entity_table: string;
          entity_id: string;
          payload?: Json;
          created_at?: string;
        };
        Update: never;
      };
    };
    Views: {
      effective_brand_settings: {
        Row: {
          group_id: string;
          brand_name: string;
          logo_url: string | null;
          primary_color: string;
          accent_color: string;
          surface_color: string;
          typeface_heading: string;
          typeface_body: string;
        };
      };
    };
    Functions: {
      user_has_group_access: {
        Args: {
          target_group: string;
        };
        Returns: boolean;
      };
      user_has_location_access: {
        Args: {
          target_location: string;
        };
        Returns: boolean;
      };
      user_has_location_role: {
        Args: {
          target_location: string;
          allowed_roles: Database["public"]["Enums"]["app_role"][];
        };
        Returns: boolean;
      };
    };
  };
};
