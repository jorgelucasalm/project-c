import { ArrowRight, CheckCircle } from "lucide-react";
import { TutorCarousel } from "../tutor-carousel";
import { buttonClass, sectionClass } from "./styles";

export function HeroSection() {
  return (
    <section id="why-teach" className="scroll-mt-24 overflow-hidden bg-secondary-container py-section-v">
      <div className={`${sectionClass} grid items-center gap-xl lg:grid-cols-12`}>
        <div className="flex flex-col items-start gap-md lg:col-span-7">
          <span className="inline-flex items-center gap-xs rounded-full bg-surface-container-lowest px-sm py-base font-ui-label text-ui-label tracking-wide uppercase shadow-sm">
            <span className="size-2 rounded-full bg-secondary-accent" /> Tutor Network
          </span>
          <h1 className="font-display text-[40px] leading-none font-bold tracking-tight text-primary sm:text-[52px] xl:text-display">Own your teaching business. We automate the rest.</h1>
          <p className="max-w-intro text-body">Set your rates, define flexible weekly schedule slots, and let automated reminders, Google Calendar sync, and student management handle your daily workflow.</p>
          <div className="flex flex-wrap items-center gap-md pt-xs">
            <a href="#apply" className={`${buttonClass} px-xl shadow-sm`}>Start Teaching <ArrowRight className="size-[18px]" aria-hidden="true" /></a>
            <a href="#features" className="inline-flex items-center justify-center rounded-lg bg-surface-container-lowest/80 px-lg py-sm font-ui-label text-ui-label text-primary shadow-sm transition-colors hover:bg-surface-container-lowest">Explore Platform Features</a>
          </div>
          <div className="flex flex-wrap gap-lg pt-md text-caption font-medium">
            {["Flexible teaching hours", "Google Calendar sync"].map((text) => (
              <span key={text} className="flex items-center gap-xs"><CheckCircle className="size-5 text-secondary-accent" aria-hidden="true" />{text}</span>
            ))}
          </div>
        </div>
        <div className="mt-lg flex justify-center lg:col-span-5 lg:mt-0 lg:justify-end"><TutorCarousel /></div>
      </div>
    </section>
  );
}
