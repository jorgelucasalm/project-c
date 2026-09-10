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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { planSchema, type PlanFormValues, type PlanInput } from "@/schemas/plan.schema";
import { createPlanAction, updatePlanAction } from "@/features/plans/actions";
import type { Plan } from "@/types/domain";

interface PlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: Plan;
}

/** Mounts the form only while open, keyed by plan id, for fresh form state on every open. */
export function PlanFormDialog({ open, onOpenChange, plan }: PlanFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[32rem] bg-surface-container-lowest">
        {open && <PlanFormBody key={plan?.id ?? "new"} plan={plan} onOpenChange={onOpenChange} />}
      </DialogContent>
    </Dialog>
  );
}

function PlanFormBody({ plan, onOpenChange }: Omit<PlanFormDialogProps, "open">) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(plan);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PlanFormValues, unknown, PlanInput>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: plan?.name ?? "",
      price_cents: plan?.price_cents ?? 0,
      lesson_duration_minutes: plan?.lesson_duration_minutes ?? 60,
      lessons_per_cycle: plan?.lessons_per_cycle ?? 4,
      status: plan?.status ?? "active",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    startTransition(async () => {
      const result = isEditing
        ? await updatePlanAction(plan!.id, values)
        : await createPlanAction(values);

      if (result.success) {
        onOpenChange(false);
        router.refresh();
      } else {
        setServerError(result.error ?? "Erro ao salvar plano.");
      }
    });
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-headline text-headline-sm text-primary">
          {isEditing ? "Editar Plano" : "Adicionar Plano"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="flex flex-col gap-md">
        <div className="flex flex-col gap-base">
          <Label className="font-ui-label text-ui-label text-on-surface-variant">Nome</Label>
          <Input className="rounded-[4px]" {...register("name")} />
          {errors.name && (
            <p className="font-caption text-caption text-error">{errors.name.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-md">
          <div className="flex flex-col gap-base">
            <Label className="font-ui-label text-ui-label text-on-surface-variant">
              Preço (centavos)
            </Label>
            <Input type="number" className="rounded-[4px]" {...register("price_cents")} />
            {errors.price_cents && (
              <p className="font-caption text-caption text-error">{errors.price_cents.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-base">
            <Label className="font-ui-label text-ui-label text-on-surface-variant">Status</Label>
            <Select
              defaultValue={plan?.status ?? "active"}
              onValueChange={(v) => setValue("status", v as PlanInput["status"])}
            >
              <SelectTrigger className="w-full rounded-[4px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-base">
            <Label className="font-ui-label text-ui-label text-on-surface-variant">
              Duração da aula (min)
            </Label>
            <Input type="number" className="rounded-[4px]" {...register("lesson_duration_minutes")} />
          </div>
          <div className="flex flex-col gap-base">
            <Label className="font-ui-label text-ui-label text-on-surface-variant">
              Aulas por ciclo
            </Label>
            <Input type="number" className="rounded-[4px]" {...register("lessons_per_cycle")} />
          </div>
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
