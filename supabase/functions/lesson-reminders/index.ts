// supabase/functions/lesson-reminders/index.ts
//
// Scheduled Edge Function (deploy + schedule via `supabase functions deploy`
// and a Cron trigger — e.g. every minute — in the Supabase dashboard or
// `supabase/config.toml`). It polls `notifications` rows that are due
// (status = 'pending' and scheduled_for <= now(), which the lessons trigger
// populates automatically ~10 minutes before each lesson) and delivers them.
//
// Mirrors the NotificationProvider architecture in
// src/services/notifications/ (WhatsApp > Email > SMS > log), but runs
// standalone in Deno since Edge Functions can't import the Next.js app.
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const WHATSAPP_API_TOKEN = Deno.env.get("WHATSAPP_API_TOKEN");
const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFICATION_EMAIL_FROM = Deno.env.get("NOTIFICATION_EMAIL_FROM");

interface PendingNotification {
  id: string;
  type: string;
  lesson_id: string | null;
  user_id: string | null;
}

interface Recipient {
  fullName: string;
  email: string | null;
  phone: string | null;
}

async function resolveRecipient(
  supabase: ReturnType<typeof createClient>,
  notification: PendingNotification,
): Promise<Recipient> {
  if (notification.user_id) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, email, phone")
      .eq("id", notification.user_id)
      .maybeSingle();
    if (data) return { fullName: data.full_name, email: data.email, phone: data.phone };
  }

  if (notification.lesson_id) {
    const { data } = await supabase
      .from("lessons")
      .select("student:students(full_name, email, phone)")
      .eq("id", notification.lesson_id)
      .maybeSingle();
    const student = (data as { student: Recipient & { full_name: string } } | null)?.student;
    if (student) return { fullName: student.full_name, email: student.email, phone: student.phone };
  }

  return { fullName: "Aluno(a)", email: null, phone: null };
}

async function deliver(recipient: Recipient): Promise<{ channel: string; success: boolean }> {
  const body = `Olá ${recipient.fullName}, sua aula começa em 10 minutos. Nos vemos lá!`;

  if (WHATSAPP_API_TOKEN && WHATSAPP_PHONE_NUMBER_ID && recipient.phone) {
    const res = await fetch(
      `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: recipient.phone.replace(/\D/g, ""),
          type: "text",
          text: { body },
        }),
      },
    );
    return { channel: "whatsapp", success: res.ok };
  }

  if (RESEND_API_KEY && NOTIFICATION_EMAIL_FROM && recipient.email) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: NOTIFICATION_EMAIL_FROM,
        to: recipient.email,
        subject: "Lembrete: sua aula começa em 10 minutos",
        text: body,
      }),
    });
    return { channel: "email", success: res.ok };
  }

  console.info(`[lesson-reminders] ${body}`);
  return { channel: "log", success: true };
}

Deno.serve(async (req) => {
  if (req.headers.get("Authorization") !== `Bearer ${SERVICE_ROLE_KEY}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: due, error } = await supabase
    .from("notifications")
    .select("id, type, lesson_id, user_id")
    .eq("status", "pending")
    .eq("type", "LESSON_REMINDER")
    .lte("scheduled_for", new Date().toISOString())
    .limit(100);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  let sent = 0;
  let failed = 0;

  for (const notification of (due ?? []) as PendingNotification[]) {
    const recipient = await resolveRecipient(supabase, notification);
    const result = await deliver(recipient);

    await supabase
      .from("notifications")
      .update({
        status: result.success ? "sent" : "failed",
        channel: result.channel,
        sent_at: result.success ? new Date().toISOString() : null,
      })
      .eq("id", notification.id);

    if (result.success) sent++;
    else failed++;
  }

  return new Response(JSON.stringify({ processed: (due ?? []).length, sent, failed }), {
    headers: { "Content-Type": "application/json" },
  });
});
