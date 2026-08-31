import type { ReactNode } from "react";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { AppFooter } from "@/components/layout/app-footer";
import type { Profile } from "@/types/domain";

interface AppShellProps {
  profile: Profile;
  title?: string;
  topNavBefore?: ReactNode;
  topNavActions?: ReactNode;
  children: ReactNode;
}

/** Composes the SideNavBar + TopNavBar + Footer around a page's content. */
export function AppShell({
  profile,
  title,
  topNavBefore,
  topNavActions,
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar profile={profile} />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <TopNav profile={profile} title={title} before={topNavBefore} actions={topNavActions} />
        <main className="flex-1 p-lg md:p-xxl max-w-container-max mx-auto w-full flex flex-col gap-xl">
          {children}
        </main>
        <AppFooter />
      </div>
    </div>
  );
}
