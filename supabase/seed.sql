-- Sample data for local development only (supabase start / db reset).
-- Safe to run multiple times: each insert is guarded by a NOT EXISTS check.

insert into public.plans (name, price_cents, lesson_duration_minutes, lessons_per_cycle, status)
select * from (values
  ('Conversação VIP', 35000, 60, 4, 'active'),
  ('Intensivo Semestral', 28000, 60, 8, 'active'),
  ('Kids Academy', 20000, 45, 4, 'active')
) as v(name, price_cents, lesson_duration_minutes, lessons_per_cycle, status)
where not exists (select 1 from public.plans where public.plans.name = v.name);

insert into public.teachers (full_name, email, phone, bio, color)
select * from (values
  ('Sarah Jenkins', 'sarah.jenkins@academy.com', '+55 81 90000-0001', 'Especialista em conversação e preparação IELTS.', '#99c5ff'),
  ('Mark Thompson', 'mark.thompson@academy.com', '+55 81 90000-0002', 'Professor de inglês para negócios e turmas kids.', '#ffdf3d')
) as v(full_name, email, phone, bio, color)
where not exists (select 1 from public.teachers where public.teachers.email = v.email);

-- Monday-Friday, 08:00-12:00 and 14:00-18:00 availability for every seeded teacher.
insert into public.teacher_availability (teacher_id, weekday, start_time, end_time)
select t.id, weekday, start_time, end_time
from public.teachers t
cross join (
  values
    (1, time '08:00', time '12:00'),
    (1, time '14:00', time '18:00'),
    (2, time '08:00', time '12:00'),
    (2, time '14:00', time '18:00'),
    (3, time '08:00', time '12:00'),
    (3, time '14:00', time '18:00'),
    (4, time '08:00', time '12:00'),
    (4, time '14:00', time '18:00'),
    (5, time '08:00', time '12:00'),
    (5, time '14:00', time '18:00')
) as v(weekday, start_time, end_time)
where not exists (
  select 1 from public.teacher_availability a
  where a.teacher_id = t.id and a.weekday = v.weekday and a.start_time = v.start_time
);
