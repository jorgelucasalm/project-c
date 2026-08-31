import { NextResponse, type NextRequest } from "next/server";
import { createOAuthClient } from "@/lib/google-calendar/client";
import { createAdminClient } from "@/lib/supabase/admin";

/** Exchanges the OAuth code for tokens and stores them for the teacher (state = teacher id). */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const teacherId = searchParams.get("state");

  if (!code || !teacherId) {
    return NextResponse.redirect(`${origin}/availability?googleCalendar=error`);
  }

  const client = createOAuthClient();
  if (!client) {
    return NextResponse.redirect(`${origin}/availability?googleCalendar=not_configured`);
  }

  const { tokens } = await client.getToken(code);
  if (!tokens.access_token || !tokens.refresh_token) {
    return NextResponse.redirect(`${origin}/availability?googleCalendar=error`);
  }

  const supabase = createAdminClient();
  await supabase.from("calendar_integrations").upsert(
    {
      teacher_id: teacherId,
      provider: "google",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: new Date(tokens.expiry_date ?? Date.now() + 55 * 60_000).toISOString(),
      google_calendar_id: "primary",
    },
    { onConflict: "teacher_id" },
  );

  return NextResponse.redirect(`${origin}/availability?googleCalendar=connected`);
}
