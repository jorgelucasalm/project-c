import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const { getUser } = vi.hoisted(() => ({ getUser: vi.fn() }));

vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({ auth: { getUser } }),
}));

describe("public home routes", () => {
  beforeEach(() => {
    getUser.mockResolvedValue({ data: { user: null } });
  });

  it.each(["/", "/mariagdleal", "/book"])("allows anonymous access to %s", async (path) => {
    const response = await updateSession(new NextRequest(`http://localhost:3000${path}`));
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it.each(["/", "/mariagdleal"])("keeps %s accessible when logged in", async (path) => {
    getUser.mockResolvedValue({ data: { user: { id: "teacher-id" } } });
    const response = await updateSession(new NextRequest(`http://localhost:3000${path}`));
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it.each(["/dashboard", "/teachers", "/students", "/availability", "/settings", "/other-id"])("still protects %s", async (path) => {
    const response = await updateSession(new NextRequest(`http://localhost:3000${path}`));
    const location = new URL(response.headers.get("location")!);
    expect(response.status).toBe(307);
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.get("redirectTo")).toBe(path);
  });

  it("still redirects authenticated login requests to the dashboard", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "teacher-id" } } });
    const response = await updateSession(new NextRequest("http://localhost:3000/login"));
    expect(response.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });
});
