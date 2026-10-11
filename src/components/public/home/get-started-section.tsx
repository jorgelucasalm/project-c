import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonClass, headingClass, sectionClass } from "./styles";

export function GetStartedSection() {
  return (
    <section id="apply" className="scroll-mt-24 bg-secondary-container py-section-v">
      <div className={`${sectionClass} flex flex-col items-center gap-md text-center`}>
        <h2 className={headingClass}>Your teaching business, your way.</h2>
        <p className="max-w-intro text-body">Already part of English Academy? Log in to manage your lessons. Want to see the student experience? Explore our public page.</p>
        <div className="flex flex-wrap justify-center gap-md">
          <Link href="/login" className={buttonClass}>Access your workspace <ArrowRight className="size-4" aria-hidden="true" /></Link>
          <Link href="/mariagdleal" className="rounded-lg bg-surface-container-lowest px-lg py-sm font-ui-label text-ui-label hover:bg-surface-container">View student page</Link>
        </div>
      </div>
    </section>
  );
}
