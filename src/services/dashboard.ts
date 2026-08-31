import { createClient } from "@/lib/supabase/server";

export interface DashboardMetrics {
  activeStudents: number;
  lessonsToday: number;
  nextLessonTime: string | null;
  trialLessons: number;
  trialAwaitingConversion: number;
  monthlyRevenueCents: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    { count: activeStudents },
    { data: todayLessons },
    { count: trialLessons },
    { count: trialPending },
    { data: activeSubs },
  ] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase
      .from("lessons")
      .select("starts_at")
      .gte("starts_at", startOfDay.toISOString())
      .lte("starts_at", endOfDay.toISOString())
      .order("starts_at", { ascending: true }),
    supabase
      .from("lessons")
      .select("id", { count: "exact", head: true })
      .eq("type", "trial")
      .gte("starts_at", startOfMonth.toISOString()),
    supabase
      .from("students")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("subscriptions")
      .select("plans(price_cents)")
      .eq("status", "active")
      .gte("started_at", startOfMonth.toISOString()),
  ]);

  const nextLesson = todayLessons?.find(
    (l) => new Date(l.starts_at).getTime() >= Date.now(),
  );

  const monthlyRevenueCents = (
    (activeSubs as unknown as { plans: { price_cents: number } | null }[]) ?? []
  ).reduce((sum, s) => sum + (s.plans?.price_cents ?? 0), 0);

  return {
    activeStudents: activeStudents ?? 0,
    lessonsToday: todayLessons?.length ?? 0,
    nextLessonTime: nextLesson
      ? new Date(nextLesson.starts_at).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null,
    trialLessons: trialLessons ?? 0,
    trialAwaitingConversion: trialPending ?? 0,
    monthlyRevenueCents,
  };
}
