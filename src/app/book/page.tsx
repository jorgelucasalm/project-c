import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { PublicNav } from "@/components/public/public-nav";
import { AppFooter } from "@/components/layout/app-footer";
import { BookingForm } from "@/components/booking/booking-form";

export const metadata = {
  title: "Agendamento de Aula Experimental — English Academy",
};

export default async function BookPage() {
  const supabase = await createClient();
  const { data: teachers } = await supabase
    .from("teachers")
    .select("id, full_name")
    .order("full_name", { ascending: true });

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <PublicNav />
      <main className="flex-grow">
        <section className="bg-secondary-container py-section-v px-gutter md:px-lg overflow-hidden relative">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-xxl items-center">
            <div className="z-10 relative">
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-md tracking-tight">
                Sua jornada no inglês começa aqui
              </h1>
              <p className="font-body text-subheading text-on-surface-variant mb-xl max-w-lg">
                Agende uma aula experimental gratuita com um de nossos professores especialistas.
              </p>
            </div>
            <div className="relative h-[280px] md:h-[380px] flex justify-center items-center">
              <div className="absolute w-56 h-72 rounded-xl overflow-hidden border border-smoke -rotate-2 z-10">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuATYiqmYG6Lh1SrbfS3c2ROTh7siBCkqRto2vA36M1S6oEhzOAIrUPOeyAV673byN7bHvlPN95po0vrfhfGYcb6TlgDbllAjMIUsLlCWVjr3FH1pC98nUPGqaZwHSTlsEgdzrgkMHQ4HZWg5IY-qaEG1gsakG3RBW7GuWeIMZVJHXgHJfENmaCc5wTlWCZHQ4Z8X1lW9CiOkEFd8Bv_LGfYJ-KnSClcVAMoUe-pBQdsqbkNsnv2FGxL"
                  alt="Professora de inglês sorrindo em sala de aula"
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-4 left-4 bg-primary text-on-primary px-3 py-1 font-ui-label text-ui-label rounded-[4px] rotate-1 border border-smoke">
                  Teacher Sarah
                </span>
              </div>
              <div className="absolute w-48 h-60 rounded-xl overflow-hidden border border-smoke translate-x-20 translate-y-10 rotate-3 z-20">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDf0y6NXgOGpfpYw6EwRtJo0zKSMH84xV5WGM3MNnXXjKW9k5SSnMJPduEYEOXF5aOc3aNC1lMbZ9rOwOdTFt7ISwjKUrgQDhBieVUyagG7xh06yV-j5JWbQPMNc2n15lK-kU7a7mxJHmYAx7mj3t2SHEkbZ_RfDHvFrXqhTGMh8VXXQNeusSkCJ-qUB2Y5_JeQQV54AN3b1bD03nfpj4Lg1-GFSpBSymbPUrTZauc1rl96xy3icYqm"
                  alt="Grupo de alunos conversando durante aula de inglês"
                  fill
                  className="object-cover"
                />
                <span className="absolute top-4 right-4 bg-signal-yellow text-primary px-3 py-1 font-ui-label text-ui-label rounded-[4px] -rotate-2 border border-smoke">
                  Interactive!
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-section-v px-gutter md:px-lg bg-surface">
          <BookingForm teachers={teachers ?? []} />
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
