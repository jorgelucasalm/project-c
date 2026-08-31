"use client";

import { useCallback, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentsFiltersProps {
  plans: { id: string; name: string }[];
  teachers: { id: string; full_name: string }[];
}

export function StudentsFilters({ plans, teachers }: StudentsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.set("page", "1");
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="bg-surface-container-lowest border border-smoke rounded-lg p-md flex flex-wrap gap-md items-end">
      <div className="flex flex-col gap-base flex-1 min-w-[200px]">
        <label className="font-ui-label text-caption text-on-surface-variant">Busca</label>
        <div className="relative">
          <Search className="absolute left-sm top-1/2 -translate-y-1/2 size-4 text-outline" />
          <Input
            defaultValue={searchParams.get("search") ?? ""}
            onChange={(e) => setParam("search", e.target.value)}
            placeholder="Nome do aluno..."
            className="pl-[36px] rounded-[4px] bg-surface-container-lowest"
          />
        </div>
      </div>
      <div className="flex flex-col gap-base flex-1 min-w-[150px]">
        <label className="font-ui-label text-caption text-on-surface-variant">Status</label>
        <Select
          defaultValue={searchParams.get("status") ?? "all"}
          onValueChange={(v) => setParam("status", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-full rounded-[4px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-base flex-1 min-w-[150px]">
        <label className="font-ui-label text-caption text-on-surface-variant">Plano</label>
        <Select
          defaultValue={searchParams.get("planId") ?? "all"}
          onValueChange={(v) => setParam("planId", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-full rounded-[4px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {plans.map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-base flex-1 min-w-[150px]">
        <label className="font-ui-label text-caption text-on-surface-variant">Professor</label>
        <Select
          defaultValue={searchParams.get("teacherId") ?? "all"}
          onValueChange={(v) => setParam("teacherId", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-full rounded-[4px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {teachers.map((teacher) => (
              <SelectItem key={teacher.id} value={teacher.id}>
                {teacher.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
