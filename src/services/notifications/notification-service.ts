import { createAdminClient } from "@/lib/supabase/admin";
import { LogNotificationProvider } from "@/services/notifications/providers/log-provider";
import { EmailNotificationProvider } from "@/services/notifications/providers/email-provider";
import { WhatsAppNotificationProvider } from "@/services/notifications/providers/whatsapp-provider";
import { PushNotificationProvider } from "@/services/notifications/providers/push-provider";
import { SmsNotificationProvider } from "@/services/notifications/providers/sms-provider";
import type {
  NotificationProvider,
  NotificationRecipient,
  NotificationRequest,
  ResolvedNotification,
} from "@/services/notifications/types";

/**
 * Providers in delivery-preference order. The first configured one (for the
 * explicitly requested channel, or the first available when none is
 * requested) is used. Adding a new channel is a one-line change here — the
 * rest of the app never needs to know it exists.
 */
const PROVIDERS: NotificationProvider[] = [
  new WhatsAppNotificationProvider(),
  new EmailNotificationProvider(),
  new SmsNotificationProvider(),
  new PushNotificationProvider(),
  new LogNotificationProvider(),
];

async function resolveRecipient(request: NotificationRequest): Promise<NotificationRecipient> {
  const supabase = createAdminClient();

  if (request.userId) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone")
      .eq("id", request.userId)
      .maybeSingle();

    if (data) {
      return { userId: data.id, fullName: data.full_name, email: data.email, phone: data.phone };
    }
  }

  if (request.lessonId) {
    const { data } = await supabase
      .from("lessons")
      .select("student:students(profile_id, full_name, email, phone)")
      .eq("id", request.lessonId)
      .maybeSingle();

    const student = (
      data as { student: { profile_id: string | null; full_name: string; email: string; phone: string | null } | null } | null
    )?.student;

    if (student) {
      return {
        userId: student.profile_id,
        fullName: student.full_name,
        email: student.email,
        phone: student.phone,
      };
    }
  }

  return { userId: request.userId ?? null, fullName: "Aluno(a)", email: null, phone: null };
}

/**
 * NotificationService — the single entry point the rest of the app uses to
 * notify people. It is completely decoupled from any specific channel
 * (WhatsApp, email, push, SMS): callers only describe *what* happened.
 *
 *   await notificationService.send({ type: "LESSON_REMINDER", userId, lessonId })
 */
export const notificationService = {
  async send(request: NotificationRequest): Promise<void> {
    const supabase = createAdminClient();
    const recipient = await resolveRecipient(request);

    const resolved: ResolvedNotification = {
      type: request.type,
      recipient,
      lessonId: request.lessonId ?? null,
      data: request.data ?? {},
    };

    const candidates = request.channel
      ? PROVIDERS.filter((p) => p.channel === request.channel)
      : PROVIDERS;

    const provider = candidates.find((p) => p.isConfigured()) ?? new LogNotificationProvider();
    const result = await provider.send(resolved);

    await supabase.from("notifications").insert({
      type: request.type,
      channel: provider.channel,
      user_id: recipient.userId,
      lesson_id: request.lessonId ?? null,
      status: result.success ? "sent" : "failed",
      payload: (request.data ?? {}) as never,
      sent_at: result.success ? new Date().toISOString() : null,
    });
  },
};
