import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { requireRole } from "@/features/auth/session";
import { getTeacherById, listAvailability } from "@/services/teachers";
import { AvailabilityManager } from "@/components/teachers/availability-manager";
import { GoogleCalendarConnectCard } from "@/components/teachers/google-calendar-connect-card";
import { getGoogleCalendarStatus } from "@/lib/google-calendar/actions";

export const metadata = { title: "Detalhes do Professor — Sistema de Gestão de Aulas" };

export default async function TeacherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["admin"]);
  const { id } = await params;

  let teacher;
  try {
    teacher = await getTeacherById(id);
  } catch {
    notFound();
  }

  const [slots, googleStatus] = await Promise.all([
    listAvailability(id),
    getGoogleCalendarStatus(id),
  ]);

  return (
    <>
      <Link
        href="/teachers"
        className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs font-ui-label text-ui-label w-fit"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      <div className="bg-surface-container-lowest border border-smoke rounded-lg p-lg flex flex-col gap-md">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-headline-sm text-primary">{teacher.full_name}</h2>
        </div>
        <div className="flex flex-col gap-sm font-body text-body text-on-surface-variant">
          <p className="flex items-center gap-sm">
            <Mail className="size-4" /> {teacher.email}
          </p>
          {teacher.phone && (
            <p className="flex items-center gap-sm">
              <Phone className="size-4" /> {teacher.phone}
            </p>
          )}
        </div>
        {teacher.bio && <p className="font-body text-caption text-on-surface-variant">{teacher.bio}</p>}
      </div>

      <GoogleCalendarConnectCard status={googleStatus} />

      <div className="bg-surface-container-lowest border border-smoke rounded-lg p-lg">
        <h3 className="font-headline text-subheading text-primary mb-md">Disponibilidade</h3>
        <AvailabilityManager teacherId={id} slots={slots} />
      </div>
    </>
  );
}
