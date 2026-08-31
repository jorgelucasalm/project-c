import { requireRole } from "@/features/auth/session";
import { getTodayLessons } from "@/services/lessons";
import { SchoolCalendar } from "@/components/calendar/school-calendar";
import { formatTime } from "@/lib/format";

export const metadata = { title: "Calendário — Sistema de Gestão de Aulas" };

export default async function CalendarPage() {
  await requireRole(["admin", "teacher"]);
  const todayLessons = await getTodayLessons();

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-lg -m-lg md:-m-xxl p-md md:p-lg bg-mist-gray">
      <div className="flex-1 flex flex-col min-h-[70vh]">
        <SchoolCalendar />
      </div>

      <div className="w-full xl:w-80 flex flex-col gap-lg">
        <div className="bg-surface-container-lowest border border-smoke rounded-xl flex-1 p-md flex flex-col">
          <h3 className="font-subheading text-ui-label text-primary mb-md pb-xs border-b border-smoke">
            Próximas Aulas (Hoje)
          </h3>
          {todayLessons.length === 0 ? (
            <p className="font-body text-caption text-on-surface-variant">
              Nenhuma aula agendada para hoje.
            </p>
          ) : (
            <div className="flex flex-col gap-md flex-1 overflow-y-auto">
              {todayLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-surface border border-smoke rounded-lg p-sm relative overflow-hidden group hover:border-primary transition-colors"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-signal-yellow" />
                  <div className="flex justify-between items-start pl-sm">
                    <div>
                      <h4 className="font-ui-label text-body text-primary">
                        {lesson.student?.full_name ?? "Aula experimental"}
                      </h4>
                      <p className="font-caption text-caption text-on-surface-variant mt-1">
                        {formatTime(lesson.starts_at)} - {formatTime(lesson.ends_at)}
                      </p>
                    </div>
                    {lesson.student?.level && (
                      <span className="bg-mist-gray px-xs py-[2px] rounded text-[10px] font-ui-label text-on-surface-variant border border-smoke">
                        {lesson.student.level}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
