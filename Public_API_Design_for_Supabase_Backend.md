# Public API Design for Fitrack Backend

This document outlines the design for a public-facing API for the Fitrack application, powered by a Supabase backend.

## Versioning

The API will be versioned using a path-based scheme, e.g., `/api/v1`.

## Authentication

Public endpoints will be read-only and will not require authentication.

## Endpoints

### Exercises

#### `GET /api/v1/exercises`

Returns a list of all exercises.

**Response Body:**

```json
[
  {
    "exerciseid": 1,
    "name": "Push-up",
    "description": "A classic bodyweight exercise that works the chest, shoulders, and triceps.",
    "sets": 3,
    "reps": 15,
    "duration": null,
    "resttime": 60,
    "difficulty": 2,
    "animationurl": "https://example.com/push-up.gif",
    "calories_burned": 10
  }
]
```

#### `GET /api/v1/exercises/:id`

Returns a single exercise by its `exerciseid`.

**Response Body:**

```json
{
  "exerciseid": 1,
  "name": "Push-up",
  "description": "A classic bodyweight exercise that works the chest, shoulders, and triceps.",
  "sets": 3,
  "reps": 15,
  "duration": null,
  "resttime": 60,
  "difficulty": 2,
  "animationurl": "https://example.com/push-up.gif",
  "calories_burned": 10
}
```

### Workout Plans

#### `GET /api/v1/workout-plans`

Returns a list of all public workout plans.

**Response Body:**

```json
[
  {
    "planid": 1,
    "planname": "Full Body Strength",
    "description": "A comprehensive workout plan targeting all major muscle groups.",
    "difficulty": 3,
    "goal": "Strength"
  }
]
```

#### `GET /api/v1/workout-plans/:id`

Returns a single workout plan by its `planid`, including a list of its exercises.

**Response Body:**

```json
{
  "planid": 1,
  "planname": "Full Body Strength",
  "description": "A comprehensive workout plan targeting all major muscle groups.",
  "difficulty": 3,
  "goal": "Strength",
  "exercises": [
    {
      "exerciseid": 1,
      "name": "Push-up",
      "description": "A classic bodyweight exercise that works the chest, shoulders, and triceps.",
      "sets": 3,
      "reps": 15,
      "duration": null,
      "resttime": 60,
      "difficulty": 2,
      "animationurl": "https://example.com/push-up.gif",
      "calories_burned": 10,
      "exercise_order": 1
    }
  ]
}
```

## Security and RLS Policies

Row Level Security (RLS) will be enabled on all tables to ensure data privacy.

### `Exercise` Table

*   **SELECT:** Publicly accessible. All users can read from this table.

```sql
CREATE POLICY "Enable read access for all users"
ON public."Exercise"
FOR SELECT
USING (true);
```

### `WorkoutPlan` Table

*   **SELECT:** Publicly accessible. We'll assume for now that all workout plans are public. If a `is_public` column were added, the policy would be `USING (is_public = true)`.

```sql
CREATE POLICY "Enable read access for all users"
ON public."WorkoutPlan"
FOR SELECT
USING (true);
```

### `WorkoutPlanExercise` Table

*   **SELECT:** Publicly accessible.

```sql
CREATE POLICY "Enable read access for all users"
ON public."WorkoutPlanExercise"
FOR SELECT
USING (true);