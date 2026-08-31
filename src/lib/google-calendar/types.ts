export interface GoogleCalendarEventInput {
  summary: string;
  description?: string;
  startIso: string;
  endIso: string;
  attendeeEmails?: string[];
}

export interface GoogleCalendarEventResult {
  eventId: string;
  htmlLink: string | null;
}

export interface GoogleCalendarTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

/**
 * Everything the rest of the app is allowed to know about Google Calendar.
 * The domain layer (services/lessons.ts) only ever talks to this interface —
 * never to googleapis or OAuth details directly.
 */
export interface CalendarProvider {
  isConnected(teacherId: string): Promise<boolean>;
  createEvent(
    teacherId: string,
    event: GoogleCalendarEventInput,
  ): Promise<GoogleCalendarEventResult | null>;
  updateEvent(
    teacherId: string,
    eventId: string,
    event: GoogleCalendarEventInput,
  ): Promise<GoogleCalendarEventResult | null>;
  deleteEvent(teacherId: string, eventId: string): Promise<void>;
}
