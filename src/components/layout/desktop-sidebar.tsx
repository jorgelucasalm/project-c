import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SidebarUserFooter } from "@/components/layout/sidebar-user-footer";
import type { Profile } from "@/types/domain";

/** Fixed desktop SideNavBar — mirrors the shared nav across every reference screen. */
export function DesktopSidebar({ profile }: { profile: Profile }) {
  return (
    <nav className="hidden md:flex flex-col h-full w-64 fixed left-0 top-0 bg-surface border-r border-smoke z-50">
      <div className="p-lg border-b border-smoke">
        <h1 className="font-headline text-headline text-primary">Gestão de Aulas</h1>
        <p className="font-body text-caption text-on-surface-variant">English Academy</p>
      </div>
      <SidebarNav role={profile.role} />
      <SidebarUserFooter profile={profile} />
    </nav>
  );
}
