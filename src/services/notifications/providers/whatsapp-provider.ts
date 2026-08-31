import type { NotificationProvider, ResolvedNotification } from "@/services/notifications/types";
import { renderNotificationMessage } from "@/services/notifications/message-templates";

/**
 * WhatsApp delivery via the Meta WhatsApp Cloud API. Activates automatically
 * once WHATSAPP_API_TOKEN / WHATSAPP_PHONE_NUMBER_ID are set. Kept fully
 * isolated behind the NotificationProvider interface so the rest of the app
 * never talks to WhatsApp directly.
 */
export class WhatsAppNotificationProvider implements NotificationProvider {
  readonly channel = "whatsapp" as const;

  isConfigured() {
    return Boolean(
      process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID,
    );
  }

  async send(notification: ResolvedNotification) {
    if (!notification.recipient.phone) {
      return { success: false, error: "Recipient has no phone number." };
    }

    const { body } = renderNotificationMessage(notification);

    const response = await fetch(
      `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: notification.recipient.phone.replace(/\D/g, ""),
          type: "text",
          text: { body },
        }),
      },
    );

    if (!response.ok) {
      return { success: false, error: `WhatsApp API responded with ${response.status}` };
    }

    return { success: true };
  }
}
