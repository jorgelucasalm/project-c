import { IdCard, Share2, SlidersHorizontal } from "lucide-react";
import { headingClass, sectionClass } from "./styles";

const steps = [
  { icon: IdCard, title: "Cadastre-se e Crie seu Perfil", description: "Preencha seus dados profissionais, especialidades de ensino e biografia para montar sua página pública de professor.", detail: "Uma página para apresentar seu trabalho" },
  { icon: SlidersHorizontal, title: "Defina seus Planos e Horários", description: "Configure suas janelas de disponibilidade semanal, conecte seu Google Calendar e personalize valores por aula ou pacotes.", detail: "Controle total da sua agenda" },
  { icon: Share2, title: "Compartilhe seu Link de Agendamento", description: "Divulgue seu link exclusivo de agendamento para atrair novos alunos e realizar aulas experimentais sem atritos.", detail: "Agendamento e confirmação automáticos" },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-surface-container py-section-v">
      <div className={sectionClass}>
        <div className="mx-auto mb-xl max-w-intro text-center">
          <span className="font-ui-label text-ui-label tracking-wider text-secondary-accent uppercase">Passo a Passo Simples</span>
          <h2 className={headingClass}>Do cadastro à sua primeira aula em minutos</h2>
        </div>
        <div className="grid gap-lg md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-lg shadow-sm">
              <div>
                <div className="mb-md flex items-center justify-between"><span className="font-headline text-headline text-secondary-accent">0{index + 1}</span><step.icon className="size-7" aria-hidden="true" /></div>
                <h3 className="mb-xs font-subheading text-subheading">{step.title}</h3>
                <p className="text-body text-on-surface-variant">{step.description}</p>
              </div>
              <p className={`mt-md pt-sm text-caption ${index === 2 ? "font-medium text-secondary-accent" : "text-on-surface-variant"}`}>{step.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
