"use server";

import { requireRole } from "@/features/auth/session";
import { listTeachers } from "@/services/teachers";
import { listStudents } from "@/services/students";
import { listPlans } from "@/services/plans";
import { listLessonsInRange } from "@/services/lessons";

export interface LessonFormOptions {
  teachers: { id: string; full_name: string }[];
  students: { id: string; full_name: string }[];
  plans: { id: string; name: string }[];
}

/** Feeds the selects in the lesson creation/edit dialog. */
export async function getLessonFormOptions(): Promise<LessonFormOptions> {
  await requireRole(["admin", "teacher"]);
  const [teachers, students, plans] = await Promise.all([
    listTeachers(),
    listStudents({ pageSize: 200 }),
    listPlans(),
  ]);

  return {
    teachers: teachers.map((t) => ({ id: t.id, full_name: t.full_name })),
    students: students.items.map((s) => ({ id: s.id, full_name: s.full_name })),
    plans: plans.map((p) => ({ id: p.id, name: p.name })),
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
  status: string;
  type: string;
  studentId: string | null;
  studentName: string | null;
  teacherId: string;
  teacherName: string;
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: "#99c5ff",
  rescheduled: "#ffdf3d",
  completed: "#dcdce5",
  canceled: "#ba1a1a",
  no_show: "#ba1a1a",
};

/** Feeds FullCalendar's events() callback in the calendar page. */
export async function getCalendarEventsAction(
  startIso: string,
  endIso: string,
): Promise<CalendarEvent[]> {
  await requireRole(["admin", "teacher"]);
  const lessons = await listLessonsInRange(startIso, endIso);

  return lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.student?.full_name ?? (lesson.type === "trial" ? "Aula Experimental" : "Aula"),
    start: lesson.starts_at,
    end: lesson.ends_at,
    color: STATUS_COLORS[lesson.status] ?? "#99c5ff",
    status: lesson.status,
    type: lesson.type,
    studentId: lesson.student?.id ?? null,
    studentName: lesson.student?.full_name ?? null,
    teacherId: lesson.teacher_id,
    teacherName: lesson.teacher?.full_name ?? "",
  }));
}
