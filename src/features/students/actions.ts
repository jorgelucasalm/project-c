"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/features/auth/session";
import { studentSchema } from "@/schemas/student.schema";
import * as studentsService from "@/services/students";
import type { ActionResult } from "@/features/scheduling/actions";

export async function createStudentAction(input: unknown): Promise<ActionResult> {
  await requireRole(["admin"]);
  const parsed = studentSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    await studentsService.createStudent(parsed.data);
    revalidatePath("/students");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao criar aluno." };
  }
}

export async function updateStudentAction(id: string, input: unknown): Promise<ActionResult> {
  await requireRole(["admin"]);
  const parsed = studentSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    await studentsService.updateStudent(id, parsed.data);
    revalidatePath("/students");
    revalidatePath(`/students/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao atualizar aluno." };
  }
}

export async function deleteStudentAction(id: string): Promise<ActionResult> {
  await requireRole(["admin"]);
  try {
    await studentsService.deleteStudent(id);
    revalidatePath("/students");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao remover aluno." };
  }
}
