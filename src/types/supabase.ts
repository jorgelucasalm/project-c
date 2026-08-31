/**
 * Hand-written mirror of the Supabase schema (supabase/migrations/*.sql).
 *
 * Once the project is linked to a real Supabase instance, regenerate this
 * file with the official generator to guarantee it never drifts:
 *
 *   npx supabase gen types typescript --project-id <ref> > src/types/supabase.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "admin" | "teacher" | "student";
          full_name: string;
          email: string;
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          full_name: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      Relationships: [];
      };
      plans: {
        Row: {
          id: string;
          name: string;
          price_cents: number;
          lesson_duration_minutes: number;
          lessons_per_cycle: number;
          status: "active" | "inactive";
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["plans"]["Row"]> & {
          name: string;
          price_cents: number;
          lesson_duration_minutes: number;
          lessons_per_cycle: number;
        };
        Update: Partial<Database["public"]["Tables"]["plans"]["Row"]>;
      Relationships: [];
      };
      teachers: {
        Row: {
          id: string;
          profile_id: string | null;
          full_name: string;
          email: string;
          phone: string | null;
          bio: string | null;
          color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["teachers"]["Row"]> & {
          full_name: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["teachers"]["Row"]>;
      Relationships: [];
      };
      students: {
        Row: {
          id: string;
          profile_id: string | null;
          full_name: string;
          email: string;
          phone: string | null;
          student_type: "adult" | "teen" | "kids";
          status: "active" | "inactive" | "pending";
          level: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["students"]["Row"]> & {
          full_name: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["students"]["Row"]>;
      Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          student_id: string;
          plan_id: string;
          teacher_id: string | null;
          status: "active" | "inactive" | "pending" | "canceled";
          started_at: string;
          ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]> & {
          student_id: string;
          plan_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]>;
      Relationships: [];
      };
      teacher_availability: {
        Row: {
          id: string;
          teacher_id: string;
          weekday: number;
          start_time: string;
          end_time: string;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["teacher_availability"]["Row"]
        > & {
          teacher_id: string;
          weekday: number;
          start_time: string;
          end_time: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["teacher_availability"]["Row"]
        >;
      Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          teacher_id: string;
          student_id: string | null;
          plan_id: string | null;
          starts_at: string;
          ends_at: string;
          status:
            | "scheduled"
            | "completed"
            | "canceled"
            | "no_show"
            | "rescheduled";
          type: "regular" | "trial" | "makeup";
          location: "online" | "in_person";
          notes: string | null;
          created_by: string | null;
          google_calendar_event_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["lessons"]["Row"]> & {
          teacher_id: string;
          starts_at: string;
          ends_at: string;
        };
        Update: Partial<Database["public"]["Tables"]["lessons"]["Row"]>;
      Relationships: [];
      };
      attendance: {
        Row: {
          id: string;
          lesson_id: string;
          student_id: string;
          status: "present" | "absent" | "excused";
          marked_at: string;
          marked_by: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["attendance"]["Row"]> & {
          lesson_id: string;
          student_id: string;
          status: "present" | "absent" | "excused";
        };
        Update: Partial<Database["public"]["Tables"]["attendance"]["Row"]>;
      Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          type:
            | "LESSON_REMINDER"
            | "LESSON_CREATED"
            | "LESSON_CANCELED"
            | "LESSON_RESCHEDULED"
            | "TRIAL_BOOKED"
            | "PLAN_EXPIRING";
          channel: "whatsapp" | "email" | "push" | "sms" | "log";
          user_id: string | null;
          lesson_id: string | null;
          status: "pending" | "sent" | "failed";
          payload: Json;
          scheduled_for: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]> & {
          type: Database["public"]["Tables"]["notifications"]["Row"]["type"];
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
      Relationships: [];
      };
      calendar_integrations: {
        Row: {
          id: string;
          teacher_id: string;
          provider: "google";
          access_token: string;
          refresh_token: string;
          token_expires_at: string;
          google_calendar_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["calendar_integrations"]["Row"]
        > & {
          teacher_id: string;
          access_token: string;
          refresh_token: string;
          token_expires_at: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["calendar_integrations"]["Row"]
        >;
      Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_available_slots: {
        Args: {
          p_teacher_id: string;
          p_day: string;
          p_duration_minutes?: number;
          p_step_minutes?: number;
          p_timezone?: string;
        };
        Returns: { slot_start: string; slot_end: string }[];
      };
      book_trial_lesson: {
        Args: {
          p_teacher_id: string;
          p_starts_at: string;
          p_duration_minutes: number;
          p_full_name: string;
          p_email: string;
          p_phone?: string | null;
        };
        Returns: {
          lesson_id: string;
          starts_at: string;
          ends_at: string;
          status: string;
        }[];
      };
    };
    Enums: {
      user_role: "admin" | "teacher" | "student";
    };
  };
}
