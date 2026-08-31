/**
 * Core domain types shared across the app. These mirror the Supabase schema
 * defined in supabase/migrations and are the single source of truth for
 * TypeScript consumers (components, services, schemas).
 */

export type UserRole = "admin" | "teacher" | "student";

export type StudentStatus = "active" | "inactive" | "pending";

export type SubscriptionStatus = "active" | "inactive" | "pending" | "canceled";

export type LessonStatus =
  | "scheduled"
  | "completed"
  | "canceled"
  | "no_show"
  | "rescheduled";

export type LessonType = "regular" | "trial" | "makeup";

export type AttendanceStatus = "present" | "absent" | "excused";

export type NotificationType =
  | "LESSON_REMINDER"
  | "LESSON_CREATED"
  | "LESSON_CANCELED"
  | "LESSON_RESCHEDULED"
  | "TRIAL_BOOKED"
  | "PLAN_EXPIRING";

export type NotificationChannel = "whatsapp" | "email" | "push" | "sms" | "log";

export type NotificationStatus = "pending" | "sent" | "failed";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
}

export interface Plan {
  id: string;
  name: string;
  price_cents: number;
  lesson_duration_minutes: number;
  lessons_per_cycle: number;
  status: "active" | "inactive";
  created_at: string;
}

export interface Student {
  id: string;
  profile_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  student_type: "adult" | "teen" | "kids";
  status: StudentStatus;
  level: string | null;
  notes: string | null;
  created_at: string;
}

export interface Teacher {
  id: string;
  profile_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  color: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  student_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  teacher_id: string | null;
  started_at: string;
  ends_at: string | null;
  created_at: string;
}

export interface TeacherAvailability {
  id: string;
  teacher_id: string;
  weekday: number; // 0 (Sunday) - 6 (Saturday)
  start_time: string; // HH:mm:ss
  end_time: string; // HH:mm:ss
  created_at: string;
}

export interface Lesson {
  id: string;
  teacher_id: string;
  student_id: string | null;
  plan_id: string | null;
  starts_at: string;
  ends_at: string;
  status: LessonStatus;
  type: LessonType;
  location: "online" | "in_person";
  notes: string | null;
  created_by: string | null;
  google_calendar_event_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  lesson_id: string;
  student_id: string;
  status: AttendanceStatus;
  marked_at: string;
  marked_by: string | null;
}

export interface NotificationRecord {
  id: string;
  type: NotificationType;
  channel: NotificationChannel;
  user_id: string;
  lesson_id: string | null;
  status: NotificationStatus;
  payload: Record<string, unknown>;
  scheduled_for: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface CalendarIntegration {
  id: string;
  teacher_id: string;
  provider: "google";
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
  google_calendar_id: string;
  created_at: string;
}

/** UI-friendly composite used by calendar / dashboard views. */
export interface LessonWithRelations extends Lesson {
  teacher: Pick<Teacher, "id" | "full_name" | "color"> | null;
  student: Pick<Student, "id" | "full_name" | "level"> | null;
}
