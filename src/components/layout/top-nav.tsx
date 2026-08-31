import type { ReactNode } from "react";
import { Bell, HelpCircle } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserMenu } from "@/components/layout/user-menu";
import type { Profile } from "@/types/domain";

interface TopNavProps {
  profile: Profile;
  /** Page title shown next to the mobile menu button. */
  title?: string;
  /** Extra content rendered before the icon buttons (e.g. a search field). */
  before?: ReactNode;
  /** Primary page action (e.g. "New Class"), rendered after the icon buttons. */
  actions?: ReactNode;
}

/** Sticky TopNavBar shared by every authenticated screen. */
export function TopNav({ profile, title = "Sistema de Gestão de Aulas", before, actions }: TopNavProps) {
  return (
    <header className="flex justify-between items-center h-16 px-lg sticky top-0 z-40 bg-surface/80 backdrop-blur-sm border-b border-smoke">
      <div className="flex items-center gap-sm md:hidden">
        <MobileNav profile={profile} />
        <span className="font-headline text-headline-sm font-bold text-primary">{title}</span>
      </div>
      <div className="hidden md:flex items-center gap-md">{before}</div>
      <div className="flex items-center gap-md">
        <button
          type="button"
          aria-label="Notificações"
          className="text-on-surface-variant hover:bg-mist-gray p-xs rounded-full transition-all duration-200"
        >
          <Bell className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Ajuda"
          className="text-on-surface-variant hover:bg-mist-gray p-xs rounded-full transition-all duration-200"
        >
          <HelpCircle className="size-5" />
        </button>
        {actions}
        <UserMenu profile={profile} />
      </div>
    </header>
  );
}
