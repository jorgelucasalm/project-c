import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import TeacherPage from "@/app/mariagdleal/page";
import { EarningsCalculator } from "@/components/public/earnings-calculator";
import { TutorCarousel } from "@/components/public/tutor-carousel";

describe("public home pages", () => {
  it("renders the teacher landing page with working section destinations", () => {
    const html = renderToStaticMarkup(createElement(HomePage));
    expect(html).toContain("Own your teaching business.");
    for (const id of ["why-teach", "features", "earnings", "how-it-works", "faq", "apply"]) {
      expect(html).toContain(`id="${id}"`);
      expect(html).toContain(`href="#${id}"`);
    }
    expect(html).toContain('href="/mariagdleal"');
    expect(html).toContain('href="/login"');
    expect(html).not.toContain("<script");
  });

  it("preserves the student home and points its navigation to the new route", () => {
    const html = renderToStaticMarkup(createElement(TeacherPage));
    expect(html).toContain("Your English journey starts here");
    expect(html).toContain('href="/mariagdleal#how-it-works"');
    expect(html).toContain('href="/mariagdleal#tutors"');
    expect(html).toContain('href="/book"');
  });

  it("preserves the order and content of the home sections", () => {
    const html = renderToStaticMarkup(createElement(HomePage));
    const sections = [
      'id="why-teach"',
      'aria-label="Platform at a glance"',
      'id="features"',
      'id="earnings"',
      'id="how-it-works"',
      'id="faq"',
      'id="apply"',
    ];
    const positions = sections.map((section) => html.indexOf(section));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(html).toContain("Weekly Schedule Template");
    expect(html).toContain("Model your weekly schedule and earnings");
    expect(html.match(/<article /g)).toHaveLength(6);
    expect(html.match(/<details /g)).toHaveLength(3);
    expect(html.indexOf("<header ")).toBeLessThan(html.indexOf("<main>"));
    expect(html.indexOf("<footer ")).toBeGreaterThan(html.indexOf("</main>"));
  });

  it("starts the earnings simulation at 20 hours, $35 per hour and $2,800 monthly", () => {
    const html = renderToStaticMarkup(createElement(EarningsCalculator));
    expect(html).toContain('min="10" max="40"');
    expect(html).toContain('min="20" max="60"');
    expect(html).toContain('value="20"');
    expect(html).toContain('value="35"');
    expect(html).toContain("$2,800");
    expect(html).toContain("not a guarantee of earnings");
  });

  it("renders three accessible carousel destinations and previous/next controls", () => {
    const html = renderToStaticMarkup(createElement(TutorCarousel));
    for (const slide of [1, 2, 3]) {
      expect(html).toContain(`aria-label="Go to tutor ${slide}"`);
    }
    expect(html).toContain('aria-label="Previous tutor"');
    expect(html).toContain('aria-label="Next tutor"');
    expect(html).toContain("Dr. Claire Bennett");
    expect(html).toContain("1 of 3");
  });
});
