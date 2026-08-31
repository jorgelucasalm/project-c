-- ============================================================================
-- 0003_functions.sql
-- Backend availability + booking logic. This is the authoritative conflict
-- validation layer: it never trusts the client, and the lessons table itself
-- carries a GiST exclusion constraint (see 0001_init.sql) so double-booking
-- a teacher is impossible even under concurrent requests.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- get_available_slots
-- Computes free time slots for a teacher on a given day by combining:
--   teacher_availability (recurring weekly windows)
--   + existing lessons (busy ranges)
--   + requested lesson duration
--   + step granularity (default 30 min)
-- Callable by anonymous visitors (public trial booking) and authenticated
-- users alike — it only ever returns time ranges, never personal data.
-- ----------------------------------------------------------------------------
create function public.get_available_slots(
  p_teacher_id uuid,
  p_day date,
  p_duration_minutes int default 60,
  p_step_minutes int default 30,
  p_timezone text default 'America/Sao_Paulo'
)
returns table (slot_start timestamptz, slot_end timestamptz)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_weekday smallint := extract(dow from p_day);
  v_window record;
  v_slot_start timestamptz;
  v_slot_end timestamptz;
  v_window_end timestamptz;
begin
  if p_duration_minutes <= 0 then
    raise exception 'duration_minutes must be greater than zero';
  end if;

  for v_window in
    select start_time, end_time
    from public.teacher_availability
    where teacher_id = p_teacher_id and weekday = v_weekday
    order by start_time
  loop
    v_slot_start := (p_day + v_window.start_time) at time zone p_timezone;
    v_window_end := (p_day + v_window.end_time) at time zone p_timezone;

    while v_slot_start + make_interval(mins => p_duration_minutes) <= v_window_end loop
      v_slot_end := v_slot_start + make_interval(mins => p_duration_minutes);

      if v_slot_start >= now() and not exists (
        select 1 from public.lessons l
        where l.teacher_id = p_teacher_id
          and l.status in ('scheduled', 'rescheduled', 'completed')
          and tstzrange(l.starts_at, l.ends_at, '[)') && tstzrange(v_slot_start, v_slot_end, '[)')
      ) then
        slot_start := v_slot_start;
        slot_end := v_slot_end;
        return next;
      end if;

      v_slot_start := v_slot_start + make_interval(mins => p_step_minutes);
    end loop;
  end loop;
end;
$$;

grant execute on function public.get_available_slots(uuid, date, int, int, text) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- book_trial_lesson
-- Public entry point for the "aula experimental" flow. Creates (or reuses)
-- a prospective student record and inserts the lesson. Runs as SECURITY
-- DEFINER so anonymous visitors never need direct table grants — the only
-- surface they touch is this validated function.
-- ----------------------------------------------------------------------------
create function public.book_trial_lesson(
  p_teacher_id uuid,
  p_starts_at timestamptz,
  p_duration_minutes int,
  p_full_name text,
  p_email text,
  p_phone text default null
)
returns table (lesson_id uuid, starts_at timestamptz, ends_at timestamptz, status public.lesson_status)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student_id uuid;
  v_ends_at timestamptz := p_starts_at + make_interval(mins => p_duration_minutes);
  v_lesson_id uuid;
begin
  if p_starts_at < now() then
    raise exception 'Não é possível agendar em uma data/horário no passado.';
  end if;

  if p_full_name is null or length(trim(p_full_name)) = 0 then
    raise exception 'Nome é obrigatório.';
  end if;

  if p_email is null or p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Email inválido.';
  end if;

  select id into v_student_id
  from public.students
  where lower(email) = lower(p_email)
  limit 1;

  if v_student_id is null then
    insert into public.students (full_name, email, phone, student_type, status)
    values (p_full_name, lower(p_email), p_phone, 'adult', 'pending')
    returning id into v_student_id;
  end if;

  begin
    insert into public.lessons (teacher_id, student_id, starts_at, ends_at, status, type, location)
    values (p_teacher_id, v_student_id, p_starts_at, v_ends_at, 'scheduled', 'trial', 'online')
    returning id into v_lesson_id;
  exception
    when exclusion_violation then
      raise exception 'Esse horário acabou de ser reservado por outra pessoa. Escolha outro horário.';
  end;

  return query
    select v_lesson_id, p_starts_at, v_ends_at, 'scheduled'::public.lesson_status;
end;
$$;

grant execute on function public.book_trial_lesson(uuid, timestamptz, int, text, text, text) to anon, authenticated;

-- ============================================================================
-- End of 0003_functions.sql
-- ============================================================================
