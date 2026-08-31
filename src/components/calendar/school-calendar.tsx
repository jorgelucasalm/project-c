"use client";

import { useCallback, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type {
  EventClickArg,
  EventDropArg,
  DatesSetArg,
  EventSourceFuncArg,
} from "@fullcalendar/core";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { getCalendarEventsAction, type CalendarEvent } from "@/features/scheduling/queries";
import { rescheduleLessonAction } from "@/features/scheduling/actions";
import { LessonFormDialog } from "@/components/lessons/lesson-form-dialog";
import { LessonDetailDialog } from "@/components/lessons/lesson-detail-dialog";

/**
 * FullCalendar wired directly to Supabase (via server actions): month/week/day
 * views, click-to-create, click-to-manage (reschedule/cancel/attendance),
 * and native drag-to-reschedule.
 */
export function SchoolCalendar() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [defaultStart, setDefaultStart] = useState<string | undefined>(undefined);

  const refetch = useCallback(() => {
    calendarRef.current?.getApi().refetchEvents();
  }, []);

  const handleDatesSet = useCallback(async (arg: DatesSetArg) => {
    // no-op: events() callback below handles fetching per range automatically
    void arg;
  }, []);

  const handleEventClick = useCallback((arg: EventClickArg) => {
    const props = arg.event.extendedProps as Omit<
      CalendarEvent,
      "id" | "start" | "end" | "title"
    >;
    setSelectedEvent({
      id: arg.event.id,
      title: arg.event.title,
      start: arg.event.startStr,
      end: arg.event.endStr,
      ...props,
    });
  }, []);

  const handleDateClick = useCallback((arg: { dateStr: string }) => {
    setDefaultStart(arg.dateStr.slice(0, 16));
    setCreateOpen(true);
  }, []);

  const handleEventDrop = useCallback(async (arg: EventDropArg) => {
    const durationMinutes = Math.round(
      (arg.event.end!.getTime() - arg.event.start!.getTime()) / 60000,
    );
    const result = await rescheduleLessonAction({
      lesson_id: arg.event.id,
      starts_at: arg.event.start!.toISOString(),
      duration_minutes: durationMinutes,
    });
    if (!result.success) {
      arg.revert();
      window.alert(result.error ?? "Não foi possível reagendar.");
    }
  }, []);

  return (
    <div className="bg-surface-container-lowest border border-smoke rounded-lg p-md flex-1 flex flex-col fc-wrapper">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={ptBrLocale}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        buttonText={{ today: "Hoje", month: "Mês", week: "Semana", day: "Dia" }}
        height="auto"
        editable
        selectable
        nowIndicator
        slotMinTime="07:00:00"
        slotMaxTime="21:00:00"
        allDaySlot={false}
        events={async (info: EventSourceFuncArg) => {
          return getCalendarEventsAction(info.startStr, info.endStr);
        }}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        eventDrop={handleEventDrop}
        datesSet={handleDatesSet}
      />

      <LessonFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultStartsAt={defaultStart}
        onCreated={refetch}
      />
      <LessonDetailDialog
        event={selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
        onChanged={refetch}
      />
    </div>
  );
}
