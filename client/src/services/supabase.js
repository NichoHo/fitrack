import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchWorkoutHistory(userId) {
  try {
    const { data, error } = await supabase
      .from('WorkoutLog')
      .select(`
        *,
        WorkoutPlan (
          planname
        ),
        WorkoutLogExercise (
          *,
          Exercise (
            name,
            sets,
            reps
          )
        )
      `)
      .eq('userid', userId)
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching workout history:', error.message);
    return null;
  }
}

export async function fetchPlanExercises(planid) {
  try {
    const { data: exRows, error: exErr } = await supabase
      .from("WorkoutPlanExercise")
      .select(`
        planid,
        exerciseid,
        exercise_order,
        Exercise (
          exerciseid,
          name,
          description,
          sets,
          reps,
          duration,
          difficulty,
          animationurl
        )
      `)
      .eq("planid", planid)
      .order("exercise_order", { ascending: true });

    if (exErr) {
      throw exErr;
    }
    return exRows;
  } catch (error) {
    console.error(`Error fetching exercises for plan ${planid}:`, error.message);
    return null;
  }
}