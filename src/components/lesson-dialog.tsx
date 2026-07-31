import { format } from "date-fns";
import { CalendarClock, Check, Pencil, UserX, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Lesson } from "@/lib/mock-data";
import { studentName, teacherName } from "@/lib/mock-data";

interface Props {
  lesson: Lesson | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (id: string, patch: Partial<Lesson>) => void;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-sm font-medium">{value}</span>
    </div>
  );
}

export function LessonDialog({ lesson, open, onOpenChange, onUpdate }: Props) {
  const [notes, setNotes] = useState("");

  if (!lesson) return null;
  const start = new Date(lesson.start);
  const end = new Date(lesson.end);
  const duration = Math.round((end.getTime() - start.getTime()) / 60_000);

  const act = (message: string, patch?: Partial<Lesson>) => {
    if (patch) onUpdate?.(lesson.id, patch);
    toast.success(message);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Lesson details</DialogTitle>
          <DialogDescription>Review and manage this lesson.</DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-card px-4">
          <Row label="Student" value={studentName(lesson.studentId)} />
          <Row label="Teacher" value={teacherName(lesson.teacherId)} />
          <Row label="Lesson type" value={lesson.type} />
          <Row label="Date" value={format(start, "EEEE, d MMM yyyy")} />
          <Row label="Time" value={`${format(start, "HH:mm")} – ${format(end, "HH:mm")}`} />
          <Row label="Duration" value={`${duration} min`} />
          <Row label="Status" value={<StatusBadge status={lesson.status} />} />
          <Row
            label="Attendance"
            value={
              lesson.status === "completed"
                ? "Present"
                : lesson.status === "absent"
                  ? "Absent"
                  : "Not recorded"
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lesson-notes">Notes</Label>
          <Textarea
            id="lesson-notes"
            rows={3}
            placeholder="Add a note about this lesson…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <DialogFooter className="flex-wrap gap-2 sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => act("Attendance marked", { status: "completed" })}>
              <Check className="mr-1.5 h-4 w-4" /> Attendance
            </Button>
            <Button size="sm" variant="outline" onClick={() => act("Marked as absent", { status: "absent" })}>
              <UserX className="mr-1.5 h-4 w-4" /> Absence
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => act("Lesson saved")}>
              <Pencil className="mr-1.5 h-4 w-4" /> Edit
            </Button>
            <Button size="sm" variant="outline" onClick={() => act("Reschedule link sent")}>
              <CalendarClock className="mr-1.5 h-4 w-4" /> Reschedule
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => act("Lesson canceled", { status: "canceled" })}
            >
              <X className="mr-1.5 h-4 w-4" /> Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
