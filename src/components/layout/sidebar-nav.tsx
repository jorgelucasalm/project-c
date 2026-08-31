"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { icons } from "@/lib/icons";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import type { UserRole } from "@/types/domain";

export function SidebarNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <ul className="flex flex-col flex-1 gap-base px-md py-md overflow-y-auto">
      {items.map((item) => (
        <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} active={pathname.startsWith(item.href)} />
      ))}
    </ul>
  );
}

function NavLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: keyof typeof icons;
  active: boolean;
}) {
  const Icon = icons[icon];
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-sm px-sm py-sm rounded text-on-surface-variant font-body hover:bg-mist-gray transition-colors duration-200",
          active &&
            "text-primary font-bold border-r-2 border-primary bg-mist-gray",
        )}
      >
        <Icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
        <span>{label}</span>
      </Link>
    </li>
  );
}
