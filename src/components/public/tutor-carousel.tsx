"use client";

import { useState } from "react";
import Image from "next/image";
import { BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import MGabi from "@/assets/images/mgabi.jpg";

const tutors = [
  {
    name: "Dr. Claire Bennett",
    credentials: "Oxford CELTA • 8 Years Experience",
    specialty: "General & Fluency",
    badge: "Certified Educator",
    image: MGabi,
  },
  {
    name: "Emma Watson",
    credentials: "Cambridge TEFL • 5 Years Experience",
    specialty: "Business English",
    badge: "Business Specialist",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9aQriXcQOAfZQ1IF-y-EOrB5Ntxlyl7BkMRFhBjASDij7gAPxdXV38oMaA-81XKEoSAqj3rwlMONe0tI6laLYgD_ikLt3yjkYSuidW1ZbXE3a-1MdCFud_YCH-wrAzdndDV8G_lVuFR3WpMSMKkf-rNL3IGeBHqebUkiEqrRPBqSN1zxJ2U2mEZT07RdbU6JY7kTVFwdeo-sUjouCd0tz3IkNeG93uE6545GL8Dg",
  },
  {
    name: "Prof. David Chen",
    credentials: "MA Applied Linguistics • 7 Years Experience",
    specialty: "IELTS / TOEFL",
    badge: "Exam Prep Coach",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBZNEgxqgxCQjQ8ABW0cKwOIgzkp6mKGPdZ3ubv9cD1QRk0VUqqq3BhCqNaQjcCINMdgERXpJV1UYARhkjZBxexAu67-UVPXrUX__PYfWDMjXILJw9udp9vRm6nKlpGbcIrzA7NEqJ0G88mwySF-fHnlBBZkBt7MaW1ps4MJWAbS0L3T2r7Bt9gOP9AE4s4ne1w9llxYOnxLMTO1a5P_8rXY4pplBp_VK3iyT03ghs",
  },
];

export function TutorCarousel() {
  const [index, setIndex] = useState(0);
  const tutor = tutors[index];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Tutor network preview"
      className="w-full max-w-[380px] rotate-1 rounded-xl bg-surface-container-lowest p-md shadow-md transition-transform duration-300 hover:rotate-0"
    >
      <div aria-live="polite" aria-atomic="true">
        <div className="relative aspect-[4/4.5] overflow-hidden rounded-lg bg-surface-container">
          <Image
            src={tutor.image}
            alt={tutor.name}
            fill
            sizes="(max-width: 420px) 90vw, 348px"
            className="object-cover"
            priority={index === 0}
          />
          <span className="absolute top-4 left-4 inline-flex -rotate-3 items-center gap-xs rounded bg-primary px-sm py-base text-[11px] font-semibold tracking-wider text-on-primary uppercase shadow-sm">
            <BadgeCheck
              className="size-4 text-signal-yellow"
              aria-hidden="true"
            />
            {tutor.badge}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-xs pt-md pb-xs">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-primary">
              {tutor.name}
            </h2>
            <p className="text-caption text-on-surface-variant">
              {tutor.credentials}
            </p>
          </div>
          <span className="rounded-full bg-surface-container px-sm py-base text-caption font-medium">
            {tutor.specialty}
          </span>
        </div>
      </div>
      <div className="mt-xs flex items-center justify-between border-t border-surface-container pt-sm">
        <div className="flex gap-xs">
          {tutors.map((item, slide) => (
            <button
              key={item.name}
              type="button"
              aria-label={`Go to tutor ${slide + 1}`}
              aria-pressed={slide === index}
              onClick={() => setIndex(slide)}
              className="flex size-8 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span
                className={`size-2.5 rounded-full ${slide === index ? "bg-primary" : "bg-outline-variant"}`}
              />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-sm">
          <span className="text-caption font-medium text-on-surface-variant">
            {index + 1} of {tutors.length}
          </span>
          <button
            type="button"
            aria-label="Previous tutor"
            onClick={() =>
              setIndex((index + tutors.length - 1) % tutors.length)
            }
            className="flex size-8 items-center justify-center rounded-full bg-surface-container hover:bg-surface-variant"
          >
            <ChevronLeft className="size-[18px]" />
          </button>
          <button
            type="button"
            aria-label="Next tutor"
            onClick={() => setIndex((index + 1) % tutors.length)}
            className="flex size-8 items-center justify-center rounded-full bg-surface-container hover:bg-surface-variant"
          >
            <ChevronRight className="size-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
