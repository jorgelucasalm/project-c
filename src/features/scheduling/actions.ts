"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/features/auth/session";
import { lessonSchema, attendanceSchema, rescheduleLessonSchema } from "@/schemas/lesson.schema";
import * as lessonsService from "@/services/lessons";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function createLessonAction(input: unknown): Promise<ActionResult> {
  const profile = await requireRole(["admin", "teacher"]);
  const parsed = lessonSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  try {
    await lessonsService.createLesson(parsed.data, profile.id);
    revalidatePath("/calendar");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao criar aula." };
  }
}

export async function rescheduleLessonAction(input: unknown): Promise<ActionResult> {
  await requireRole(["admin", "teacher"]);
  const parsed = rescheduleLessonSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  try {
    await lessonsService.rescheduleLesson(parsed.data);
    revalidatePath("/calendar");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao reagendar aula." };
  }
}

export async function cancelLessonAction(lessonId: string): Promise<ActionResult> {
  await requireRole(["admin", "teacher"]);
  try {
    await lessonsService.cancelLesson(lessonId);
    revalidatePath("/calendar");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao cancelar aula." };
  }
}

export async function markAttendanceAction(input: unknown): Promise<ActionResult> {
  const profile = await requireRole(["admin", "teacher"]);
  const parsed = attendanceSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  try {
    await lessonsService.markAttendance(
      parsed.data.lesson_id,
      parsed.data.student_id,
      parsed.data.status,
      profile.id,
    );
    revalidatePath("/calendar");
    revalidatePath(`/students/${parsed.data.student_id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao marcar presença." };
  }
}
