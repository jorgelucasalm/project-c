-- ============================================================================
-- 0001_init.sql
-- Core schema for the Sistema de Gestão de Aulas (English school management).
-- Supabase Postgres. Run via `supabase db push` or the SQL editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto";      -- gen_random_uuid()
create extension if not exists "btree_gist";     -- exclusion constraints on ranges + equality

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
create type public.user_role as enum ('admin', 'teacher', 'student');
create type public.student_status as enum ('active', 'inactive', 'pending');
create type public.student_type as enum ('adult', 'teen', 'kids');
create type public.subscription_status as enum ('active', 'inactive', 'pending', 'canceled');
create type public.lesson_status as enum ('scheduled', 'completed', 'canceled', 'no_show', 'rescheduled');
create type public.lesson_type as enum ('regular', 'trial', 'makeup');
create type public.lesson_location as enum ('online', 'in_person');
create type public.attendance_status as enum ('present', 'absent', 'excused');
create type public.notification_type as enum (
  'LESSON_REMINDER', 'LESSON_CREATED', 'LESSON_CANCELED', 'LESSON_RESCHEDULED',
  'TRIAL_BOOKED', 'PLAN_EXPIRING'
);
create type public.notification_channel as enum ('whatsapp', 'email', 'push', 'sms', 'log');
create type public.notification_status as enum ('pending', 'sent', 'failed');

-- ----------------------------------------------------------------------------
-- profiles — 1:1 with auth.users, carries the app role
-- ----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'student',
  full_name text not null,
  email text not null,
  avatar_url text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles (role);

-- Auto-create a profile row whenever a new auth user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.email,
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'student')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- plans
-- ----------------------------------------------------------------------------
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_cents integer not null check (price_cents >= 0),
  lesson_duration_minutes integer not null check (lesson_duration_minutes > 0),
  lessons_per_cycle integer not null check (lessons_per_cycle > 0),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- teachers
