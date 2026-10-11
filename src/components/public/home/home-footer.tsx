import Link from "next/link";
import { sectionClass } from "./styles";

export function HomeFooter() {
  return (
    <footer className="bg-primary-container text-on-primary">
      <div className={`${sectionClass} py-section-v`}>
        <div className="mb-xxl grid gap-xl md:grid-cols-4">
          <div>
            <h2 className="mb-md font-headline-sm text-headline-sm tracking-tight">English Academy</h2>
            <p className="max-w-[20rem] text-body text-outline-variant">Empowering educators with flexible schedules and a workspace built for their teaching business.</p>
          </div>
          <div>
            <h3 className="mb-md font-ui-label text-ui-label tracking-wider uppercase">Teach With Us</h3>
            <ul className="space-y-sm text-body text-outline-variant">
              {[["Overview", "#why-teach"], ["Earnings Calculator", "#earnings"], ["Classroom Tools", "#features"], ["Getting Started", "#how-it-works"]].map(([label, href]) => <li key={href}><a href={href} className="hover:text-on-primary">{label}</a></li>)}
            </ul>
          </div>
          <div>
            <h3 className="mb-md font-ui-label text-ui-label tracking-wider uppercase">Explore</h3>
            <ul className="space-y-sm text-body text-outline-variant">
              <li><a href="#faq" className="hover:text-on-primary">Tutor FAQ</a></li>
              <li><Link href="/mariagdleal" className="hover:text-on-primary">Student Page</Link></li>
              <li><Link href="/book" className="hover:text-on-primary">Book a Trial Lesson</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-md font-ui-label text-ui-label tracking-wider uppercase">Your Workspace</h3>
            <p className="mb-md text-caption text-outline-variant">Organize your classes, keep track of students, and take control of your schedule.</p>
            <Link href="/login" className="inline-flex rounded-lg bg-surface-container-lowest px-lg py-sm font-ui-label text-ui-label text-primary hover:bg-surface-container">Log in</Link>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-md border-t border-graphite/40 pt-lg text-caption text-outline-variant">
          <p>© 2026 English Academy. All rights reserved.</p>
          <a href="#features" className="hover:text-on-primary">Built for independent teachers</a>
        </div>
      </div>
    </footer>
  );
}
