"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDateTime, toDatetimeLocalValue } from "@/lib/format";
import {
  cancelLessonAction,
  rescheduleLessonAction,
  markAttendanceAction,
} from "@/features/scheduling/actions";
import type { CalendarEvent } from "@/features/scheduling/queries";

interface LessonDetailDialogProps {
  event: CalendarEvent | null;
  onOpenChange: (open: boolean) => void;
  onChanged: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: "Agendada",
  rescheduled: "Reagendada",
  completed: "Concluída",
  canceled: "Cancelada",
  no_show: "Falta",
};

export function LessonDetailDialog({ event, onOpenChange, onChanged }: LessonDetailDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [rescheduling, setRescheduling] = useState(false);
  const [newStart, setNewStart] = useState("");

  if (!event) return null;
  const durationMinutes = Math.round(
    (new Date(event.end).getTime() - new Date(event.start).getTime()) / 60000,
  );
  const canManage = event.status !== "canceled" && event.status !== "completed";

  const run = (fn: () => Promise<{ success: boolean; error?: string }>) => {
    setError(null);
    startTransition(async () => {
      const result = await fn();
      if (result.success) {
        onChanged();
        onOpenChange(false);
      } else {
        setError(result.error ?? "Erro ao processar ação.");
      }
    });
  };

  return (
    <Dialog open={Boolean(event)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[28rem] bg-surface-container-lowest">
        <DialogHeader>
          <DialogTitle className="font-headline text-headline-sm text-primary">
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-sm font-body text-body text-on-surface-variant">
          <p>
            <span className="text-on-surface font-ui-label">Professor:</span> {event.teacherName}
          </p>
          <p>
            <span className="text-on-surface font-ui-label">Horário:</span>{" "}
            {formatDateTime(event.start)} ({durationMinutes} min)
          </p>
          <p>
            <span className="text-on-surface font-ui-label">Status:</span>{" "}
            {STATUS_LABELS[event.status] ?? event.status}
          </p>
        </div>

        {error && (
          <p className="font-body text-caption text-error bg-error-container rounded-[4px] px-sm py-2">
            {error}
          </p>
        )}

        {rescheduling && (
          <div className="flex flex-col gap-base">
            <label className="font-ui-label text-ui-label text-on-surface-variant">
              Novo horário
            </label>
            <Input
              type="datetime-local"
              defaultValue={toDatetimeLocalValue(event.start)}
              onChange={(e) => setNewStart(e.target.value)}
              className="rounded-[4px]"
            />
          </div>
        )}

        {canManage && event.studentId && (
          <div className="flex gap-sm">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              className="rounded-[4px] flex-1"
              onClick={() =>
                run(() =>
                  markAttendanceAction({
                    lesson_id: event.id,
                    student_id: event.studentId,
                    status: "present",
                  }),
                )
              }
            >
              Marcar Presença
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              className="rounded-[4px] flex-1"
              onClick={() =>
                run(() =>
                  markAttendanceAction({
                    lesson_id: event.id,
                    student_id: event.studentId,
                    status: "absent",
                  }),
                )
              }
            >
              Marcar Falta
            </Button>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-sm">
          {canManage && !rescheduling && (
            <Button
              type="button"
              variant="outline"
              className="rounded-[4px]"
              onClick={() => setRescheduling(true)}
            >
              Reagendar
            </Button>
          )}
          {rescheduling && (
            <Button
              type="button"
              disabled={isPending || !newStart}
              className="bg-primary text-on-primary rounded-[4px]"
              onClick={() =>
                run(() =>
                  rescheduleLessonAction({
                    lesson_id: event.id,
                    starts_at: new Date(newStart).toISOString(),
                    duration_minutes: durationMinutes,
                  }),
                )
              }
            >
              Confirmar novo horário
            </Button>
          )}
          {canManage && (
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              className="rounded-[4px]"
              onClick={() => run(() => cancelLessonAction(event.id))}
            >
              Cancelar Aula
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
