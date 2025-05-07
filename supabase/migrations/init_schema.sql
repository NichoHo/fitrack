-- USER TABLE
create table "User" (
  userId serial primary key,
  name varchar(100),
  email varchar(100) unique,
  password varchar(100),
  gender varchar(10),
  height double precision,
  weight double precision,
  goal varchar(100)
);

-- EXERCISE TABLE
create table "Exercise" (
  exerciseId serial primary key,
  name varchar(100),
  description text,
  sets int,
  reps int,
  duration int,
  restTime int,
  difficulty varchar(50)
);

-- WORKOUT PLAN TABLE
create table "WorkoutPlan" (
  planId serial primary key,
  planName varchar(100),
  description text,
  difficulty varchar(50),
  goal varchar(100)
);

-- JOIN TABLE: WorkoutPlan <-> Exercise
create table "WorkoutPlanExercise" (
  planId int references "WorkoutPlan"(planId) on delete cascade,
  exerciseId int references "Exercise"(exerciseId) on delete cascade,
  primary key (planId, exerciseId)
);

-- WORKOUT LOG TABLE
create table "WorkoutLog" (
  logId serial primary key,
  userId int references "User"(userId) on delete cascade,
  date date,
  exerciseDone int,
  totalExercise int,
  feedback text,
  currentWeight int
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