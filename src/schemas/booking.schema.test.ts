import { describe, expect, it } from "vitest";
import { trialBookingSchema } from "@/schemas/booking.schema";

describe("trialBookingSchema", () => {
  it("accepts a valid trial booking without a phone", () => {
    const result = trialBookingSchema.safeParse({
      teacher_id: "d36c49b3-8055-4fbd-8175-836af11a1821",
      starts_at: "2026-01-01T10:00:00.000Z",
      duration_minutes: 60,
      full_name: "Maria Silva",
      email: "maria@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing teacher", () => {
    const result = trialBookingSchema.safeParse({
      teacher_id: "",
      starts_at: "2026-01-01T10:00:00.000Z",
      full_name: "Maria Silva",
      email: "maria@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = trialBookingSchema.safeParse({
      teacher_id: "d36c49b3-8055-4fbd-8175-836af11a1821",
      starts_at: "2026-01-01T10:00:00.000Z",
      full_name: "Maria Silva",
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("defaults duration_minutes to 60 when omitted", () => {
    const result = trialBookingSchema.safeParse({
      teacher_id: "d36c49b3-8055-4fbd-8175-836af11a1821",
      starts_at: "2026-01-01T10:00:00.000Z",
      full_name: "Maria Silva",
      email: "maria@example.com",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.duration_minutes).toBe(60);
    }
  });
});
