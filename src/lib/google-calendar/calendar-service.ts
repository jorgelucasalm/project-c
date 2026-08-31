import "server-only";
import { google } from "googleapis";
import { createAdminClient } from "@/lib/supabase/admin";
import { createOAuthClient, isGoogleCalendarConfigured } from "@/lib/google-calendar/client";
import type {
  CalendarProvider,
  GoogleCalendarEventInput,
  GoogleCalendarEventResult,
} from "@/lib/google-calendar/types";

async function getIntegration(teacherId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("calendar_integrations")
    .select("*")
    .eq("teacher_id", teacherId)
    .maybeSingle();
  return data;
}

async function getAuthorizedClient(teacherId: string) {
  const integration = await getIntegration(teacherId);
  if (!integration) return null;

  const client = createOAuthClient();
  if (!client) return null;

  client.setCredentials({
    access_token: integration.access_token,
    refresh_token: integration.refresh_token,
    expiry_date: new Date(integration.token_expires_at).getTime(),
  });

  client.on("tokens", async (tokens) => {
    if (!tokens.access_token) return;
    const supabase = createAdminClient();
    await supabase
      .from("calendar_integrations")
      .update({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token ?? integration.refresh_token,
        token_expires_at: new Date(
          tokens.expiry_date ?? Date.now() + 55 * 60_000,
        ).toISOString(),
      })
      .eq("teacher_id", teacherId);
  });

  return { client, calendarId: integration.google_calendar_id };
}

function toGoogleEvent(event: GoogleCalendarEventInput) {
  return {
    summary: event.summary,
    description: event.description,
    start: { dateTime: event.startIso },
    end: { dateTime: event.endIso },
    attendees: event.attendeeEmails?.map((email) => ({ email })),
  };
}

/** Google Calendar implementation of CalendarProvider. See index.ts for the public API. */
export const googleCalendarProvider: CalendarProvider = {
  async isConnected(teacherId) {
    if (!isGoogleCalendarConfigured()) return false;
    return Boolean(await getIntegration(teacherId));
  },

  async createEvent(teacherId, event): Promise<GoogleCalendarEventResult | null> {
    const authorized = await getAuthorizedClient(teacherId);
    if (!authorized) return null;

    const calendar = google.calendar({ version: "v3", auth: authorized.client });
    const { data } = await calendar.events.insert({
      calendarId: authorized.calendarId,
      requestBody: toGoogleEvent(event),
    });

    return { eventId: data.id!, htmlLink: data.htmlLink ?? null };
  },

  async updateEvent(teacherId, eventId, event): Promise<GoogleCalendarEventResult | null> {
    const authorized = await getAuthorizedClient(teacherId);
    if (!authorized) return null;

    const calendar = google.calendar({ version: "v3", auth: authorized.client });
    const { data } = await calendar.events.update({
      calendarId: authorized.calendarId,
      eventId,
      requestBody: toGoogleEvent(event),
    });

    return { eventId: data.id!, htmlLink: data.htmlLink ?? null };
  },

  async deleteEvent(teacherId, eventId): Promise<void> {
    const authorized = await getAuthorizedClient(teacherId);
    if (!authorized) return;

    const calendar = google.calendar({ version: "v3", auth: authorized.client });
    try {
      await calendar.events.delete({ calendarId: authorized.calendarId, eventId });
    } catch {
      // Event may already be gone on Google's side — nothing to reconcile.
    }
  },
};
