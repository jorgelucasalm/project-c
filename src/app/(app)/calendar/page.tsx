"use client";

import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "sonner";

import { AppPageHeader } from "@/components/app-shell";
import { LessonDialog } from "@/components/lesson-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Lesson } from "@/lib/mock-data";
import { lessons as seedLessons, statusColor } from "@/lib/mock-data";

const SchoolCalendar = dynamic(() => import("@/components/school-calendar"), {
  ssr: false,
  loading: () => <Skeleton className="h-160 w-full rounded-xl" />,
});

const legend: { label: string; status: keyof typeof statusColor }[] = [
  { label: "Scheduled", status: "scheduled" },
  { label: "Completed", status: "completed" },
  { label: "Trial", status: "trial" },
  { label: "Absent", status: "absent" },
  { label: "Canceled", status: "canceled" },
];

export default function CalendarPage() {
  const [items, setItems] = useState<Lesson[]>(seedLessons);
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [open, setOpen] = useState(false);

  const update = (id: string, patch: Partial<Lesson>) =>
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  return (
    <>
      <AppPageHeader
        title="Calendar"
        description="Drag to reschedule, resize to change duration, click to open a lesson."
        actions={
          <Button onClick={() => toast.success("New lesson draft created")}>
            <Plus className="mr-2 h-4 w-4" /> Create lesson
          </Button>
        }
      />
      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2">
        {legend.map((l) => (
          <span
            key={l.status}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: statusColor[l.status] }}
            />
            {l.label}
          </span>
        ))}
      </div>

      <div className="card-surface overflow-hidden p-3 sm:p-4">
        <SchoolCalendar
          lessons={items}
          onSelectLesson={(l) => {
            setSelected(l);
            setOpen(true);
          }}
          onMoveLesson={(id, start, end) => update(id, { start, end })}
          onCreate={() => toast.success("New lesson draft created")}
        />
      </div>

      <LessonDialog
        lesson={selected}
        open={open}
        onOpenChange={setOpen}
        onUpdate={update}
      />
    </>
  );
}
