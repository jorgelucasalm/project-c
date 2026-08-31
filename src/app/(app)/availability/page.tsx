import { redirect } from "next/navigation";
import { requireProfile } from "@/features/auth/session";
import { createClient } from "@/lib/supabase/server";
import { listAvailability } from "@/services/teachers";
import { AvailabilityManager } from "@/components/teachers/availability-manager";
import { GoogleCalendarConnectCard } from "@/components/teachers/google-calendar-connect-card";
import { getGoogleCalendarStatus } from "@/lib/google-calendar/actions";

export const metadata = { title: "Disponibilidade — Sistema de Gestão de Aulas" };

export default async function AvailabilityPage() {
  const profile = await requireProfile();

  if (profile.role === "admin") {
    redirect("/teachers");
  }
  if (profile.role !== "teacher") {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const { data: teacher } = await supabase
    .from("teachers")
    .select("id, full_name")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (!teacher) {
    return (
      <div className="bg-surface-container-lowest border border-smoke rounded-lg p-lg">
        <p className="font-body text-body text-on-surface-variant">
          Seu usuário ainda não está vinculado a um cadastro de professor. Peça a um
          administrador para concluir a vinculação.
        </p>
      </div>
    );
  }

  const [slots, googleStatus] = await Promise.all([
    listAvailability(teacher.id),
    getGoogleCalendarStatus(teacher.id),
  ]);

  return (
    <>
      <div>
        <h2 className="font-headline text-headline text-on-surface mb-base">Disponibilidade</h2>
        <p className="font-body text-body text-on-surface-variant">
          Defina os horários em que você está disponível para dar aulas.
        </p>
      </div>

      <GoogleCalendarConnectCard status={googleStatus} />

      <div className="bg-surface-container-lowest border border-smoke rounded-lg p-lg">
        <AvailabilityManager teacherId={teacher.id} slots={slots} />
      </div>
    </>
  );
}
