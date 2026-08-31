import { notificationService } from "@/services/notifications/notification-service";
import type { LessonWithRelations, NotificationType } from "@/types/domain";

export { notificationService } from "@/services/notifications/notification-service";
export type { NotificationRequest } from "@/services/notifications/types";

/** Convenience wrapper used by the lessons service after create/cancel/reschedule. */
export async function notifyLessonEvent(type: NotificationType, lesson: LessonWithRelations) {
  if (!lesson.student_id) return;

  await notificationService.send({
    type,
    lessonId: lesson.id,
    data: { startsAt: lesson.starts_at, endsAt: lesson.ends_at },
  });
}
