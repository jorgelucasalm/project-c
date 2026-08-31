import { z } from "zod";

export const planSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do plano."),
  price_cents: z.coerce.number().int().min(0, "O preço não pode ser negativo."),
  lesson_duration_minutes: z.coerce
    .number()
    .int()
    .min(15, "Duração mínima de 15 minutos."),
  lessons_per_cycle: z.coerce.number().int().min(1, "Ao menos 1 aula por ciclo."),
  status: z.enum(["active", "inactive"]),
});

export type PlanInput = z.infer<typeof planSchema>;
export type PlanFormValues = z.input<typeof planSchema>;