-- ----------------------------------------------------------------------------
create table public.teachers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles (id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  bio text,
  color text default '#99c5ff',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index teachers_profile_id_idx on public.teachers (profile_id);

-- ----------------------------------------------------------------------------
-- students — profile_id is nullable so public trial bookings can create a
-- prospective student before any auth account exists (converted later).
-- ----------------------------------------------------------------------------
create table public.students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles (id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  student_type public.student_type not null default 'adult',
  status public.student_status not null default 'pending',
  level text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index students_profile_id_idx on public.students (profile_id);
create index students_status_idx on public.students (status);

-- ----------------------------------------------------------------------------
-- subscriptions — links a student to a plan (and optionally a fixed teacher)
-- ----------------------------------------------------------------------------
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  plan_id uuid not null references public.plans (id) on delete restrict,
  teacher_id uuid references public.teachers (id) on delete set null,
  status public.subscription_status not null default 'pending',
  started_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subscriptions_student_id_idx on public.subscriptions (student_id);
create index subscriptions_plan_id_idx on public.subscriptions (plan_id);

-- ----------------------------------------------------------------------------
-- teacher_availability — recurring weekly availability windows
-- ----------------------------------------------------------------------------
create table public.teacher_availability (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers (id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6), -- 0 = Sunday
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  constraint availability_valid_range check (end_time > start_time)
);

create index teacher_availability_teacher_id_idx on public.teacher_availability (teacher_id, weekday);

-- ----------------------------------------------------------------------------
-- lessons — the core scheduling entity
-- ----------------------------------------------------------------------------
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers (id) on delete restrict,
  student_id uuid references public.students (id) on delete set null,
  plan_id uuid references public.plans (id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.lesson_status not null default 'scheduled',
  type public.lesson_type not null default 'regular',
  location public.lesson_location not null default 'online',
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  google_calendar_event_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lessons_valid_range check (ends_at > starts_at),
  -- Hard, race-condition-proof guarantee: no two *active* lessons for the
  -- same teacher can overlap in time. This is the backend conflict
  -- validation required by the spec — it cannot be bypassed by the client.
  constraint lessons_no_teacher_overlap exclude using gist (
    teacher_id with =,
    tstzrange(starts_at, ends_at, '[)') with &&
  ) where (status in ('scheduled', 'rescheduled', 'completed'))
);

create index lessons_teacher_id_idx on public.lessons (teacher_id, starts_at);
create index lessons_student_id_idx on public.lessons (student_id, starts_at);
create index lessons_starts_at_idx on public.lessons (starts_at);
create index lessons_status_idx on public.lessons (status);

-- ----------------------------------------------------------------------------
-- attendance
-- ----------------------------------------------------------------------------
create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  status public.attendance_status not null,
  marked_at timestamptz not null default now(),
  marked_by uuid references public.profiles (id) on delete set null,
  unique (lesson_id, student_id)
);

create index attendance_lesson_id_idx on public.attendance (lesson_id);
create index attendance_student_id_idx on public.attendance (student_id);

-- ----------------------------------------------------------------------------
-- notifications — abstraction target for NotificationService deliveries
-- ----------------------------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  type public.notification_type not null,
  channel public.notification_channel not null default 'log',
  -- Nullable: trial/prospect students don't have a Supabase Auth profile yet.
  -- Recipient contact details are resolved at send-time from the lesson's
  -- student record (see NotificationService), not stored redundantly here.
  user_id uuid references public.profiles (id) on delete cascade,
  lesson_id uuid references public.lessons (id) on delete cascade,
  status public.notification_status not null default 'pending',
  payload jsonb not null default '{}'::jsonb,
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on public.notifications (user_id);
create index notifications_pending_due_idx on public.notifications (status, scheduled_for)
  where status = 'pending';

-- ----------------------------------------------------------------------------
-- calendar_integrations — Google Calendar OAuth tokens per teacher
-- ----------------------------------------------------------------------------
create table public.calendar_integrations (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null unique references public.teachers (id) on delete cascade,
  provider text not null default 'google' check (provider = 'google'),
  access_token text not null,
  refresh_token text not null,
  token_expires_at timestamptz not null,
  google_calendar_id text not null default 'primary',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- updated_at maintenance trigger (generic, reused by every table that has it)
-- ----------------------------------------------------------------------------
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.plans for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.teachers for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.students for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.lessons for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.calendar_integrations for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Auto-schedule a LESSON_REMINDER notification ~10 minutes before a lesson.
-- The lesson-reminders Edge Function polls notifications that are due.
-- ----------------------------------------------------------------------------
create function public.schedule_lesson_reminder()
returns trigger
language plpgsql
as $$
declare
  v_user_id uuid;
begin
  -- Clear any previously scheduled reminder for this lesson (reschedule/cancel).
  delete from public.notifications
   where lesson_id = new.id and type = 'LESSON_REMINDER' and status = 'pending';

  if new.status in ('scheduled', 'rescheduled') and new.student_id is not null then
    select profile_id into v_user_id from public.students where id = new.student_id;

    -- Always schedule the reminder, even for prospect students with no
    -- profile yet (e.g. trial bookings) — the delivery channel resolves
    -- the contact info from students.email/phone at send-time via lesson_id.
    insert into public.notifications (type, channel, user_id, lesson_id, scheduled_for, payload)
    values (
      'LESSON_REMINDER', 'log', v_user_id, new.id,
      new.starts_at - interval '10 minutes',
      jsonb_build_object('lessonId', new.id, 'startsAt', new.starts_at, 'studentId', new.student_id)
    );
  end if;

  return new;
end;
$$;

create trigger lessons_schedule_reminder
  after insert or update of starts_at, status on public.lessons
  for each row execute function public.schedule_lesson_reminder();

-- ============================================================================
-- End of 0001_init.sql
-- ============================================================================
