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
        WorkoutLogExercise (
          *,
          Exercise (
            name
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