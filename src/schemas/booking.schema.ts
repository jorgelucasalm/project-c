import { z } from "zod";

/** Public "aula experimental" (trial lesson) booking form. */
export const trialBookingSchema = z.object({
  teacher_id: z.string().uuid("Selecione um professor."),
  starts_at: z.string().min(1, "Selecione um horário."),
  duration_minutes: z.coerce.number().int().min(15).default(60),
  full_name: z.string().trim().min(2, "Informe seu nome completo."),
  email: z.string().trim().min(1, "Informe seu email.").email("Email inválido."),
  phone: z
    .string()
    .trim()
    .min(8, "Informe um WhatsApp válido.")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
});

export type TrialBookingInput = z.infer<typeof trialBookingSchema>;
export type TrialBookingFormValues = z.input<typeof trialBookingSchema>;
