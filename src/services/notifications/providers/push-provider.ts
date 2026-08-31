import type { NotificationProvider, ResolvedNotification } from "@/services/notifications/types";

/**
 * Placeholder for a future Web Push / FCM integration. Intentionally never
 * "configured" until real push credentials + a subscription store exist —
 * this keeps the channel registered (so callers can request it) without
 * faking a delivery that never actually happened.
 */
export class PushNotificationProvider implements NotificationProvider {
  readonly channel = "push" as const;

  isConfigured() {
    return false;
  }

  async send(_notification: ResolvedNotification) {
    return { success: false, error: "Push notifications are not configured yet." };
  }
}
