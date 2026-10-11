import { sectionClass } from "./styles";

const metrics = [
  ["Schedule Control", "100% Autonomy", "Set custom slots & break times"],
  ["Class Reliability", "Auto Reminders", "Configured WhatsApp & email alerts"],
  ["Part-Time Potential", "$2,800", "Illustrative gross income at 20h/week, $35/h"],
  ["Teacher Workspace", "All in One", "Calendar, students & attendance"],
];

export function PlatformSummary() {
  return (
    <section aria-label="Platform at a glance" className="bg-surface-container-lowest py-lg shadow-sm">
      <div className={`${sectionClass} grid grid-cols-2 gap-md md:grid-cols-4`}>
        {metrics.map(([label, value, detail], index) => (
          <div key={label} className="flex flex-col rounded-lg bg-surface p-md">
            <span className="text-caption tracking-wider text-on-surface-variant uppercase">{label}</span>
            <span className={`mt-base font-headline text-[24px] font-bold md:text-headline ${index === 1 ? "text-secondary-accent" : "text-primary"}`}>{value}</span>
            <p className="mt-1 text-caption text-on-surface-variant">{detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
