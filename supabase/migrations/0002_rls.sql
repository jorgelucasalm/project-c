-- ============================================================================
-- 0002_rls.sql
-- Row Level Security policies for admin / teacher / student roles.
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.teachers enable row level security;
alter table public.students enable row level security;
alter table public.subscriptions enable row level security;
alter table public.teacher_availability enable row level security;
alter table public.lessons enable row level security;
alter table public.attendance enable row level security;
alter table public.notifications enable row level security;
alter table public.calendar_integrations enable row level security;

-- ----------------------------------------------------------------------------
-- Helper functions — SECURITY DEFINER so they can read profiles/teachers/
-- students without tripping the very policies that call them (avoids
-- infinite recursion), while still being scoped to the caller (auth.uid()).
-- ----------------------------------------------------------------------------
create function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create function public.is_teacher()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'teacher'
  );
$$;

create function public.current_teacher_id()
returns uuid
language sql stable security definer set search_path = public
as $$
  select id from public.teachers where profile_id = auth.uid();
$$;

create function public.current_student_id()
returns uuid
language sql stable security definer set search_path = public
as $$
  select id from public.students where profile_id = auth.uid();
$$;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_teacher() to authenticated;
grant execute on function public.current_teacher_id() to authenticated;
grant execute on function public.current_student_id() to authenticated;

-- ----------------------------------------------------------------------------
-- profiles
-- ----------------------------------------------------------------------------
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

create policy "profiles_admin_insert" on public.profiles
  for insert with check (public.is_admin());

create policy "profiles_admin_delete" on public.profiles
  for delete using (public.is_admin());

-- ----------------------------------------------------------------------------
-- plans — everyone signed in can read; only admins manage
-- ----------------------------------------------------------------------------
create policy "plans_select_authenticated" on public.plans
  for select to authenticated using (true);

create policy "plans_admin_write" on public.plans
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- teachers — everyone signed in can read (needed for booking UIs); admin
-- manages the roster; a teacher may update their own profile fields.
-- ----------------------------------------------------------------------------
create policy "teachers_select_authenticated" on public.teachers
  for select to authenticated using (true);

create policy "teachers_admin_write" on public.teachers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "teachers_self_update" on public.teachers
  for update to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- ----------------------------------------------------------------------------
-- students — admin sees/manages all; a teacher can see students that have a
-- lesson with them; a student can see/update only their own record.
-- ----------------------------------------------------------------------------
create policy "students_admin_all" on public.students
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "students_self_select" on public.students
  for select to authenticated using (profile_id = auth.uid());

create policy "students_self_update" on public.students
  for update to authenticated using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy "students_teacher_select" on public.students
  for select to authenticated using (
    public.is_teacher() and exists (
      select 1 from public.lessons l
      where l.student_id = students.id and l.teacher_id = public.current_teacher_id()
    )
  );

-- ----------------------------------------------------------------------------
-- subscriptions
-- ----------------------------------------------------------------------------
create policy "subscriptions_admin_all" on public.subscriptions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "subscriptions_self_select" on public.subscriptions
  for select to authenticated using (
    student_id = public.current_student_id()
  );

-- ----------------------------------------------------------------------------
-- teacher_availability — readable by any signed-in user (for scheduling UIs);
-- writable by admin or the owning teacher. Public/anon availability lookups
-- go through the get_available_slots() RPC instead of direct table access.
-- ----------------------------------------------------------------------------
create policy "availability_select_authenticated" on public.teacher_availability
  for select to authenticated using (true);

create policy "availability_admin_write" on public.teacher_availability
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "availability_teacher_write" on public.teacher_availability
  for all to authenticated
  using (teacher_id = public.current_teacher_id())
  with check (teacher_id = public.current_teacher_id());

-- ----------------------------------------------------------------------------
-- lessons
-- ----------------------------------------------------------------------------
create policy "lessons_admin_all" on public.lessons
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "lessons_teacher_select" on public.lessons
  for select to authenticated using (teacher_id = public.current_teacher_id());

create policy "lessons_teacher_write" on public.lessons
  for update to authenticated
  using (teacher_id = public.current_teacher_id())
  with check (teacher_id = public.current_teacher_id());

create policy "lessons_teacher_insert" on public.lessons
  for insert to authenticated
  with check (teacher_id = public.current_teacher_id());

create policy "lessons_student_select" on public.lessons
  for select to authenticated using (student_id = public.current_student_id());

-- ----------------------------------------------------------------------------
-- attendance
-- ----------------------------------------------------------------------------
create policy "attendance_admin_all" on public.attendance
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "attendance_teacher_write" on public.attendance
  for all to authenticated
  using (exists (
    select 1 from public.lessons l
    where l.id = attendance.lesson_id and l.teacher_id = public.current_teacher_id()
  ))
  with check (exists (
    select 1 from public.lessons l
    where l.id = attendance.lesson_id and l.teacher_id = public.current_teacher_id()
  ));

create policy "attendance_student_select" on public.attendance
  for select to authenticated using (student_id = public.current_student_id());

-- ----------------------------------------------------------------------------
-- notifications — users only see their own; writes are performed by trusted
-- server code (service role client / triggers), which bypasses RLS entirely.
-- ----------------------------------------------------------------------------
create policy "notifications_self_select" on public.notifications
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

-- ----------------------------------------------------------------------------
-- calendar_integrations — admin manages all; teacher manages their own link.
-- ----------------------------------------------------------------------------
create policy "calendar_integrations_admin_all" on public.calendar_integrations
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "calendar_integrations_teacher_own" on public.calendar_integrations
  for all to authenticated
  using (teacher_id = public.current_teacher_id())
  with check (teacher_id = public.current_teacher_id());

-- ============================================================================
-- End of 0002_rls.sql
-- ============================================================================
