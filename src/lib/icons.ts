/**
 * Maps the Material Symbols Outlined icon names used in the original
 * site.html reference to their closest Lucide equivalent, since Lucide
 * Icons is the mandated icon library for this project's stack.
 */
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  GraduationCap,
  FileText,
  CalendarCheck,
  Bell,
  Settings,
  Menu,
  Plus,
  Search,
  UserPlus,
  MoreVertical,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Clock,
  TrendingUp,
  CalendarClock,
  Rocket,
  Wallet,
  SlidersHorizontal,
  ArrowRight,
  X,
  type LucideIcon,
} from "lucide-react";

export const navIcons = {
  dashboard: LayoutDashboard,
  calendar_month: CalendarDays,
  group: Users,
  school: GraduationCap,
  description: FileText,
  event_available: CalendarCheck,
  notifications: Bell,
  settings: Settings,
} satisfies Record<string, LucideIcon>;

export const icons = {
  ...navIcons,
  menu: Menu,
  add: Plus,
  search: Search,
  person_add: UserPlus,
  more_vert: MoreVertical,
  more_horiz: MoreHorizontal,
  chevron_left: ChevronLeft,
  chevron_right: ChevronRight,
  help: HelpCircle,
  schedule: Clock,
  trending_up: TrendingUp,
  calendar_today: CalendarClock,
  rocket_launch: Rocket,
  payments: Wallet,
  filter_list: SlidersHorizontal,
  arrow_forward: ArrowRight,
  close: X,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;
