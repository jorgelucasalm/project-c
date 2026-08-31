import { createClient } from "@/lib/supabase/server";
import type { LessonWithRelations, LessonStatus } from "@/types/domain";
import type { LessonInput, RescheduleLessonInput } from "@/schemas/lesson.schema";
import { notifyLessonEvent } from "@/services/notifications";
import { syncLessonToGoogleCalendar, removeLessonFromGoogleCalendar } from "@/lib/google-calendar/sync";

const OVERLAP_MESSAGE =
  "Esse professor já tem uma aula nesse horário. Escolha outro horário ou professor.";

/** Postgres raises SQLSTATE 23P01 (exclusion_violation) for overlapping lessons. */
function isOverlapError(error: { code?: string } | null): boolean {
  return error?.code === "23P01";
}

const LESSON_SELECT = `
  *,
  teacher:teachers(id, full_name, color),
  student:students(id, full_name, level)
`;

export async function listLessonsInRange(
  startsAtGte: string,
  startsAtLte: string,
  filters: { teacherId?: string; studentId?: string } = {},
) {
  const supabase = await createClient();
  let query = supabase
    .from("lessons")
    .select(LESSON_SELECT)
    .gte("starts_at", startsAtGte)
    .lte("starts_at", startsAtLte)
    .order("starts_at", { ascending: true });

  if (filters.teacherId) query = query.eq("teacher_id", filters.teacherId);
  if (filters.studentId) query = query.eq("student_id", filters.studentId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as unknown as LessonWithRelations[];
}

export async function getTodayLessons() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return listLessonsInRange(start.toISOString(), end.toISOString());
}

export async function createLesson(input: LessonInput, createdBy: string | null) {
  const supabase = await createClient();
  const endsAt = new Date(
    new Date(input.starts_at).getTime() + input.duration_minutes * 60_000,
  ).toISOString();

  const { data, error } = await supabase
    .from("lessons")
    .insert({
      teacher_id: input.teacher_id,
      student_id: input.student_id,
      plan_id: input.plan_id ?? null,
      starts_at: input.starts_at,
      ends_at: endsAt,
      type: input.type,
      location: input.location,
      notes: input.notes,
      status: "scheduled",
      created_by: createdBy,
    })
    .select(LESSON_SELECT)
    .single();

  if (error) {
    if (isOverlapError(error)) throw new Error(OVERLAP_MESSAGE);
    throw new Error(error.message);
  }

  const lesson = data as unknown as LessonWithRelations;
  await notifyLessonEvent("LESSON_CREATED", lesson);
  await syncLessonToGoogleCalendar(lesson);
  return lesson;
}

export async function rescheduleLesson(input: RescheduleLessonInput) {
  const supabase = await createClient();
  const endsAt = new Date(
    new Date(input.starts_at).getTime() + input.duration_minutes * 60_000,
  ).toISOString();

  const { data, error } = await supabase
    .from("lessons")
    .update({ starts_at: input.starts_at, ends_at: endsAt, status: "rescheduled" })
    .eq("id", input.lesson_id)
    .select(LESSON_SELECT)
    .single();

  if (error) {
    if (isOverlapError(error)) throw new Error(OVERLAP_MESSAGE);
    throw new Error(error.message);
  }

  const lesson = data as unknown as LessonWithRelations;
  await notifyLessonEvent("LESSON_RESCHEDULED", lesson);
  await syncLessonToGoogleCalendar(lesson);
  return lesson;
}

export async function updateLessonStatus(lessonId: string, status: LessonStatus) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .update({ status })
    .eq("id", lessonId)
    .select(LESSON_SELECT)
    .single();

  if (error) throw new Error(error.message);

  const lesson = data as unknown as LessonWithRelations;
  if (status === "canceled") {
    await notifyLessonEvent("LESSON_CANCELED", lesson);
    await removeLessonFromGoogleCalendar(lesson);
  }
  return lesson;
}

export async function cancelLesson(lessonId: string) {
  return updateLessonStatus(lessonId, "canceled");
}

export async function markAttendance(
  lessonId: string,
  studentId: string,
  status: "present" | "absent" | "excused",
  markedBy: string | null,
) {
  const supabase = await createClient();
  const { error } = await supabase.from("attendance").upsert(
    {
      lesson_id: lessonId,
      student_id: studentId,
      status,
      marked_by: markedBy,
      marked_at: new Date().toISOString(),
    },
    { onConflict: "lesson_id,student_id" },
  );
  if (error) throw new Error(error.message);

  await supabase
    .from("lessons")
    .update({ status: status === "absent" ? "no_show" : "completed" })
    .eq("id", lessonId);
}
