import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonClass, sectionClass } from "./styles";

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 bg-surface/95 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-md">
      <div className={`${sectionClass} flex min-h-20 flex-wrap items-center justify-between gap-sm py-sm`}>
        <div className="flex items-center gap-xl">
          <Link href="/" className="font-headline-sm text-headline-sm tracking-tight text-primary">English Academy</Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-lg font-ui-label text-ui-label lg:flex">
            <a href="#why-teach" className="font-bold text-primary">Why Teach with Us</a>
            <a href="#features" className="text-on-surface-variant hover:text-primary">Platform Features</a>
            <a href="#faq" className="text-on-surface-variant hover:text-primary">FAQ</a>
          </nav>
        </div>
        <div className="flex items-center gap-md">
          <Link href="/login" className="rounded-lg px-md py-xs font-ui-label text-ui-label hover:bg-surface-container">Log in</Link>
          <a href="#apply" className={buttonClass}>Start Teaching <ArrowRight className="size-4" aria-hidden="true" /></a>
        </div>
      </div>
    </header>
  );
}
