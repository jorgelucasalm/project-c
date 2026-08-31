import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { requireRole } from "@/features/auth/session";
import { getStudentById, getStudentLessons } from "@/services/students";
import { StatusBadge } from "@/components/students/status-badge";
import { formatDateTime } from "@/lib/format";

export const metadata = { title: "Detalhes do Aluno — Sistema de Gestão de Aulas" };

const ATTENDANCE_LABELS: Record<string, { label: string; className: string }> = {
  present: { label: "Presente", className: "bg-surface-container-highest text-on-surface" },
  absent: { label: "Falta", className: "bg-error-container text-on-error-container" },
  excused: { label: "Justificada", className: "bg-secondary-fixed text-on-secondary-fixed" },
};

const LESSON_STATUS_LABELS: Record<string, string> = {
  scheduled: "Agendada",
  completed: "Concluída",
  canceled: "Cancelada",
  no_show: "Falta",
  rescheduled: "Reagendada",
};

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["admin", "teacher"]);
  const { id } = await params;

  let student;
  try {
    student = await getStudentById(id);
  } catch {
    notFound();
  }

  const lessons = await getStudentLessons(id);

  return (
    <>
      <div className="flex items-center gap-sm">
        <Link
          href="/students"
          className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs font-ui-label text-ui-label"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-1 bg-surface-container-lowest border border-smoke rounded-lg p-lg flex flex-col gap-md">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-headline-sm text-primary">{student.full_name}</h2>
            <StatusBadge status={student.status} />
          </div>
          <div className="flex flex-col gap-sm font-body text-body text-on-surface-variant">
            <p className="flex items-center gap-sm">
              <Mail className="size-4" /> {student.email}
            </p>
            {student.phone && (
              <p className="flex items-center gap-sm">
                <Phone className="size-4" /> {student.phone}
              </p>
            )}
          </div>
          {student.level && (
            <p className="font-ui-label text-caption text-on-surface-variant">
              Nível: <span className="text-on-surface">{student.level}</span>
            </p>
          )}
          {student.notes && (
            <p className="font-body text-caption text-on-surface-variant border-t border-smoke pt-md">
              {student.notes}
            </p>
          )}
        </div>

        <div className="lg:col-span-2 bg-surface-container-lowest border border-smoke rounded-lg overflow-hidden">
          <div className="p-lg border-b border-smoke">
            <h3 className="font-headline text-subheading text-primary">
              Histórico de Aulas e Presença
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-mist-gray/50 border-b border-smoke">
                  <th className="p-md font-ui-label text-caption text-on-surface-variant uppercase tracking-wider">
                    Data
                  </th>
                  <th className="p-md font-ui-label text-caption text-on-surface-variant uppercase tracking-wider">
                    Professor
                  </th>
                  <th className="p-md font-ui-label text-caption text-on-surface-variant uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-md font-ui-label text-caption text-on-surface-variant uppercase tracking-wider text-right">
                    Presença
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-smoke">
                {lessons.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-lg text-center font-body text-body text-on-surface-variant">
                      Nenhuma aula registrada ainda.
                    </td>
                  </tr>
                )}
                {(
                  lessons as unknown as {
                    id: string;
                    starts_at: string;
                    status: string;
                    teachers: { full_name: string } | null;
                    attendance: { status: string }[];
                  }[]
                ).map((lesson) => {
                  const attendance = lesson.attendance?.[0];
                  const attendanceInfo = attendance ? ATTENDANCE_LABELS[attendance.status] : null;
                  return (
                    <tr key={lesson.id} className="hover:bg-mist-gray/30 transition-colors">
                      <td className="p-md font-body text-body text-primary">
                        {formatDateTime(lesson.starts_at)}
                      </td>
                      <td className="p-md font-body text-body text-on-surface-variant">
                        {lesson.teachers?.full_name ?? "—"}
                      </td>
                      <td className="p-md font-body text-body text-on-surface-variant">
                        {LESSON_STATUS_LABELS[lesson.status] ?? lesson.status}
                      </td>
                      <td className="p-md text-right">
                        {attendanceInfo ? (
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-caption font-ui-label border border-smoke ${attendanceInfo.className}`}
                          >
                            {attendanceInfo.label}
                          </span>
                        ) : (
                          <span className="font-body text-caption text-on-surface-variant">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
