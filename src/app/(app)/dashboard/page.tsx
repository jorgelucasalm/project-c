"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  CalendarDays,
  DollarSign,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppPageHeader } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  lessons,
  lessonsByWeekday,
  revenueByMonth,
  studentName,
  teacherName,
} from "@/lib/mock-data";

export default function Dashboard() {
  const today = new Date();
  const todays = lessons.filter(
    (l) => new Date(l.start).toDateString() === today.toDateString(),
  );
  const upcoming = lessons
    .filter((l) => new Date(l.start) > today && l.status !== "canceled")
    .sort((a, b) => +new Date(a.start) - +new Date(b.start))
    .slice(0, 6);

  return (
    <>
      <AppPageHeader
        title="Dashboard"
        description={format(today, "EEEE, d MMMM yyyy")}
        actions={
          <Button nativeButton={false} render={<Link href="/calendar" />}>
            <CalendarDays className="mr-2 h-4 w-4" /> Open calendar
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active students"
          value="48"
          delta="+6.2%"
          icon={Users}
          hint="vs last month"
        />
        <StatCard
          label="Trial lessons this week"
          value="7"
          delta="+2"
          icon={Sparkles}
          hint="3 converted"
        />
        <StatCard
          label="Today's lessons"
          value={String(todays.length)}
          icon={CalendarDays}
          hint="2 remaining"
        />
        <StatCard
          label="Monthly revenue"
          value="$9,280"
          delta="+7.4%"
          icon={DollarSign}
          hint="July"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="card-surface min-w-0 p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Revenue growth</p>
              <p className="text-sm text-muted-foreground">Last 6 months</p>
            </div>
          </div>
          <div className="mt-4 h-64 min-w-0">
            <ResponsiveContainer
              width="100%"
              height="100%"
              initialDimension={{ width: 320, height: 256 }}
            >
              <AreaChart
                data={revenueByMonth}
                margin={{ left: -20, right: 8, top: 8 }}
              >
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#rev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-surface min-w-0 p-5">
          <p className="font-medium">Lessons per weekday</p>
          <p className="text-sm text-muted-foreground">This week</p>
          <div className="mt-4 h-64 min-w-0">
            <ResponsiveContainer
              width="100%"
              height="100%"
              initialDimension={{ width: 320, height: 256 }}
            >
              <BarChart
                data={lessonsByWeekday}
                margin={{ left: -24, right: 8, top: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  cursor={{ fill: "var(--color-muted)" }}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="lessons"
                  fill="var(--color-primary)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card-surface mt-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium">Upcoming lessons</p>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/calendar" />}
          >
            View calendar
          </Button>
        </div>
        <ul className="mt-3 divide-y divide-border">
          {upcoming.map((l) => (
            <li
              key={l.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <GraduationCap className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {studentName(l.studentId)}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {teacherName(l.teacherId)} · {l.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {format(new Date(l.start), "EEE d MMM · HH:mm")}
                </span>
                <StatusBadge status={l.status} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
