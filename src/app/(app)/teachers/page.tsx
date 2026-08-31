import Link from "next/link";
import { requireRole } from "@/features/auth/session";
import { listTeachers } from "@/services/teachers";
import { TeacherRowActions } from "@/components/teachers/teacher-row-actions";
import { AddTeacherButton } from "@/components/teachers/add-teacher-button";

export const metadata = { title: "Professores — Sistema de Gestão de Aulas" };

export default async function TeachersPage() {
  await requireRole(["admin"]);
  const teachers = await listTeachers();

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md border-b border-smoke pb-lg">
        <div>
          <h2 className="font-headline text-headline text-on-surface mb-base">Professores</h2>
          <p className="font-body text-body text-on-surface-variant">
            Gerencie o corpo docente, disponibilidade e aulas.
          </p>
        </div>
        <AddTeacherButton />
      </div>

      <div className="bg-surface-container-lowest border border-smoke rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-smoke">
              <th className="font-ui-label text-caption text-on-surface-variant py-sm px-md uppercase tracking-wider">
                Nome
              </th>
              <th className="font-ui-label text-caption text-on-surface-variant py-sm px-md uppercase tracking-wider">
                Email
              </th>
              <th className="font-ui-label text-caption text-on-surface-variant py-sm px-md uppercase tracking-wider">
                Telefone
              </th>
              <th className="font-ui-label text-caption text-on-surface-variant py-sm px-md uppercase tracking-wider text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="font-body text-body divide-y divide-smoke">
            {teachers.length === 0 && (
              <tr>
                <td colSpan={4} className="py-xl text-center text-on-surface-variant">
                  Nenhum professor cadastrado.
                </td>
              </tr>
            )}
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-mist-gray transition-colors">
                <td className="py-md px-md">
                  <Link href={`/teachers/${teacher.id}`} className="flex items-center gap-sm">
                    <span
                      className="size-8 rounded-full flex items-center justify-center font-ui-label text-ui-label text-on-primary"
                      style={{ backgroundColor: teacher.color ?? "#99c5ff" }}
                    >
                      {teacher.full_name
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </span>
                    <span className="font-ui-label text-on-surface">{teacher.full_name}</span>
                  </Link>
                </td>
                <td className="py-md px-md text-on-surface-variant">{teacher.email}</td>
                <td className="py-md px-md text-on-surface-variant">{teacher.phone ?? "—"}</td>
                <td className="py-md px-md text-right">
                  <TeacherRowActions teacher={teacher} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
