import { z } from "zod";

export const studentSchema = z.object({
  full_name: z.string().trim().min(2, "Informe o nome completo."),
  email: z.string().trim().min(1, "Informe o email.").email("Email inválido."),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : null)),
  student_type: z.enum(["adult", "teen", "kids"]),
  status: z.enum(["active", "inactive", "pending"]),
  level: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : null)),
  notes: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : null)),
  plan_id: z
    .string()
    .uuid()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  teacher_id: z
    .string()
    .uuid()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
});

export type StudentInput = z.infer<typeof studentSchema>;
/** Pre-transform shape used by the form (RHF works with this, the schema
 * transforms empty strings to null right before hitting the server action). */
export type StudentFormValues = z.input<typeof studentSchema>;
