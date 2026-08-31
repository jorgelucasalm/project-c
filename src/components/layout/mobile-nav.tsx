"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SidebarUserFooter } from "@/components/layout/sidebar-user-footer";
import type { Profile } from "@/types/domain";

export function MobileNav({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Abrir menu"
          className="p-sm text-on-surface-variant hover:bg-mist-gray rounded transition-colors"
        >
          <Menu className="size-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 flex flex-col bg-surface">
        <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
        <div className="p-lg border-b border-smoke">
          <h1 className="font-headline text-headline text-primary">Gestão de Aulas</h1>
          <p className="font-body text-caption text-on-surface-variant">English Academy</p>
        </div>
        <div onClick={() => setOpen(false)} className="flex flex-col flex-1 min-h-0">
          <SidebarNav role={profile.role} />
        </div>
        <SidebarUserFooter profile={profile} />
      </SheetContent>
    </Sheet>
  );
}
