"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/features/auth/session";
import { createClient } from "@/lib/supabase/server";
import { isGoogleCalendarConfigured } from "@/lib/google-calendar/client";

export async function disconnectGoogleCalendarAction() {
  const profile = await requireRole(["teacher", "admin"]);
  const supabase = await createClient();

  const { data: teacher } = await supabase
    .from("teachers")
    .select("id")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (teacher) {
    await supabase.from("calendar_integrations").delete().eq("teacher_id", teacher.id);
  }

  revalidatePath("/availability");
}

export async function getGoogleCalendarStatus(teacherId: string | null) {
  if (!teacherId || !isGoogleCalendarConfigured()) {
    return { configured: isGoogleCalendarConfigured(), connected: false };
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("calendar_integrations")
    .select("id")
    .eq("teacher_id", teacherId)
    .maybeSingle();

  return { configured: true, connected: Boolean(data) };
}
