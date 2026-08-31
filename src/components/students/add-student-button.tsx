"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { StudentFormDialog } from "@/components/students/student-form-dialog";

interface AddStudentButtonProps {
  plans: { id: string; name: string }[];
  teachers: { id: string; full_name: string }[];
}

export function AddStudentButton({ plans, teachers }: AddStudentButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-primary text-on-primary font-ui-label text-ui-label px-lg py-sm rounded-[4px] hover:opacity-90 transition-colors flex items-center whitespace-nowrap self-stretch md:self-auto justify-center"
      >
        <UserPlus className="size-4 mr-sm" />
        Adicionar Aluno
      </button>
      <StudentFormDialog open={open} onOpenChange={setOpen} plans={plans} teachers={teachers} />
    </>
  );
}
