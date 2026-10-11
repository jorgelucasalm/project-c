import { EarningsCalculator } from "../earnings-calculator";
import { WeeklySchedulePreview } from "./weekly-schedule-preview";
import { headingClass, sectionClass } from "./styles";

export function EarningsSection() {
  return (
    <section
      id="earnings"
      className="scroll-mt-24 bg-surface-container-lowest py-section-v"
    >
      <div className={sectionClass}>
        <div className="mx-auto mb-xl max-w-2xl text-center">
          <span className="font-ui-label text-ui-label tracking-wider text-secondary-accent uppercase">
            Dynamic Potential
          </span>
          <h2 className={headingClass}>
            Model your weekly schedule and earnings
          </h2>
          <p className="mt-xs text-body text-on-surface-variant">
            Take full control over your time. Tweak the parameters below to see
            what your independent monthly cash flow looks like.
          </p>
        </div>
        <div className="flex justify-center gap-xl">
          <WeeklySchedulePreview />
        </div>
      </div>
    </section>
  );
}
