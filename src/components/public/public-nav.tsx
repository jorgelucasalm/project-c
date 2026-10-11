import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { LanguageSelector } from "@/components/public/language-selector";

export function PublicNav({ homeHref = "/mariagdleal" }: { homeHref?: string }) {
  return (
    <nav className="text-primary font-headline text-subheading flex flex-wrap md:flex-nowrap justify-between items-center min-h-16 md:h-16 gap-sm py-sm md:py-0 px-gutter md:px-lg sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-smoke transition-all duration-200">
      <div className="flex items-center gap-md">
        <Link href="/" className="font-headline text-headline-sm font-bold text-primary tracking-tight">
          English Academy
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-lg text-[15px] font-medium font-body">
        <Link href={homeHref} className="text-primary font-semibold hover:text-graphite hover:underline underline-offset-4 transition-colors">
          Home
        </Link>
        <Link href={`${homeHref}#how-it-works`} className="text-graphite hover:text-primary transition-colors">
          How it works
        </Link>
        <Link href={`${homeHref}#tutors`} className="text-graphite hover:text-primary transition-colors">
          Why us
        </Link>
      </div>

      <div className="flex w-full sm:w-auto justify-end items-center gap-3 md:gap-md">
        <LanguageSelector />

        <button
          type="button"
          className="hover:bg-mist-gray p-2 rounded-full transition-all duration-200 text-graphite hover:text-primary"
          title="Help & Support"
          aria-label="Help & Support"
        >
          <HelpCircle className="size-5" />
        </button>

        <Link
          href="/book"
          className="bg-primary text-on-primary px-5 py-2 rounded-DEFAULT font-ui-label text-ui-label whitespace-nowrap hover:opacity-90 transition-opacity"
        >
          Book Lesson
        </Link>
      </div>
    </nav>
  );
}
