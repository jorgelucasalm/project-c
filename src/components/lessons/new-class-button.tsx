"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { LessonFormDialog } from "@/components/lessons/lesson-form-dialog";

/** "New Class" primary action, reused in the TopNavBar of every admin/teacher screen. */
export function NewClassButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-primary text-on-primary font-ui-label text-ui-label px-lg py-sm rounded-[4px] hover:opacity-90 transition-opacity flex items-center whitespace-nowrap"
      >
        <Plus className="size-4 mr-xs" />
        New Class
      </button>
      <LessonFormDialog open={open} onOpenChange={setOpen} onCreated={() => router.refresh()} />
    </>
  );
}
