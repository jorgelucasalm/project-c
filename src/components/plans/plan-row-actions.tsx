"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PlanFormDialog } from "@/components/plans/plan-form-dialog";
import { deletePlanAction } from "@/features/plans/actions";
import type { Plan } from "@/types/domain";

export function PlanRowActions({ plan }: { plan: Plan }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center gap-xs justify-end">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="text-outline hover:text-primary transition-colors p-1"
        >
          <Pencil className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="text-outline hover:text-error transition-colors p-1"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <PlanFormDialog open={editOpen} onOpenChange={setEditOpen} plan={plan} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover {plan.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Alunos com assinaturas ativas nesse plano não serão afetados, mas ele deixará de
              estar disponível para novas matrículas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await deletePlanAction(plan.id);
                  router.refresh();
                })
              }
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
