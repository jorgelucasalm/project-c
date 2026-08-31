import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}

export function Pagination({ page, pageSize, total, basePath, searchParams }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const hrefFor = (targetPage: number) => {
    const params = new URLSearchParams(
      Object.entries(searchParams).filter(([, v]) => v) as [string, string][],
    );
    params.set("page", String(targetPage));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="bg-surface-container-low border-t border-smoke p-md flex items-center justify-between">
      <span className="font-body text-caption text-on-surface-variant">
        Mostrando {from} a {to} de {total} alunos
      </span>
      <div className="flex gap-xs">
        <Link
          href={hrefFor(Math.max(1, page - 1))}
          aria-disabled={page <= 1}
          className={cn(
            "size-8 flex items-center justify-center border border-smoke rounded text-outline hover:bg-surface-container-highest transition-colors",
            page <= 1 && "pointer-events-none opacity-40",
          )}
        >
          <ChevronLeft className="size-4" />
        </Link>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .slice(0, 5)
          .map((p) => (
            <Link
              key={p}
              href={hrefFor(p)}
              className={cn(
                "size-8 flex items-center justify-center border border-smoke rounded font-ui-label text-caption hover:bg-surface-container-highest transition-colors",
                p === page
                  ? "bg-surface-container-lowest text-primary"
                  : "bg-surface-container-lowest text-on-surface-variant",
              )}
            >
              {p}
            </Link>
          ))}
        <Link
          href={hrefFor(Math.min(totalPages, page + 1))}
          aria-disabled={page >= totalPages}
          className={cn(
            "size-8 flex items-center justify-center border border-smoke rounded text-on-surface-variant hover:bg-surface-container-highest transition-colors",
            page >= totalPages && "pointer-events-none opacity-40",
          )}
        >
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
