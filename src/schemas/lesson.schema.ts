import { z } from "zod";

export const lessonSchema = z
  .object({
    teacher_id: z.string().uuid("Selecione um professor."),
    student_id: z.string().uuid("Selecione um aluno.").nullable(),
    plan_id: z.string().uuid().nullable().optional(),
    starts_at: z.string().min(1, "Informe a data/hora de início."),
    duration_minutes: z.coerce.number().int().min(15, "Duração mínima de 15 minutos."),
    type: z.enum(["regular", "trial", "makeup"]).default("regular"),
    location: z.enum(["online", "in_person"]).default("online"),
    notes: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? v : null)),
  })
  .refine((data) => data.type === "trial" || data.student_id !== null, {
    message: "Selecione um aluno para aulas regulares.",
    path: ["student_id"],
  });

export type LessonInput = z.infer<typeof lessonSchema>;
export type LessonFormValues = z.input<typeof lessonSchema>;

export const attendanceSchema = z.object({
  lesson_id: z.string().uuid(),
  student_id: z.string().uuid(),
  status: z.enum(["present", "absent", "excused"]),
});

export type AttendanceInput = z.infer<typeof attendanceSchema>;

export const rescheduleLessonSchema = z.object({
  lesson_id: z.string().uuid(),
  starts_at: z.string().min(1),
  duration_minutes: z.coerce.number().int().min(15),
});

export type RescheduleLessonInput = z.infer<typeof rescheduleLessonSchema>;
