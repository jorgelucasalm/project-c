import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { toast } from "sonner";

import type { Lesson } from "@/lib/mock-data";
import { statusColor, studentName, teacherName } from "@/lib/mock-data";

export default function SchoolCalendar({
  lessons,
  onSelectLesson,
  onMoveLesson,
  onCreate,
}: {
  lessons: Lesson[];
  onSelectLesson: (lesson: Lesson) => void;
  onMoveLesson: (id: string, start: string, end: string) => void;
  onCreate: (startIso: string) => void;
}) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      buttonText={{ today: "Today", month: "Month", week: "Week", day: "Day" }}
      height="auto"
      nowIndicator
      editable
      droppable
      eventResizableFromStart
      selectable
      slotMinTime="07:00:00"
      slotMaxTime="21:00:00"
      allDaySlot={false}
      expandRows
      slotDuration="00:30:00"
      firstDay={1}
      events={lessons.map((l) => ({
        id: l.id,
        title: `${studentName(l.studentId)} · ${l.type}`,
        start: l.start,
        end: l.end,
        backgroundColor: statusColor[l.status],
        borderColor: statusColor[l.status],
        textColor: "#fff",
        extendedProps: { lesson: l },
      }))}
      eventContent={(arg) => {
        const lesson = arg.event.extendedProps.lesson as Lesson;
        return (
          <div className="overflow-hidden px-1.5 py-1 leading-tight text-white">
            <p className="truncate text-[11px] font-semibold">{studentName(lesson.studentId)}</p>
            <p className="truncate text-[10px] opacity-90">
              {teacherName(lesson.teacherId)} · {lesson.type}
            </p>
            <p className="truncate text-[10px] uppercase tracking-wide opacity-80">{lesson.status}</p>
          </div>
        );
      }}
      eventClick={(info) => onSelectLesson(info.event.extendedProps.lesson as Lesson)}
      eventDrop={(info) => {
        onMoveLesson(info.event.id, info.event.startStr, info.event.endStr);
        toast.success("Lesson rescheduled");
      }}
      eventResize={(info) => {
        onMoveLesson(info.event.id, info.event.startStr, info.event.endStr);
        toast.success("Lesson duration updated");
      }}
      select={(info) => onCreate(info.startStr)}
    />
  );
}
