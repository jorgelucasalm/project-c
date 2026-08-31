import type { ResolvedNotification } from "@/services/notifications/types";

const TEMPLATES: Record<ResolvedNotification["type"], (n: ResolvedNotification) => { subject: string; body: string }> = {
  LESSON_REMINDER: (n) => ({
    subject: "Lembrete: sua aula começa em 10 minutos",
    body: `Olá ${n.recipient.fullName}, sua aula começa em 10 minutos. Nos vemos lá!`,
  }),
  LESSON_CREATED: (n) => ({
    subject: "Aula agendada",
    body: `Olá ${n.recipient.fullName}, sua aula foi agendada com sucesso.`,
  }),
  LESSON_CANCELED: (n) => ({
    subject: "Aula cancelada",
    body: `Olá ${n.recipient.fullName}, sua aula foi cancelada.`,
  }),
  LESSON_RESCHEDULED: (n) => ({
    subject: "Aula reagendada",
    body: `Olá ${n.recipient.fullName}, sua aula foi reagendada.`,
  }),
  TRIAL_BOOKED: (n) => ({
    subject: "Aula experimental confirmada",
    body: `Olá ${n.recipient.fullName}, sua aula experimental foi confirmada. Ao concluir, você concorda com nossos termos de serviço.`,
  }),
  PLAN_EXPIRING: (n) => ({
    subject: "Seu plano está expirando",
    body: `Olá ${n.recipient.fullName}, seu plano está próximo do vencimento.`,
  }),
};

export function renderNotificationMessage(notification: ResolvedNotification) {
  return TEMPLATES[notification.type](notification);
}
