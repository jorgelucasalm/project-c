import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { googleCalendarProvider } from "@/lib/google-calendar/calendar-service";
import type { LessonWithRelations } from "@/types/domain";

function lessonToEventInput(lesson: LessonWithRelations) {
  return {
    summary: `Aula ${lesson.type === "trial" ? "experimental" : ""} — ${lesson.student?.full_name ?? "Aluno"}`.trim(),
    description: lesson.notes ?? undefined,
    startIso: lesson.starts_at,
    endIso: lesson.ends_at,
  };
}

/**
 * Keeps a lesson's Google Calendar event in sync. Completely optional and
 * silent no-op when the teacher hasn't connected Google Calendar — Supabase
 * remains the source of truth regardless of whether this succeeds.
 */
export async function syncLessonToGoogleCalendar(lesson: LessonWithRelations) {
  try {
    if (!(await googleCalendarProvider.isConnected(lesson.teacher_id))) return;

    const supabase = createAdminClient();
    const input = lessonToEventInput(lesson);

    const result = lesson.google_calendar_event_id
      ? await googleCalendarProvider.updateEvent(
          lesson.teacher_id,
          lesson.google_calendar_event_id,
          input,
        )
      : await googleCalendarProvider.createEvent(lesson.teacher_id, input);

    if (result) {
      await supabase
        .from("lessons")
        .update({ google_calendar_event_id: result.eventId })
        .eq("id", lesson.id);
    }
  } catch (error) {
    // Google Calendar is an isolated, best-effort integration — a failure
    // here must never block the core scheduling flow.
    console.error("[google-calendar] sync failed", error);
  }
}

export async function removeLessonFromGoogleCalendar(lesson: LessonWithRelations) {
  try {
    if (!lesson.google_calendar_event_id) return;
    if (!(await googleCalendarProvider.isConnected(lesson.teacher_id))) return;
    await googleCalendarProvider.deleteEvent(lesson.teacher_id, lesson.google_calendar_event_id);
  } catch (error) {
    console.error("[google-calendar] delete failed", error);
  }
}
