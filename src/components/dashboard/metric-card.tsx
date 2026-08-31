import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  hintIcon?: LucideIcon;
  hintClassName?: string;
  accent?: boolean;
}

/** Mirrors the "Metrics Strip" cards on the dashboard reference screen. */
export function MetricCard({
  label,
  value,
  icon: Icon,
  hint,
  hintIcon: HintIcon,
  hintClassName,
  accent,
}: MetricCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-smoke rounded-lg p-lg relative overflow-hidden">
      {accent && (
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-signal-yellow opacity-20 rounded-full blur-xl" />
      )}
      <div className="flex justify-between items-start mb-sm relative z-10">
        <p className="font-ui-label text-ui-label text-on-surface-variant">{label}</p>
        <Icon className="size-5 text-primary" strokeWidth={1.75} />
      </div>
      <p className="font-headline text-headline-lg text-primary relative z-10">{value}</p>
      {hint && (
        <div
          className={cn(
            "flex items-center gap-xs mt-sm text-on-surface-variant relative z-10",
            hintClassName,
          )}
        >
          {HintIcon && <HintIcon className="size-3.5" />}
          <span className="font-body text-caption">{hint}</span>
        </div>
      )}
    </div>
  );
}
