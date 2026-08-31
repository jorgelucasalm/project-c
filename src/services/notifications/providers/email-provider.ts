import type { NotificationProvider, ResolvedNotification } from "@/services/notifications/types";
import { renderNotificationMessage } from "@/services/notifications/message-templates";

/**
 * Email delivery via Resend (https://resend.com). Activates automatically
 * once RESEND_API_KEY / NOTIFICATION_EMAIL_FROM are set — no code changes
 * needed elsewhere to turn this channel on.
 */
export class EmailNotificationProvider implements NotificationProvider {
  readonly channel = "email" as const;

  isConfigured() {
    return Boolean(process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAIL_FROM);
  }

  async send(notification: ResolvedNotification) {
    if (!notification.recipient.email) {
      return { success: false, error: "Recipient has no email address." };
    }

    const { subject, body } = renderNotificationMessage(notification);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.NOTIFICATION_EMAIL_FROM,
        to: notification.recipient.email,
        subject,
        text: body,
      }),
    });

    if (!response.ok) {
      return { success: false, error: `Resend responded with ${response.status}` };
    }

    return { success: true };
  }
}
