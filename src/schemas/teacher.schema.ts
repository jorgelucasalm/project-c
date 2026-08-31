import { z } from "zod";

export const teacherSchema = z.object({
  full_name: z.string().trim().min(2, "Informe o nome completo."),
  email: z.string().trim().min(1, "Informe o email.").email("Email inválido."),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : null)),
  bio: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : null)),
  color: z.string().trim().default("#99c5ff"),
});

export type TeacherInput = z.infer<typeof teacherSchema>;
export type TeacherFormValues = z.input<typeof teacherSchema>;

export const availabilitySlotSchema = z
  .object({
    weekday: z.coerce.number().int().min(0).max(6),
    start_time: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:mm"),
    end_time: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:mm"),
  })
  .refine((data) => data.end_time > data.start_time, {
    message: "O horário final deve ser depois do inicial.",
    path: ["end_time"],
  });

export type AvailabilitySlotInput = z.infer<typeof availabilitySlotSchema>;
export type AvailabilitySlotFormValues = z.input<typeof availabilitySlotSchema>;
