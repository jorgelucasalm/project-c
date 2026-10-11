"use client";

import { useState } from "react";
import { Info } from "lucide-react";

export function EarningsCalculator() {
  const [hours, setHours] = useState(20);
  const [rate, setRate] = useState(35);
  const monthly = hours * rate * 4;

  return (
    <div className="flex flex-col gap-lg rounded-xl bg-mist-gray p-lg shadow-sm">
      <div>
        <div className="mb-xs flex items-center justify-between gap-sm">
          <label htmlFor="hours-slider" className="font-ui-label text-ui-label">Teaching Hours per Week</label>
          <output htmlFor="hours-slider" className="font-subheading text-subheading text-secondary-accent">{hours} hrs</output>
        </div>
        <input id="hours-slider" type="range" min={10} max={40} step={1} value={hours} onChange={(event) => setHours(Number(event.target.value))} className="h-2 w-full cursor-pointer accent-primary" />
        <div className="mt-1 flex justify-between text-caption text-on-surface-variant"><span>10 hrs (Casual)</span><span>25 hrs</span><span>40 hrs (Full-time)</span></div>
      </div>
      <div>
        <div className="mb-xs flex items-center justify-between gap-sm">
          <label htmlFor="rate-slider" className="font-ui-label text-ui-label">Your Hourly Rate ($ USD)</label>
          <output htmlFor="rate-slider" className="font-subheading text-subheading text-secondary-accent">${rate} / hr</output>
        </div>
        <input id="rate-slider" type="range" min={20} max={60} step={1} value={rate} onChange={(event) => setRate(Number(event.target.value))} className="h-2 w-full cursor-pointer accent-primary" />
        <div className="mt-1 flex justify-between text-caption text-on-surface-variant"><span>$20 (Novice)</span><span>$40</span><span>$60 (Specialist)</span></div>
      </div>
      <div className="mt-xs flex flex-col items-center rounded-xl bg-primary p-lg text-center text-on-primary">
        <span className="text-caption font-semibold tracking-wider text-smoke uppercase">Projected Gross Monthly Income</span>
        <output htmlFor="hours-slider rate-slider" aria-live="polite" className="my-xs font-display text-[48px] font-bold tracking-tight text-signal-yellow sm:text-display">
          ${monthly.toLocaleString("en-US")}
        </output>
        <p className="max-w-[20rem] text-caption text-smoke">Calculated on a 4-week teaching month, before taxes or expenses. This simulation is not a guarantee of earnings.</p>
      </div>
      <div className="flex items-start gap-sm rounded-lg bg-surface-container-lowest p-sm">
        <Info className="size-5 shrink-0 text-secondary-accent" aria-hidden="true" />
        <p className="text-caption">Explore different rates and availability to find a schedule that works for you.</p>
      </div>
    </div>
  );
}
