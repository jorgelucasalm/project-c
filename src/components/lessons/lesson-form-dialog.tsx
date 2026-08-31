"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { lessonSchema, type LessonFormValues, type LessonInput } from "@/schemas/lesson.schema";
import { createLessonAction } from "@/features/scheduling/actions";
import {
  getLessonFormOptions,
  type LessonFormOptions,
} from "@/features/scheduling/queries";

interface LessonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStartsAt?: string;
  onCreated?: () => void;
}

export function LessonFormDialog({
  open,
  onOpenChange,
  defaultStartsAt,
  onCreated,
}: LessonFormDialogProps) {
  const [options, setOptions] = useState<LessonFormOptions | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LessonFormValues, unknown, LessonInput>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      teacher_id: "",
      student_id: null,
      type: "regular",
      location: "online",
      duration_minutes: 60,
      starts_at: defaultStartsAt ?? "",
      notes: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      getLessonFormOptions().then(setOptions);
      reset({
        teacher_id: "",
        student_id: null,
        type: "regular",
        location: "online",
        duration_minutes: 60,
        starts_at: defaultStartsAt ?? "",
        notes: undefined,
      });
      setServerError(null);
    }
  }, [open, defaultStartsAt, reset]);

  const type = watch("type");

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    startTransition(async () => {
      const result = await createLessonAction(values);
      if (result.success) {
        onOpenChange(false);
        onCreated?.();
      } else {
        setServerError(result.error ?? "Erro ao criar aula.");
      }
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-surface-container-lowest">
        <DialogHeader>
          <DialogTitle className="font-headline text-headline-sm text-primary">
            Nova Aula
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-md">
          <div className="grid grid-cols-2 gap-md">
            <div className="flex flex-col gap-base">
              <Label className="font-ui-label text-ui-label text-on-surface-variant">
                Professor
              </Label>
              <Select onValueChange={(v) => setValue("teacher_id", v)}>
                <SelectTrigger className="w-full rounded-[4px]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {options?.teachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.teacher_id && (
                <p className="font-caption text-caption text-error">{errors.teacher_id.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-base">
              <Label className="font-ui-label text-ui-label text-on-surface-variant">Tipo</Label>
              <Select
                defaultValue="regular"
                onValueChange={(v) => setValue("type", v as LessonFormValues["type"])}
              >
                <SelectTrigger className="w-full rounded-[4px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="trial">Experimental</SelectItem>
                  <SelectItem value="makeup">Reposição</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {type !== "trial" && (
            <div className="flex flex-col gap-base">
              <Label className="font-ui-label text-ui-label text-on-surface-variant">Aluno</Label>
              <Select onValueChange={(v) => setValue("student_id", v)}>
                <SelectTrigger className="w-full rounded-[4px]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {options?.students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.student_id && (
                <p className="font-caption text-caption text-error">{errors.student_id.message}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-md">
            <div className="flex flex-col gap-base">
              <Label className="font-ui-label text-ui-label text-on-surface-variant">
                Data e hora
              </Label>
              <Input
                type="datetime-local"
                className="rounded-[4px]"
                {...register("starts_at")}
              />
              {errors.starts_at && (
                <p className="font-caption text-caption text-error">{errors.starts_at.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-base">
              <Label className="font-ui-label text-ui-label text-on-surface-variant">
                Duração (min)
              </Label>
              <Input type="number" step={15} className="rounded-[4px]" {...register("duration_minutes")} />
            </div>
          </div>

          <div className="flex flex-col gap-base">
            <Label className="font-ui-label text-ui-label text-on-surface-variant">Local</Label>
            <Select
              defaultValue="online"
              onValueChange={(v) => setValue("location", v as LessonFormValues["location"])}
            >
              <SelectTrigger className="w-full rounded-[4px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in_person">Presencial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-base">
            <Label className="font-ui-label text-ui-label text-on-surface-variant">
              Observações
            </Label>
            <Textarea className="rounded-[4px]" rows={2} {...register("notes")} />
          </div>

          {serverError && (
            <p className="font-body text-caption text-error bg-error-container rounded-[4px] px-sm py-2">
              {serverError}
            </p>
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary text-on-primary rounded-[4px] hover:opacity-90"
            >
              {isPending ? "Salvando..." : "Criar Aula"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
