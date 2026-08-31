import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-surface-container-highest text-on-surface",
  Ativo: "bg-surface-container-highest text-on-surface",
  inactive: "bg-error-container text-on-error-container",
  Inativo: "bg-error-container text-on-error-container",
  pending: "bg-secondary-fixed text-on-secondary-fixed",
  Pendente: "bg-secondary-fixed text-on-secondary-fixed",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Ativo",
  inactive: "Inativo",
  pending: "Pendente",
};

/** Small rotated status pill, matching the reference students table. */
export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const label = STATUS_LABELS[status] ?? status;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded text-caption font-ui-label border border-smoke -rotate-1 shadow-sm",
        STATUS_STYLES[status] ?? "bg-surface-container-highest text-on-surface",
        className,
      )}
    >
      {label}
    </span>
  );
}
