import { describe, expect, it } from "vitest";
import { studentSchema } from "@/schemas/student.schema";

describe("studentSchema", () => {
  it("accepts a minimal valid student", () => {
    const result = studentSchema.safeParse({
      full_name: "Ana Maria Silva",
      email: "ana@example.com",
      student_type: "adult",
      status: "active",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBeNull();
      expect(result.data.plan_id).toBeNull();
    }
  });

  it("rejects an invalid email", () => {
    const result = studentSchema.safeParse({
      full_name: "Ana Maria Silva",
      email: "not-an-email",
      student_type: "adult",
      status: "active",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = studentSchema.safeParse({
      full_name: "A",
      email: "ana@example.com",
      student_type: "adult",
      status: "active",
    });
    expect(result.success).toBe(false);
  });

  it("normalizes empty optional strings to null", () => {
    const result = studentSchema.safeParse({
      full_name: "Ana Maria Silva",
      email: "ana@example.com",
      student_type: "adult",
      status: "active",
      phone: "",
      level: "",
      notes: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBeNull();
      expect(result.data.level).toBeNull();
      expect(result.data.notes).toBeNull();
    }
  });
});
