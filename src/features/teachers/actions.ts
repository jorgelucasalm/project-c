"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/features/auth/session";
import { teacherSchema, availabilitySlotSchema } from "@/schemas/teacher.schema";
import * as teachersService from "@/services/teachers";
import type { ActionResult } from "@/features/scheduling/actions";

export async function createTeacherAction(input: unknown): Promise<ActionResult> {
  await requireRole(["admin"]);
  const parsed = teacherSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    await teachersService.createTeacher(parsed.data);
    revalidatePath("/teachers");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao criar professor." };
  }
}

export async function updateTeacherAction(id: string, input: unknown): Promise<ActionResult> {
  await requireRole(["admin"]);
  const parsed = teacherSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    await teachersService.updateTeacher(id, parsed.data);
    revalidatePath("/teachers");
    revalidatePath(`/teachers/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao atualizar professor." };
  }
}

export async function deleteTeacherAction(id: string): Promise<ActionResult> {
  await requireRole(["admin"]);
  try {
    await teachersService.deleteTeacher(id);
    revalidatePath("/teachers");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao remover professor." };
  }
}

export async function addAvailabilitySlotAction(
  teacherId: string,
  input: unknown,
): Promise<ActionResult> {
  await requireRole(["admin", "teacher"]);
  const parsed = availabilitySlotSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    await teachersService.addAvailabilitySlot(teacherId, parsed.data);
    revalidatePath("/availability");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao adicionar horário." };
  }
}

export async function removeAvailabilitySlotAction(id: string): Promise<ActionResult> {
  await requireRole(["admin", "teacher"]);
  try {
    await teachersService.removeAvailabilitySlot(id);
    revalidatePath("/availability");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao remover horário." };
  }
}
