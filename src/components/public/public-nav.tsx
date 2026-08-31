import Link from "next/link";
import { HelpCircle } from "lucide-react";

/** Public TopNavBar shared by the marketing/booking pages (not authenticated). */
export function PublicNav() {
  return (
    <nav className="bg-surface text-primary flex justify-between items-center h-16 px-lg sticky top-0 z-40 bg-surface/80 backdrop-blur-sm border-b border-smoke">
      <div className="flex items-center gap-md">
        <span className="font-headline text-headline-sm font-bold text-primary">
          Sistema de Gestão de Aulas
        </span>
      </div>
      <div className="hidden md:flex items-center gap-md">
        <Link href="/" className="text-primary hover:bg-mist-gray px-3 py-2 rounded transition-colors">
          Home
        </Link>
        <Link
          href="/login"
          className="text-on-surface-variant hover:bg-mist-gray px-3 py-2 rounded transition-colors"
        >
          Entrar
        </Link>
      </div>
      <div className="flex items-center gap-md">
        <button type="button" className="hover:bg-mist-gray p-2 rounded-full transition-colors" aria-label="Ajuda">
          <HelpCircle className="size-5" />
        </button>
        <Link
          href="/book"
          className="bg-primary text-on-primary font-ui-label text-ui-label px-md py-sm rounded-[4px] hover:opacity-90 transition-opacity"
        >
          Agendar
        </Link>
      </div>
    </nav>
  );
}
