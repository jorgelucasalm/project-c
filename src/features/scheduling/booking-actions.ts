"use server";

import { trialBookingSchema } from "@/schemas/booking.schema";
import * as bookingService from "@/services/booking";
import { notificationService } from "@/services/notifications";

export async function getAvailableSlotsAction(
  teacherId: string,
  day: string,
  durationMinutes: number,
) {
  return bookingService.getAvailableSlots(teacherId, day, durationMinutes);
}

export interface BookingActionResult {
  success: boolean;
  error?: string;
  lessonId?: string;
}

export async function bookTrialLessonAction(input: unknown): Promise<BookingActionResult> {
  const parsed = trialBookingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    const result = await bookingService.bookTrialLesson(parsed.data);
    await notificationService.send({
      type: "TRIAL_BOOKED",
      lessonId: result.lessonId,
      data: { startsAt: result.startsAt },
    });
    return { success: true, lessonId: result.lessonId };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Não foi possível confirmar o agendamento.",
    };
  }
}
