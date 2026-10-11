import { CalendarCheck } from "lucide-react";

const schedule = [
  { day: "Monday", slots: ["08:00 - 12:00", "2h Break", "14:00 - 18:00"], hours: "8 hours" },
  { day: "Tuesday", slots: ["08:00 - 12:00", "2h Break", "14:00 - 17:00"], hours: "7 hours" },
  { day: "Wednesday", slots: ["09:00 - 13:00", "Personal buffer", "15:00 - 18:00"], hours: "7 hours" },
  { day: "Thursday", slots: ["08:00 - 12:00", "2h Break", "14:00 - 18:00"], hours: "8 hours" },
  { day: "Friday", slots: ["09:00 - 13:00", "Afternoon Off"], hours: "4 hours" },
];

export function WeeklySchedulePreview() {
  return (
    <div className="rounded-xl bg-surface-container p-lg shadow-sm lg:col-span-7">
      <div className="mb-md flex flex-wrap items-center justify-between gap-sm pb-sm">
        <h3 className="flex items-center gap-xs font-subheading text-subheading"><CalendarCheck className="size-6 shrink-0" aria-hidden="true" />Weekly Schedule Template</h3>
        <span className="rounded-full bg-surface-container-lowest px-sm py-base text-caption">Example: Europe/London</span>
      </div>
      <div className="space-y-sm">
        {schedule.map((day) => (
          <div key={day.day} className="flex flex-col justify-between gap-sm rounded-lg bg-surface-container-lowest p-sm sm:flex-row sm:items-center">
            <span className="flex w-28 shrink-0 items-center gap-sm font-ui-label text-ui-label"><span className="size-2.5 shrink-0 rounded-full bg-secondary-accent" />{day.day}</span>
            <div className="flex flex-wrap gap-xs">
              {day.slots.map((slot, index) => <span key={slot} className={`px-sm py-base text-caption ${index === 1 ? "rounded-full bg-surface-variant text-on-surface-variant" : "rounded bg-surface-container"}`}>{slot}</span>)}
            </div>
            <span className="shrink-0 text-right text-caption text-on-surface-variant">{day.hours}</span>
          </div>
        ))}
        <div className="flex flex-wrap items-center justify-between gap-sm rounded-lg bg-surface-container-high/60 p-sm text-caption text-on-surface-variant">
          <span className="flex items-center gap-sm font-ui-label text-ui-label"><span className="size-2.5 rounded-full bg-outline-variant" />Sat & Sun</span>
          <span className="italic">Blocked for Personal Rest & Preparation</span><span>0 hours</span>
        </div>
      </div>
      <p className="mt-md text-caption text-on-surface-variant">Illustrative template only. Your actual availability is configured in your workspace, independently of the earnings simulation.</p>
    </div>
  );
}
