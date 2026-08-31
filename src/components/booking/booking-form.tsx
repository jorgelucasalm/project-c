"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trialBookingSchema, type TrialBookingFormValues, type TrialBookingInput } from "@/schemas/booking.schema";
import {
  bookTrialLessonAction,
  getAvailableSlotsAction,
} from "@/features/scheduling/booking-actions";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  teachers: { id: string; full_name: string }[];
}

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const DURATION_MINUTES = 60;

function nextDays(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });
}

export function BookingForm({ teachers }: BookingFormProps) {
  const days = useMemo(() => nextDays(7), []);
  const [teacherId, setTeacherId] = useState(teachers[0]?.id ?? "");
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [slots, setSlots] = useState<{ slotStart: string; slotEnd: string }[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TrialBookingFormValues, unknown, TrialBookingInput>({
    resolver: zodResolver(trialBookingSchema),
    defaultValues: { duration_minutes: DURATION_MINUTES, phone: "" },
  });

  useEffect(() => {
    if (!teacherId) return;
    let cancelled = false;

    async function loadSlots() {
      setSelectedSlot(null);
      setLoadingSlots(true);
      try {
        const dayStr = selectedDay.toISOString().slice(0, 10);
        const result = await getAvailableSlotsAction(teacherId, dayStr, DURATION_MINUTES);
        if (!cancelled) setSlots(result);
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    }

    loadSlots();
    return () => {
      cancelled = true;
    };
  }, [teacherId, selectedDay]);

  useEffect(() => {
    setValue("teacher_id", teacherId);
  }, [teacherId, setValue]);

  useEffect(() => {
    if (selectedSlot) setValue("starts_at", selectedSlot);
  }, [selectedSlot, setValue]);

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    startTransition(async () => {
      const result = await bookTrialLessonAction(values);
      if (result.success) {
        setSuccess(true);
      } else {
        setServerError(result.error ?? "Não foi possível confirmar o agendamento.");
      }
    });
  });

  if (success) {
    return (
      <div className="max-w-3xl mx-auto bg-surface-container-lowest border border-smoke rounded-xl p-lg md:p-xl text-center flex flex-col items-center gap-md">
        <CheckCircle2 className="size-12 text-primary" />
        <h2 className="font-headline text-headline text-primary">Aula confirmada!</h2>
        <p className="font-body text-body text-on-surface-variant">
          Enviamos os detalhes da sua aula experimental para o seu email. Nos vemos em breve!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-surface-container-lowest border border-smoke rounded-xl p-lg md:p-xl">
      <h2 className="font-headline text-headline text-primary mb-xl">Selecione seu horário</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-xl">
        <div>
          <h3 className="font-subheading text-subheading text-primary mb-md">
            1. Escolha uma data e horário
          </h3>

          {teachers.length > 1 && (
            <div className="mb-md flex flex-col gap-base max-w-xs">
              <Label className="font-ui-label text-ui-label text-on-surface-variant">
                Professor
              </Label>
              <Select value={teacherId} onValueChange={setTeacherId}>
                <SelectTrigger className="w-full rounded-[4px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-sm overflow-x-auto pb-sm mb-md no-scrollbar">
            {days.map((day) => {
              const active = day.toDateString() === selectedDay.toDateString();
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "flex flex-col items-center min-w-[80px] p-sm border rounded-lg transition-colors",
                    active
                      ? "border-2 border-primary bg-mist-gray"
                      : "border-smoke hover:border-pewter hover:bg-surface-container-low",
                  )}
                >
                  <span
                    className={cn(
                      "font-ui-label text-ui-label",
                      active ? "text-primary" : "text-on-surface-variant",
                    )}
                  >
                    {WEEKDAY_LABELS[day.getDay()]}
                  </span>
                  <span className="font-headline text-headline-sm text-primary">
                    {day.getDate()}
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant">
                    {day.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-sm">
            {loadingSlots && (
              <p className="col-span-full font-body text-caption text-on-surface-variant">
                Carregando horários...
              </p>
            )}
            {!loadingSlots && slots.length === 0 && (
              <p className="col-span-full font-body text-caption text-on-surface-variant">
                Nenhum horário livre nesse dia. Escolha outra data.
              </p>
            )}
            {slots.map((slot) => {
              const active = selectedSlot === slot.slotStart;
              return (
                <button
                  key={slot.slotStart}
                  type="button"
                  onClick={() => setSelectedSlot(slot.slotStart)}
                  className={cn(
                    "rounded py-2 font-ui-label text-ui-label transition-colors",
                    active
                      ? "border-2 border-primary bg-mist-gray text-primary"
                      : "border border-smoke text-primary hover:border-primary hover:bg-mist-gray",
                  )}
                >
                  {new Date(slot.slotStart).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </button>
              );
            })}
          </div>
          {errors.starts_at && (
            <p className="font-caption text-caption text-error mt-sm">{errors.starts_at.message}</p>
          )}
        </div>

        <hr className="border-smoke" />

        <div>
          <h3 className="font-subheading text-subheading text-primary mb-md">2. Seus Dados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="flex flex-col gap-base">
              <Label htmlFor="name" className="font-ui-label text-ui-label text-on-surface-variant">
                Nome Completo
              </Label>
              <Input
                id="name"
                className="rounded-[4px]"
                placeholder="Ex: Maria Silva"
                {...register("full_name")}
              />
              {errors.full_name && (
                <p className="font-caption text-caption text-error">{errors.full_name.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-base">
              <Label htmlFor="email" className="font-ui-label text-ui-label text-on-surface-variant">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="rounded-[4px]"
                placeholder="maria@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="font-caption text-caption text-error">{errors.email.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-base md:col-span-2">
              <Label htmlFor="whatsapp" className="font-ui-label text-ui-label text-on-surface-variant">
                WhatsApp (para confirmação)
              </Label>
              <Input
                id="whatsapp"
                type="tel"
                className="rounded-[4px]"
                placeholder="(00) 00000-0000"
                {...register("phone")}
              />
            </div>
          </div>
        </div>

        {serverError && (
          <p className="font-body text-caption text-error bg-error-container rounded-[4px] px-sm py-2">
            {serverError}
          </p>
        )}

        <div className="pt-md">
          <button
            type="submit"
            disabled={isPending || !selectedSlot}
            className="w-full md:w-auto bg-primary text-on-primary px-xl py-3 rounded-[4px] font-ui-label text-ui-label hover:opacity-90 transition-opacity flex items-center justify-center gap-sm disabled:opacity-50"
          >
            {isPending ? "Confirmando..." : "Confirmar Agendamento"}
            <ArrowRight className="size-5" />
          </button>
          <p className="font-caption text-caption text-on-surface-variant mt-sm text-center md:text-left">
            Ao confirmar, você concorda com nossos termos de serviço.
          </p>
        </div>
      </form>
    </div>
  );
}
