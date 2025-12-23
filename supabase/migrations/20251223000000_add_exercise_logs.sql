create table public.exercise_logs (
  id uuid not null default gen_random_uuid(),
  workout_log_id uuid not null references public.workout_logs(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  set_number integer not null,
  reps integer not null,
  weight numeric not null,
  completed boolean not null default true,
  created_at timestamp with time zone not null default now(),
  primary key (id)
);
