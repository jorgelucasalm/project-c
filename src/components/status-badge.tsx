import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  active: "bg-success/12 text-success",
  completed: "bg-success/12 text-success",
  paid: "bg-success/12 text-success",
  scheduled: "bg-primary/12 text-primary",
  trial: "bg-primary/12 text-primary",
  pending: "bg-warning/16 text-warning",
  absent: "bg-warning/16 text-warning",
  inactive: "bg-muted text-muted-foreground",
  canceled: "bg-destructive/12 text-destructive",
  overdue: "bg-destructive/12 text-destructive",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        styles[status] ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      {status}
    </span>
  );
}
