import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/features/auth/session";
import { buildAuthUrl, isGoogleCalendarConfigured } from "@/lib/google-calendar/client";
import { createClient } from "@/lib/supabase/server";

/** Starts the OAuth flow so a teacher can connect their Google Calendar. */
export async function GET(_request: NextRequest) {
  const profile = await requireRole(["teacher", "admin"]);

  if (!isGoogleCalendarConfigured()) {
    return NextResponse.json(
      { error: "Google Calendar não está configurado neste ambiente." },
      { status: 501 },
    );
  }

  const supabase = await createClient();
  const { data: teacher } = await supabase
    .from("teachers")
    .select("id")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (!teacher) {
    return NextResponse.json({ error: "Perfil de professor não encontrado." }, { status: 404 });
  }

  const url = buildAuthUrl(teacher.id);
  return NextResponse.redirect(url);
}
