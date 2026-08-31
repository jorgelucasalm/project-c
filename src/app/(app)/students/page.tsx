import { requireRole } from "@/features/auth/session";
import { listStudents } from "@/services/students";
import { listPlans } from "@/services/plans";
import { listTeachers } from "@/services/teachers";
import { StudentsFilters } from "@/components/students/students-filters";
import { StatusBadge } from "@/components/students/status-badge";
import { StudentRowActions } from "@/components/students/student-row-actions";
import { Pagination } from "@/components/students/pagination";
import { AddStudentButton } from "@/components/students/add-student-button";
import { formatCentsToBRL } from "@/lib/format";
import type { StudentStatus } from "@/types/domain";

export const metadata = { title: "Alunos — Sistema de Gestão de Aulas" };

const STUDENT_TYPE_LABELS: Record<string, string> = {
  adult: "Adulto",
  teen: "Adolescente",
  kids: "Kids",
};

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const AVATAR_BG_CYCLE = ["bg-secondary-fixed text-on-secondary-fixed", "bg-tertiary-fixed text-on-tertiary-fixed", "bg-primary-fixed text-on-primary-fixed"];

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireRole(["admin", "teacher"]);
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;

  const [{ items, total, pageSize }, plans, teachers] = await Promise.all([
    listStudents({
      search: params.search,
      status: (params.status as StudentStatus) || undefined,
      planId: params.planId,
      teacherId: params.teacherId,
      page,
    }),
    listPlans(),
    listTeachers(),
  ]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md border-b border-smoke pb-lg">
        <div>
          <h2 className="font-headline text-headline text-on-surface mb-base">Alunos</h2>
          <p className="font-body text-body text-on-surface-variant">
            Gerencie matrículas, planos e status dos estudantes.
          </p>
        </div>
        <AddStudentButton
          plans={plans.map((p) => ({ id: p.id, name: p.name }))}
          teachers={teachers.map((t) => ({ id: t.id, full_name: t.full_name }))}
        />
      </div>

      <StudentsFilters
        plans={plans.map((p) => ({ id: p.id, name: p.name }))}
        teachers={teachers.map((t) => ({ id: t.id, full_name: t.full_name }))}
      />

      <div className="bg-surface-container-lowest border border-smoke rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-smoke">
                <th className="font-ui-label text-caption text-on-surface-variant py-sm px-md uppercase tracking-wider">
                  Nome
                </th>
                <th className="font-ui-label text-caption text-on-surface-variant py-sm px-md uppercase tracking-wider">
                  Tipo
                </th>
                <th className="font-ui-label text-caption text-on-surface-variant py-sm px-md uppercase tracking-wider">
                  Plano
                </th>
                <th className="font-ui-label text-caption text-on-surface-variant py-sm px-md uppercase tracking-wider">
                  Valor
                </th>
                <th className="font-ui-label text-caption text-on-surface-variant py-sm px-md uppercase tracking-wider">
                  Status
                </th>
                <th className="font-ui-label text-caption text-on-surface-variant py-sm px-md uppercase tracking-wider text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="font-body text-body divide-y divide-smoke">
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-xl text-center text-on-surface-variant font-body text-body">
                    Nenhum aluno encontrado.
                  </td>
                </tr>
              )}
              {items.map((student, index) => (
                <tr key={student.id} className="hover:bg-mist-gray transition-colors">
                  <td className="py-md px-md">
                    <div className="flex items-center gap-sm">
                      <div
                        className={`size-8 rounded-full flex items-center justify-center font-ui-label text-ui-label ${AVATAR_BG_CYCLE[index % AVATAR_BG_CYCLE.length]}`}
                      >
                        {initialsOf(student.full_name)}
                      </div>
                      <span className="font-ui-label text-on-surface">{student.full_name}</span>
                    </div>
                  </td>
                  <td className="py-md px-md text-on-surface-variant">
                    {STUDENT_TYPE_LABELS[student.student_type]}
                  </td>
                  <td className="py-md px-md text-on-surface-variant">
                    {student.active_plan_name ?? "—"}
                  </td>
                  <td className="py-md px-md text-on-surface-variant">
                    {student.active_plan_price_cents ? formatCentsToBRL(student.active_plan_price_cents) : "—"}
                  </td>
                  <td className="py-md px-md">
                    <StatusBadge status={student.status} />
                  </td>
                  <td className="py-md px-md text-right">
                    <StudentRowActions
                      student={student}
                      plans={plans.map((p) => ({ id: p.id, name: p.name }))}
                      teachers={teachers.map((t) => ({ id: t.id, full_name: t.full_name }))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageSize={pageSize} total={total} basePath="/students" searchParams={params} />
      </div>
    </>
  );
}
