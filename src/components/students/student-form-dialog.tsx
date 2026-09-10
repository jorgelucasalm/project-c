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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studentSchema, type StudentFormValues, type StudentInput } from "@/schemas/student.schema";
import { createStudentAction, updateStudentAction } from "@/features/students/actions";
import type { Student } from "@/types/domain";

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student & { active_plan_id?: string | null; active_teacher_id?: string | null };
  plans: { id: string; name: string }[];
  teachers: { id: string; full_name: string }[];
}

/**
 * Wraps the form body and only mounts it while the dialog is open, keyed by
 * the student id. This guarantees a fresh `useForm` instance (correct
 * defaultValues, no stale error state) every time it's reopened — instead of
 * imperatively calling `reset()` from an Effect.
 */
export function StudentFormDialog({ open, onOpenChange, student, plans, teachers }: StudentFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[32rem] bg-surface-container-lowest">
        {open && (
          <StudentFormBody
            key={student?.id ?? "new"}
            student={student}
            plans={plans}
            teachers={teachers}
            onOpenChange={onOpenChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function StudentFormBody({
  student,
  plans,
  teachers,
  onOpenChange,
}: Omit<StudentFormDialogProps, "open">) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(student);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StudentFormValues, unknown, StudentInput>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      full_name: student?.full_name ?? "",
      email: student?.email ?? "",
      phone: student?.phone ?? "",
      student_type: student?.student_type ?? "adult",
      status: student?.status ?? "pending",
      level: student?.level ?? "",
      notes: student?.notes ?? "",
      plan_id: student?.active_plan_id ?? "",
      teacher_id: student?.active_teacher_id ?? "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    startTransition(async () => {
      const result = isEditing
        ? await updateStudentAction(student!.id, values)
        : await createStudentAction(values);

      if (result.success) {
        onOpenChange(false);
        router.refresh();
      } else {
        setServerError(result.error ?? "Erro ao salvar aluno.");
      }
    });
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-headline text-headline-sm text-primary">
          {isEditing ? "Editar Aluno" : "Adicionar Aluno"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="flex flex-col gap-md">
        <div className="grid grid-cols-2 gap-md">
          <div className="flex flex-col gap-base col-span-2">
            <Label className="font-ui-label text-ui-label text-on-surface-variant">Nome</Label>
            <Input className="rounded-[4px]" {...register("full_name")} />
            {errors.full_name && (
              <p className="font-caption text-caption text-error">{errors.full_name.message}</p>
            )}
          </div>
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
            <div className="flex flex-col gap-base">
              <Label className="font-ui-label text-ui-label text-on-surface-variant">Tipo</Label>
              <Select
                defaultValue={student?.student_type ?? "adult"}
                onValueChange={(v) => setValue("student_type", v as StudentFormValues["student_type"])}
              >
                <SelectTrigger className="w-full rounded-[4px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adult">Adulto</SelectItem>
                  <SelectItem value="teen">Adolescente</SelectItem>
                  <SelectItem value="kids">Kids</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-base">
              <Label className="font-ui-label text-ui-label text-on-surface-variant">Status</Label>
              <Select
                defaultValue={student?.status ?? "pending"}
                onValueChange={(v) => setValue("status", v as StudentFormValues["status"])}
              >
                <SelectTrigger className="w-full rounded-[4px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-base">
              <Label className="font-ui-label text-ui-label text-on-surface-variant">Plano</Label>
              <Select
                defaultValue={student?.active_plan_id ?? ""}
                onValueChange={(v) => setValue("plan_id", v)}
              >
                <SelectTrigger className="w-full rounded-[4px]">
                  <SelectValue placeholder="Nenhum" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-base">
              <Label className="font-ui-label text-ui-label text-on-surface-variant">
                Professor
              </Label>
              <Select
                defaultValue={student?.active_teacher_id ?? ""}
                onValueChange={(v) => setValue("teacher_id", v)}
              >
                <SelectTrigger className="w-full rounded-[4px]">
                  <SelectValue placeholder="Nenhum" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-base">
              <Label className="font-ui-label text-ui-label text-on-surface-variant">Nível</Label>
              <Input className="rounded-[4px]" placeholder="Ex: B1" {...register("level")} />
            </div>
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
              {isPending ? "Salvando..." : isEditing ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
    </>
  );
}
