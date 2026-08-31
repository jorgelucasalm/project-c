import type { NotificationProvider, ResolvedNotification } from "@/services/notifications/types";

/**
 * Placeholder for a future SMS integration (e.g. Twilio). See PushProvider
 * for the rationale behind never faking a successful delivery.
 */
export class SmsNotificationProvider implements NotificationProvider {
  readonly channel = "sms" as const;

  isConfigured() {
    return false;
  }

  async send(_notification: ResolvedNotification) {
    return { success: false, error: "SMS notifications are not configured yet." };
  }
}
