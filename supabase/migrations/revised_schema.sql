-- USER PROFILE TABLE (linked to Supabase Auth users)
create table "User" (
  id uuid primary key references auth.users(id) on delete cascade,
  name varchar(100),
  email varchar(100) unique,
  gender varchar(20),
  height double precision,
  weight double precision,
  goal varchar(100),
  updated_at timestamptz default timezone('utc'::text, now())
  -- NO 'password' column here!
);

-- Function to automatically create a public.User profile when a new auth.users entry is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public."User" (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger to call the function after a new user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- EXERCISE TABLE
create table "Exercise" (
  exerciseId serial primary key,
  name varchar(100),
  description text,
  sets int,
  reps int,
  duration int,
  restTime int,
  difficulty int,
  animationUrl text
);

-- WORKOUT PLAN TABLE
create table "WorkoutPlan" (
  planId serial primary key,
  planName varchar(100),
  description text,
  difficulty int,
  goal varchar(100),
  userId uuid references auth.users(id) on delete cascade,
  created_at timestamptz default timezone('utc'::text, now()),
  updated_at timestamptz default timezone('utc'::text, now())
);

-- JOIN TABLE: WorkoutPlan <-> Exercise
create table "WorkoutPlanExercise" (
  planId int references "WorkoutPlan"(planId) on delete cascade,
  exerciseId int references "Exercise"(exerciseId) on delete cascade,
  exercise_order int,
  planned_sets int,
  planned_reps int,
  planned_duration int,
  primary key (planId, exerciseId)
);

-- WORKOUT LOG TABLE
create table "WorkoutLog" (
  logId serial primary key,
  userId uuid references auth.users(id) on delete cascade,
  planId int references "WorkoutPlan"(planId) on delete set null,
  date timestamptz default timezone('utc'::text, now()),
  exerciseDone int,
  totalExercise int,
  feedback text,
  currentWeight double precision,
  duration_seconds int,
  calories_burned float
);

-- Log <-> Exercise (detailed tracking)
create table "WorkoutLogExercise" (
  logId int references "WorkoutLog"(logId) on delete cascade,
  exerciseId int references "Exercise"(exerciseId) on delete cascade,
  setsCompleted int,
  repsCompleted int,
  duration int,
  primary key (logId, exerciseId)
);

create index idx_user_email on "User"(email);
create index idx_workoutplan_userid on "WorkoutPlan"(userId);
create index idx_workoutlog_userid on "WorkoutLog"(userId);