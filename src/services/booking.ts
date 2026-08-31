import { createClient } from "@/lib/supabase/server";
import type { TrialBookingInput } from "@/schemas/booking.schema";

export interface AvailableSlot {
  slotStart: string;
  slotEnd: string;
}

/** Free time slots for a teacher on a given day — computed entirely in Postgres. */
export async function getAvailableSlots(
  teacherId: string,
  day: string,
  durationMinutes = 60,
): Promise<AvailableSlot[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_available_slots", {
    p_teacher_id: teacherId,
    p_day: day,
    p_duration_minutes: durationMinutes,
  });

  if (error) throw new Error(error.message);

  return (data ?? []).map((slot) => ({
    slotStart: slot.slot_start,
    slotEnd: slot.slot_end,
  }));
}

export interface TrialBookingResult {
  lessonId: string;
  startsAt: string;
  endsAt: string;
}

/**
 * Public trial-lesson booking. Delegates to the book_trial_lesson() RPC,
 * which is the authoritative, backend-enforced conflict check (also backed
 * by a GiST exclusion constraint on the lessons table).
 */
export async function bookTrialLesson(input: TrialBookingInput): Promise<TrialBookingResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("book_trial_lesson", {
    p_teacher_id: input.teacher_id,
    p_starts_at: input.starts_at,
    p_duration_minutes: input.duration_minutes,
    p_full_name: input.full_name,
    p_email: input.email,
    p_phone: input.phone ?? undefined,
  });

  if (error) throw new Error(error.message);

  const row = data?.[0];
  if (!row) throw new Error("Não foi possível confirmar o agendamento.");

  return { lessonId: row.lesson_id, startsAt: row.starts_at, endsAt: row.ends_at };
}
