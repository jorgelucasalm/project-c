import { BadgeCheck, CalendarDays, Clock, MessageCircle, NotebookPen, Users } from "lucide-react";
import { headingClass, sectionClass } from "./styles";

const features = [
  {
    icon: CalendarDays,
    title: "Interactive Lesson Scheduler",
    description: "Manage lessons in a weekly calendar, define your availability, and keep track of your upcoming classes in one place.",
    detailIcon: Clock,
    detail: "Your schedule, organized around your routine",
  },
  {
    icon: MessageCircle,
    title: "Automated WhatsApp & Email Alerts",
    description: "Keep students informed with automated lesson reminders and classroom links through your configured notification channels.",
    detailIcon: BadgeCheck,
    detail: "Spend less time sending manual reminders",
  },
  {
    icon: Users,
    title: "Student & Attendance CRM",
    description: "Track learner attendance, record pedagogical notes, and manage free trial conversions in one focused workspace.",
    detailIcon: NotebookPen,
    detail: "Complete student portfolio archive",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 bg-mist-gray py-section-v">
      <div className={sectionClass}>
        <div className="mb-xl max-w-intro">
          <span className="font-ui-label text-ui-label tracking-wider text-secondary-accent uppercase">Full Operational Stack</span>
          <h2 className={headingClass}>Everything an independent teacher needs, pre-configured.</h2>
        </div>
        <div className="grid gap-md md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-lg shadow-sm">
              <div>
                <div className="mb-md flex size-12 items-center justify-center rounded-lg bg-surface-container"><feature.icon className="size-7" aria-hidden="true" /></div>
                <h3 className="mb-xs font-subheading text-subheading text-primary">{feature.title}</h3>
                <p className="text-body text-on-surface-variant">{feature.description}</p>
              </div>
              <div className="mt-lg flex items-center gap-xs pt-sm text-caption text-on-surface-variant"><feature.detailIcon className="size-4 shrink-0" aria-hidden="true" />{feature.detail}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
