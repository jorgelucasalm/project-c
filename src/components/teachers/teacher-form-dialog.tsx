"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { teacherSchema, type TeacherFormValues, type TeacherInput } from "@/schemas/teacher.schema";
import { createTeacherAction, updateTeacherAction } from "@/features/teachers/actions";
import type { Teacher } from "@/types/domain";

interface TeacherFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher?: Teacher;
}

/** Mounts the form only while open, keyed by teacher id, for fresh form state on every open. */
export function TeacherFormDialog({ open, onOpenChange, teacher }: TeacherFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-surface-container-lowest">
        {open && (
          <TeacherFormBody key={teacher?.id ?? "new"} teacher={teacher} onOpenChange={onOpenChange} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function TeacherFormBody({ teacher, onOpenChange }: Omit<TeacherFormDialogProps, "open">) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(teacher);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherFormValues, unknown, TeacherInput>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      full_name: teacher?.full_name ?? "",
      email: teacher?.email ?? "",
      phone: teacher?.phone ?? "",
      bio: teacher?.bio ?? "",
      color: teacher?.color ?? "#99c5ff",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    startTransition(async () => {
      const result = isEditing
        ? await updateTeacherAction(teacher!.id, values)
        : await createTeacherAction(values);

      if (result.success) {
        onOpenChange(false);
        router.refresh();
      } else {
        setServerError(result.error ?? "Erro ao salvar professor.");
      }
    });
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-headline text-headline-sm text-primary">
          {isEditing ? "Editar Professor" : "Adicionar Professor"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="flex flex-col gap-md">
        <div className="flex flex-col gap-base">
          <Label className="font-ui-label text-ui-label text-on-surface-variant">Nome</Label>
          <Input className="rounded-[4px]" {...register("full_name")} />
          {errors.full_name && (
            <p className="font-caption text-caption text-error">{errors.full_name.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-md">
          <div className="flex flex-col gap-base">
            <Label className="font-ui-label text-ui-label text-on-surface-variant">Email</Label>
            <Input type="email" className="rounded-[4px]" {...register("email")} />
            {errors.email && (
              <p className="font-caption text-caption text-error">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-base">
            <Label className="font-ui-label text-ui-label text-on-surface-variant">Telefone</Label>
            <Input className="rounded-[4px]" {...register("phone")} />
          </div>
        </div>
        <div className="flex flex-col gap-base">
          <Label className="font-ui-label text-ui-label text-on-surface-variant">Bio</Label>
          <Textarea className="rounded-[4px]" rows={3} {...register("bio")} />
        </div>
        <div className="flex flex-col gap-base">
          <Label className="font-ui-label text-ui-label text-on-surface-variant">
            Cor no calendário
          </Label>
          <Input type="color" className="rounded-[4px] h-10 w-20 p-1" {...register("color")} />
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
            {isPending ? "Salvando..." : isEditing ? "Salvar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
