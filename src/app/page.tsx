import Link from "next/link";
import { CalendarCheck, LogIn } from "lucide-react";
import { PublicNav } from "@/components/public/public-nav";
import { AppFooter } from "@/components/layout/app-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <PublicNav />
      <main className="flex-grow flex items-center justify-center px-gutter py-section-v">
        <div className="max-w-2xl text-center flex flex-col items-center gap-lg">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight">
            Sistema de Gestão de Aulas
          </h1>
          <p className="font-body text-subheading text-on-surface-variant max-w-[32rem]">
            Gerencie alunos, professores, planos e agendamentos da sua escola de inglês em um só
            lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-md">
            <Link
              href="/book"
              className="bg-primary text-on-primary font-ui-label text-ui-label px-lg py-sm rounded-[4px] hover:opacity-90 transition-opacity flex items-center justify-center gap-sm"
            >
              <CalendarCheck className="size-5" />
              Agendar Aula Experimental
            </Link>
            <Link
              href="/login"
              className="border border-primary text-primary font-ui-label text-ui-label px-lg py-sm rounded-[4px] hover:bg-mist-gray transition-colors flex items-center justify-center gap-sm"
            >
              <LogIn className="size-5" />
              Entrar
            </Link>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
