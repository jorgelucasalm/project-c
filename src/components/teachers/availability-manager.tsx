"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  availabilitySlotSchema,
  type AvailabilitySlotInput,
  type AvailabilitySlotFormValues,
} from "@/schemas/teacher.schema";
import {
  addAvailabilitySlotAction,
  removeAvailabilitySlotAction,
} from "@/features/teachers/actions";
import type { TeacherAvailability } from "@/types/domain";

const WEEKDAY_LABELS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function AvailabilityManager({
  teacherId,
  slots,
}: {
  teacherId: string;
  slots: TeacherAvailability[];
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AvailabilitySlotFormValues, unknown, AvailabilitySlotInput>({
    resolver: zodResolver(availabilitySlotSchema),
    defaultValues: { weekday: 1, start_time: "08:00", end_time: "12:00" },
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    startTransition(async () => {
      const result = await addAvailabilitySlotAction(teacherId, values);
      if (result.success) {
        reset();
        router.refresh();
      } else {
        setServerError(result.error ?? "Erro ao adicionar horário.");
      }
    });
  });

  const grouped = WEEKDAY_LABELS.map((label, weekday) => ({
    label,
    weekday,
    items: slots.filter((s) => s.weekday === weekday),
  }));

  return (
    <div className="flex flex-col gap-lg">
      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-md">
        <div className="flex flex-col gap-base">
          <label className="font-ui-label text-ui-label text-on-surface-variant">Dia</label>
          <Select defaultValue="1" onValueChange={(v) => setValue("weekday", Number(v))}>
            <SelectTrigger className="w-40 rounded-[4px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WEEKDAY_LABELS.map((label, i) => (
                <SelectItem key={i} value={String(i)}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-base">
          <label className="font-ui-label text-ui-label text-on-surface-variant">Início</label>
          <Input type="time" className="rounded-[4px]" {...register("start_time")} />
        </div>
        <div className="flex flex-col gap-base">
          <label className="font-ui-label text-ui-label text-on-surface-variant">Fim</label>
          <Input type="time" className="rounded-[4px]" {...register("end_time")} />
          {errors.end_time && (
            <p className="font-caption text-caption text-error">{errors.end_time.message}</p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-primary text-on-primary rounded-[4px] hover:opacity-90"
        >
          Adicionar
        </Button>
      </form>
      {serverError && (
        <p className="font-body text-caption text-error bg-error-container rounded-[4px] px-sm py-2">
          {serverError}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {grouped.map((day) => (
          <div key={day.weekday} className="border border-smoke rounded-lg p-md bg-surface-container-lowest">
            <h4 className="font-ui-label text-ui-label text-primary mb-sm">{day.label}</h4>
            {day.items.length === 0 ? (
              <p className="font-body text-caption text-on-surface-variant">Sem disponibilidade.</p>
            ) : (
              <ul className="flex flex-col gap-xs">
                {day.items.map((slot) => (
                  <li
                    key={slot.id}
                    className="flex items-center justify-between bg-mist-gray rounded-[4px] px-sm py-1"
                  >
                    <span className="font-body text-caption text-on-surface">
                      {slot.start_time.slice(0, 5)} — {slot.end_time.slice(0, 5)}
                    </span>
                    <button
                      type="button"
                      className="text-on-surface-variant hover:text-error transition-colors"
                      onClick={() =>
                        startTransition(async () => {
                          await removeAvailabilitySlotAction(slot.id);
                          router.refresh();
                        })
                      }
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
