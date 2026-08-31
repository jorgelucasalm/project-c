import type {
  NotificationChannel,
  NotificationType,
} from "@/types/domain";

/** What a caller asks the NotificationService to deliver. */
export interface NotificationRequest {
  type: NotificationType;
  /** profile id of the recipient, when they have an account. */
  userId?: string | null;
  lessonId?: string | null;
  /** Force a specific channel; otherwise the service picks the best available one. */
  channel?: NotificationChannel;
  data?: Record<string, unknown>;
}

/** Recipient contact info resolved from profiles/students before dispatch. */
export interface NotificationRecipient {
  userId: string | null;
  fullName: string;
  email: string | null;
  phone: string | null;
}

export interface ResolvedNotification {
  type: NotificationType;
  recipient: NotificationRecipient;
  lessonId: string | null;
  data: Record<string, unknown>;
}

export interface ProviderResult {
  success: boolean;
  error?: string;
}

/** One delivery channel implementation (log, email, whatsapp, push, sms...). */
export interface NotificationProvider {
  readonly channel: NotificationChannel;
  /** Whether this provider has everything it needs (API keys, etc.) to run. */
  isConfigured(): boolean;
  send(notification: ResolvedNotification): Promise<ProviderResult>;
}
