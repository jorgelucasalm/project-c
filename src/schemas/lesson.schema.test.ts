import { describe, expect, it } from "vitest";
import { lessonSchema } from "@/schemas/lesson.schema";

const base = {
  teacher_id: "d36c49b3-8055-4fbd-8175-836af11a1821",
  starts_at: "2026-01-01T10:00",
  duration_minutes: 60,
  location: "online" as const,
};

describe("lessonSchema", () => {
  it("requires a student for regular lessons", () => {
    const result = lessonSchema.safeParse({
      ...base,
      student_id: null,
      type: "regular",
    });
    expect(result.success).toBe(false);
  });

  it("allows a null student for trial lessons", () => {
    const result = lessonSchema.safeParse({
      ...base,
      student_id: null,
      type: "trial",
    });
    expect(result.success).toBe(true);
  });

  it("requires a valid teacher uuid", () => {
    const result = lessonSchema.safeParse({
      ...base,
      teacher_id: "not-a-uuid",
      student_id: "89d6f283-0a0d-4a92-8b96-e861e57ae047",
      type: "regular",
    });
    expect(result.success).toBe(false);
  });

  it("rejects durations below 15 minutes", () => {
    const result = lessonSchema.safeParse({
      ...base,
      duration_minutes: 5,
      student_id: "89d6f283-0a0d-4a92-8b96-e861e57ae047",
      type: "regular",
    });
    expect(result.success).toBe(false);
  });
});
