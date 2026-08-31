import Link from "next/link";
import {
  Users,
  CalendarDays,
  Rocket,
  Wallet,
  TrendingUp,
  Clock,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { requireProfile } from "@/features/auth/session";
import { getDashboardMetrics } from "@/services/dashboard";
import { getTodayLessons } from "@/services/lessons";
import { listStudents } from "@/services/students";
import { MetricCard } from "@/components/dashboard/metric-card";
import { StatusBadge } from "@/components/students/status-badge";
import { formatCentsToBRL } from "@/lib/format";
import { NewClassButton } from "@/components/lessons/new-class-button";

export const metadata = { title: "Dashboard — Sistema de Gestão de Aulas" };

export default async function DashboardPage() {
  await requireProfile();
  const [metrics, todayLessons, recentStudents] = await Promise.all([
    getDashboardMetrics(),
    getTodayLessons(),
    listStudents({ page: 1, pageSize: 4 }),
  ]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h2 className="font-headline text-headline text-primary">Overview</h2>
          <p className="font-body text-body text-on-surface-variant mt-xs">
            Aqui está o que está acontecendo na sua escola hoje.
          </p>
        </div>
        <NewClassButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        <MetricCard
          label="Alunos Ativos"
          value={String(metrics.activeStudents)}
          icon={Users}
          hint="+5% este mês"
          hintIcon={TrendingUp}
          hintClassName="text-sky-pop"
        />
        <MetricCard
          label="Aulas Hoje"
          value={String(metrics.lessonsToday)}
          icon={CalendarDays}
          hint={metrics.nextLessonTime ? `Próxima às ${metrics.nextLessonTime}` : "Sem próximas aulas"}
          hintIcon={Clock}
        />
        <MetricCard
          label="Aulas Trial"
          value={String(metrics.trialLessons)}
          icon={Rocket}
          hint={`${metrics.trialAwaitingConversion} aguardando conversão`}
          accent
        />
        <MetricCard
          label="Receita Mensal"
          value={formatCentsToBRL(metrics.monthlyRevenueCents)}
          icon={Wallet}
          hint="+12% vs mês anterior"
          hintIcon={TrendingUp}
          hintClassName="text-secondary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-1 bg-surface-container-lowest border border-smoke rounded-lg p-lg">
          <div className="flex justify-between items-center mb-md pb-sm border-b border-smoke">
            <h3 className="font-headline text-subheading text-primary">Aulas de Hoje</h3>
            <Link href="/calendar" className="font-ui-label text-caption text-primary underline">
              Ver todas
            </Link>
          </div>
          {todayLessons.length === 0 ? (
            <p className="font-body text-caption text-on-surface-variant py-md">
              Nenhuma aula agendada para hoje.
            </p>
          ) : (
            <ul className="space-y-md">
              {/* Server Component rendered fresh per request — no client-side
                  re-render/memoization concerns from reading the clock here. */}
              {todayLessons.map((lesson) => {
                // eslint-disable-next-line react-hooks/purity
                const isPast = new Date(lesson.ends_at).getTime() < Date.now();
                return (
                  <li
                    key={lesson.id}
                    className="flex items-start gap-md group cursor-pointer p-sm -mx-sm rounded-lg hover:bg-mist-gray transition-colors"
                    style={isPast ? { opacity: 0.6 } : undefined}
                  >
                    <div className="min-w-16 text-center">
                      <p className="font-ui-label text-ui-label text-primary">
                        {new Date(lesson.starts_at).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="font-body text-caption text-on-surface-variant">
                        {isPast
                          ? "Finalizada"
                          : `${Math.round((new Date(lesson.ends_at).getTime() - new Date(lesson.starts_at).getTime()) / 60000)}min`}
                      </p>
                    </div>
                    <div className="w-1 bg-smoke h-12 rounded-full group-hover:bg-primary transition-colors" />
                    <div>
                      <p
                        className="font-ui-label text-ui-label text-primary"
                        style={isPast ? { textDecoration: "line-through" } : undefined}
                      >
                        {lesson.student?.full_name ?? "Aula"}
                      </p>
                      <p className="font-body text-caption text-on-surface-variant">
                        com {lesson.teacher?.full_name}
                      </p>
                      {!isPast && (
                        <div className="inline-block mt-xs bg-sky-pop/20 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          {lesson.location === "online" ? "Online" : "Presencial"}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="lg:col-span-2 bg-surface-container-lowest border border-smoke rounded-lg overflow-hidden flex flex-col">
          <div className="p-lg border-b border-smoke flex justify-between items-center">
            <h3 className="font-headline text-subheading text-primary">Alunos Recentes</h3>
            <div className="flex gap-sm">
              <button type="button" className="text-on-surface-variant hover:text-primary p-xs rounded hover:bg-mist-gray">
                <Filter className="size-5" />
              </button>
              <button type="button" className="text-on-surface-variant hover:text-primary p-xs rounded hover:bg-mist-gray">
                <MoreHorizontal className="size-5" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-mist-gray/50 border-b border-smoke">
                  <th className="p-md font-ui-label text-caption text-on-surface-variant uppercase tracking-wider">
                    Nome do Aluno
                  </th>
                  <th className="p-md font-ui-label text-caption text-on-surface-variant uppercase tracking-wider">
                    Plano
                  </th>
                  <th className="p-md font-ui-label text-caption text-on-surface-variant uppercase tracking-wider">
                    Data de Ingresso
                  </th>
                  <th className="p-md font-ui-label text-caption text-on-surface-variant uppercase tracking-wider text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-smoke">
                {recentStudents.items.map((student) => (
                  <tr key={student.id} className="hover:bg-mist-gray/30 transition-colors">
                    <td className="p-md">
                      <div>
                        <p className="font-ui-label text-ui-label text-primary">{student.full_name}</p>
                        <p className="font-body text-caption text-on-surface-variant">{student.email}</p>
                      </div>
                    </td>
                    <td className="p-md font-body text-body text-primary">
                      {student.active_plan_name ?? "—"}
                    </td>
                    <td className="p-md font-body text-body text-on-surface-variant">
                      {new Date(student.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-md text-right">
                      <StatusBadge status={student.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
