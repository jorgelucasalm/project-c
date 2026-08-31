"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/features/auth/session";
import { planSchema } from "@/schemas/plan.schema";
import * as plansService from "@/services/plans";
import type { ActionResult } from "@/features/scheduling/actions";

export async function createPlanAction(input: unknown): Promise<ActionResult> {
  await requireRole(["admin"]);
  const parsed = planSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    await plansService.createPlan(parsed.data);
    revalidatePath("/plans");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao criar plano." };
  }
}

export async function updatePlanAction(id: string, input: unknown): Promise<ActionResult> {
  await requireRole(["admin"]);
  const parsed = planSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    await plansService.updatePlan(id, parsed.data);
    revalidatePath("/plans");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao atualizar plano." };
  }
}

export async function deletePlanAction(id: string): Promise<ActionResult> {
  await requireRole(["admin"]);
  try {
    await plansService.deletePlan(id);
    revalidatePath("/plans");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao remover plano." };
  }
}
