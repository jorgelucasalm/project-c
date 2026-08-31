import type { NotificationProvider, ResolvedNotification } from "@/services/notifications/types";

/**
 * Default fallback provider: records the notification to stdout (and, via
 * the caller, to the `notifications` table). Always "configured" so the
 * app never silently drops a notification before a real channel is wired
 * in — this is the safe default the spec asks for ("não acoplar a
 * WhatsApp"), not a fake/mocked delivery.
 */
export class LogNotificationProvider implements NotificationProvider {
  readonly channel = "log" as const;

  isConfigured() {
    return true;
  }

  async send(notification: ResolvedNotification) {
    console.info(
      `[notifications] ${notification.type} -> ${notification.recipient.fullName} (lesson ${notification.lessonId ?? "n/a"})`,
      notification.data,
    );
    return { success: true };
  }
}
