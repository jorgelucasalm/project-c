"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PlanFormDialog } from "@/components/plans/plan-form-dialog";

export function AddPlanButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-primary text-on-primary font-ui-label text-ui-label px-lg py-sm rounded-[4px] hover:opacity-90 transition-colors flex items-center whitespace-nowrap"
      >
        <Plus className="size-4 mr-sm" />
        Adicionar Plano
      </button>
      <PlanFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
