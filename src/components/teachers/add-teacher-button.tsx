"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { TeacherFormDialog } from "@/components/teachers/teacher-form-dialog";

export function AddTeacherButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-primary text-on-primary font-ui-label text-ui-label px-lg py-sm rounded-[4px] hover:opacity-90 transition-colors flex items-center whitespace-nowrap"
      >
        <UserPlus className="size-4 mr-sm" />
        Adicionar Professor
      </button>
      <TeacherFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
