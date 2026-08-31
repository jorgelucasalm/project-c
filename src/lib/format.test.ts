import { describe, expect, it } from "vitest";
import { formatCentsToBRL, toDatetimeLocalValue } from "@/lib/format";

describe("formatCentsToBRL", () => {
  it("formats whole reais correctly", () => {
    expect(formatCentsToBRL(35000).replace(/\u00a0/g, " ")).toBe("R$ 350,00");
  });

  it("formats zero", () => {
    expect(formatCentsToBRL(0).replace(/\u00a0/g, " ")).toBe("R$ 0,00");
  });
});

describe("toDatetimeLocalValue", () => {
  it("produces a yyyy-MM-ddTHH:mm string", () => {
    const iso = new Date(2026, 0, 15, 9, 30).toISOString();
    expect(toDatetimeLocalValue(iso)).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });
});
