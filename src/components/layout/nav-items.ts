import type { IconName } from "@/lib/icons";
import type { UserRole } from "@/types/domain";

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  roles: UserRole[];
}

/** Shared sidebar navigation, mirrors the SideNavBar in every reference screen. */
export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "dashboard",
    roles: ["admin", "teacher"],
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: "calendar_month",
    roles: ["admin", "teacher", "student"],
  },
  {
    href: "/students",
    label: "Students",
    icon: "group",
    roles: ["admin", "teacher"],
  },
  {
    href: "/teachers",
    label: "Teachers",
    icon: "school",
    roles: ["admin"],
  },
  {
    href: "/plans",
    label: "Plans",
    icon: "description",
    roles: ["admin"],
  },
  {
    href: "/availability",
    label: "Availability",
    icon: "event_available",
    roles: ["admin", "teacher"],
  },
  {
    href: "/notifications",
    label: "Notifications",
    icon: "notifications",
    roles: ["admin", "teacher", "student"],
  },
  {
    href: "/settings",
    label: "Settings",
    icon: "settings",
    roles: ["admin", "teacher", "student"],
  },
];
