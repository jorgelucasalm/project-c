import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types/domain";
import type { PlanInput } from "@/schemas/plan.schema";

export async function listPlans() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Plan[];
}

export async function createPlan(input: PlanInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("plans").insert(input).select("*").single();
  if (error) throw new Error(error.message);
  return data as Plan;
}

export async function updatePlan(id: string, input: PlanInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plans")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as Plan;
}

export async function deletePlan(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("plans").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
