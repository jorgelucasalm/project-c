# Lesson Management System

A lesson management application for an English school — students, teachers,
plans, availability, scheduling (calendar + public trial lesson booking),
optional Google Calendar integration, and a channel-independent notification
service (WhatsApp/Email/Push/SMS).

The UI was built from the reference HTML (`site.html`) and the design
system in `DESIGN.md`, preserving the original layout, typography (DM Sans +
Hanken Grotesk), colors, spacing, and navigation flows.

## Public pages

- `/`: teacher-focused homepage based on `test.html`, featuring a carousel,
  monthly revenue calculator (weekly hours × hourly rate × 4), sample
  schedule, and FAQ. The calculator is only a simulation; it neither persists
  data nor changes availability. Workspace access uses the existing login;
  there is no new teacher registration flow.
- `/mariagdleal`: former student homepage, preserved as a public page
  with a fixed ID for now, without a dynamic link to teacher profiles.
- `/book`: trial lesson booking.

Both homepages remain accessible to authenticated users as well.
The `secondary-accent` token preserves the HTML's pink color without changing
the semantic `secondary` token used by existing components. Text widths use
`max-w-intro` or explicit values to avoid collisions with spacing tokens.
Homepage sections live in `src/components/public/home/`; `src/app/page.tsx`
contains only metadata and page composition. Static components remain on
the server, while the carousel and calculator are client components.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
shadcn/ui · Supabase (Postgres + Auth + RLS) · FullCalendar · React Hook Form
+ Zod · Lucide Icons · googleapis.

## Architecture

```
src/
├── app/                # Routes (App Router). (app)/ = authenticated area
├── components/         # Reusable UI components, organized by domain
├── features/           # Server Actions + UI schemas by domain
├── lib/
│   ├── supabase/       # Clients (browser/server/admin) + middleware
│   └── google-calendar/# Isolated Google Calendar integration
├── services/           # Data access / business rules (Supabase)
│   └── notifications/  # NotificationService (pluggable providers)
├── schemas/             # Shared Zod validation
└── types/               # Domain types + Supabase schema mirror

supabase/
├── migrations/          # SQL schema, RLS, functions (version-controlled)
├── functions/           # Edge Functions (Deno)
└── seed.sql             # Sample data for local development
```

Business rules (availability, scheduling conflicts, notifications,
Google Calendar synchronization) live in `services/`; Server Actions in
`features/*/actions.ts` only validate input (Zod) and delegate.

## Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com) (or run
   `supabase start` locally using the CLI).
2. Apply the migrations in order using the SQL editor or `supabase db push`:
   - `supabase/migrations/0001_init.sql` — tables, enums, triggers, and the
     exclusion constraint that prevents overlapping schedules for each teacher
     (conflict validation **in the database**, not just on the frontend).
   - `supabase/migrations/0002_rls.sql` — Row Level Security for
     `admin` / `teacher` / `student`.
   - `supabase/migrations/0003_functions.sql` — `get_available_slots()` and
     `book_trial_lesson()`, the RPCs powering the public trial lesson flow
     without exposing tables directly to anonymous users.
   - `supabase/migrations/0004_cron.sql` — enables `pg_cron`/`pg_net` to
     schedule the reminder Edge Function (see the comment in the file).
3. (Optional, development) run `supabase/seed.sql` to create sample plans
   and teachers.
4. Copy `.env.example` to `.env.local` and fill in
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
   `SUPABASE_SERVICE_ROLE_KEY`.

The migrations were validated end to end (schema, RLS, RPCs, and the
conflict-prevention constraint) against a real Postgres instance before being
included in this repository.

## Running locally

```bash
npm install
npm run dev       # http://localhost:3000
npm run test      # Vitest — schemas and helpers
npm run lint
npm run build
```

## Authentication and roles

Login uses Supabase Auth (email/password). A trigger on `profiles`
automatically creates a profile at signup with the default `role` of `student`
(set `admin`/`teacher` through `raw_user_meta_data.role` when creating the user,
or update it later using the service role key). The middleware (`src/proxy.ts`)
protects `(app)` routes, and each page enforces the minimum required role
through `requireRole()`.

## Google Calendar

Isolated in `src/lib/google-calendar/`. Without configured credentials
(`GOOGLE_CALENDAR_*` in `.env`), the integration is automatically inactive —
Supabase remains the source of truth, and the application continues to work.
With credentials configured, a teacher connects their account under
**Availability → Google Calendar**, and lessons are automatically
created/updated/canceled in Google Calendar.

## Notifications

`src/services/notifications/notification-service.ts` exposes:

```ts
await notificationService.send({ type: "LESSON_REMINDER", userId, lessonId });
```

Providers (`whatsapp`, `email`, `sms`, `push`, `log`) implement the same
interface and only become active when the corresponding credentials exist in
`.env` — otherwise, everything falls back to the `log` provider (writes to
`notifications` and stdout), without mocking an integration that does not exist.

Lesson reminders (~10 minutes beforehand) are automatically scheduled by a
database trigger and delivered by `supabase/functions/lesson-reminders`
(an Edge Function scheduled through `pg_cron`; see `0004_cron.sql`).

## Visual fidelity

The tokens from the `tailwind.config` embedded in `site.html` (colors, spacing,
typography, radius) were ported 1:1 to `src/app/globals.css` through
`@theme`, so classes such as `bg-mist-gray`, `font-headline`,
`text-headline`, and `p-lg` work exactly as in the reference HTML. The HTML's
Material Symbols icons were mapped to their closest Lucide equivalents
(`src/lib/icons.ts`), as required by the stack.
