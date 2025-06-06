import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import styles from '../assets/css/workout.module.css';
import { supabase } from '../services/supabase';

export default function Workout() {
  const [feedback, setFeedback] = useState(null);
  const { planid } = useParams();
  const navigate = useNavigate();

  // Prompt when user tries to close/refresh the browser tab
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // User profile for ending placeholders
  const [userProfile, setUserProfile] = useState({ weight: '', height: '' });
  const [weightValue, setWeightValue] = useState('');
  const [heightValue, setHeightValue] = useState('');

  // Track elapsed time from start → ending
  const [startTime] = useState(() => Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Current workout plan info
  const [workoutPlan, setWorkoutPlan] = useState({});

  // Exercise list
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(0);

  // Track which set we’re on for the current exercise
  const [currentSet, setCurrentSet] = useState(1);

  // Rest‐timer state
  const [restTime, setRestTime] = useState(30);
  const [isResting, setIsResting] = useState(false);
  const [restInterval, setRestInterval] = useState(null);

  // Exercise‐timer state
  const [exerciseTime, setExerciseTime] = useState(null);
  const [exerciseInterval, setExerciseInterval] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  // When we finish a set, do we go on to the next exercise (true) or next set (false)?
  const [nextIsNextExercise, setNextIsNextExercise] = useState(false);

  // Flag to indicate entire workout is done
  const [finished, setFinished] = useState(false);

  // On mount: fetch user, plan name, and exercises
  useEffect(() => {
    document.title = 'Workout - Fitrack';

    async function fetchUserProfile() {
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();
      if (authErr || !user) return;
      const { data, error } = await supabase
        .from('User')
        .select('weight,height')
        .eq('id', user.id)
        .single();
      if (!error && data) {
        setUserProfile({ weight: data.weight, height: data.height });
        setWeightValue(data.weight);
        setHeightValue(data.height);
      }
    }

    async function fetchWorkoutPlan() {
      const { data, error } = await supabase
        .from('WorkoutPlan')
        .select('planname')
        .eq('planid', planid)
        .single();
      if (!error && data) {
        setWorkoutPlan(data);
      }
    }

    async function fetchExercises() {
      const { data: rows, error } = await supabase
        .from('WorkoutPlanExercise')
        .select(`
          exerciseid,
          exercise_order,
          Exercise (
            exerciseid,
            name,
            description,
            sets,
            reps,
            duration,
            animationurl,
            calories_burned
          )
        `)
        .eq('planid', planid)
        .order('exercise_order', { ascending: true });

      if (error) {
        console.error('Error fetching workout exercises:', error);
        return;
      }
      const list = rows.map((pe) => ({
        id: pe.exerciseid,
        name: pe.Exercise.name,
        image: pe.Exercise.animationurl,
        description: pe.Exercise.description,
        sets: pe.Exercise.sets,
        reps: pe.Exercise.reps,
        duration: pe.Exercise.duration,
        completed: false,
        position: pe.exercise_order,
        calories: pe.Exercise.calories_burned || 0,
      }));
      setExercises(list);
    }

    fetchUserProfile();
    fetchWorkoutPlan();
    fetchExercises();

    return () => {
      if (restInterval) clearInterval(restInterval);
      if (exerciseInterval) clearInterval(exerciseInterval);
    };
  }, [planid]);

  // Whenever we switch to a new exercise, reset currentSet and start its timer
  useEffect(() => {
    if (exerciseInterval) {
      clearInterval(exerciseInterval);
      setExerciseInterval(null);
    }
    setIsPaused(false);
    setCurrentSet(1);

    const ex = exercises[currentExercise];
    if (ex && ex.duration != null) {
      setExerciseTime(ex.duration);
      const iv = setInterval(() => {
        setExerciseTime((prev) => {
          if (prev <= 1) {
            clearInterval(iv);
            handleCompleteSet();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setExerciseInterval(iv);
    } else {
      setExerciseTime(null);
    }

    return () => {
      if (exerciseInterval) {
        clearInterval(exerciseInterval);
        setExerciseInterval(null);
      }
    };
  }, [currentExercise, exercises]);

  // Rest countdown
  useEffect(() => {
    if (!isResting) return;

    const iv = setInterval(() => {
      setRestTime((prev) => {
        if (prev <= 1) {
          clearInterval(iv);
          setIsResting(false);
          // After rest: either next set or next exercise
          if (nextIsNextExercise) {
            // Move to next exercise if available
            if (currentExercise < exercises.length - 1) {
              setCurrentExercise((idx) => idx + 1);
            } else {
              // Last exercise's rest end: finish workout
              setFinished(true);
            }
          } else {
            // Start next set of same exercise
            setCurrentSet((prevSet) => prevSet + 1);
            startSetTimer();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setRestInterval(iv);
    return () => {
      clearInterval(iv);
      setRestInterval(null);
    };
  }, [isResting, nextIsNextExercise, currentExercise, exercises.length]);

  // Helper: start countdown for the current set
  const startSetTimer = () => {
    const ex = exercises[currentExercise];
    if (!ex || ex.duration == null) return;
    setExerciseTime(ex.duration);
    const iv = setInterval(() => {
      setExerciseTime((prev) => {
        if (prev <= 1) {
          clearInterval(iv);
          handleCompleteSet();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setExerciseInterval(iv);
    setIsPaused(false);
  };

  // Called at end of a countdown for one set
  const handleCompleteSet = () => {
    const ex = exercises[currentExercise];
    if (!ex) return;

    // If this was the last set
    if (currentSet >= ex.sets) {
      const updated = [...exercises];
      updated[currentExercise].completed = true;
      setExercises(updated);
      setNextIsNextExercise(true);
      setIsResting(true);
      setRestTime(30);
    } else {
      // Next set of same exercise
      setNextIsNextExercise(false);
      setIsResting(true);
      setRestTime(30);
    }
  };

  const moveToNextExercise = () => {
    if (exerciseInterval) {
      clearInterval(exerciseInterval);
      setExerciseInterval(null);
    }

    const lastIdx = exercises.length - 1;
    if (currentExercise < lastIdx) {
      // Move to next exercise
      setCurrentExercise((curr) => curr + 1);
    } else {
      // **CHANGED HERE**:
      // Instead of forcibly marking the last exercise as completed,
      // just finish the workout immediately.
      setFinished(true);
    }
  };

  const moveToPrevExercise = () => {
    if (exerciseInterval) {
      clearInterval(exerciseInterval);
      setExerciseInterval(null);
    }
    if (currentExercise > 0) {
      setCurrentExercise((curr) => curr - 1);
    }
  };

  const addTime = () => setRestTime((prev) => prev + 20);

  const skipRest = () => {
    if (restInterval) {
      clearInterval(restInterval);
      setRestInterval(null);
    }
    setIsResting(false);
    if (nextIsNextExercise) {
      // If skipping last exercise’s rest, finish
      if (currentExercise === exercises.length - 1) {
        setFinished(true);
      } else {
        setCurrentExercise((idx) => idx + 1);
      }
    } else {
      setCurrentSet((prevSet) => prevSet + 1);
      startSetTimer();
    }
  };

  const togglePause = () => {
    if (isPaused) {
      // Resume
      const iv = setInterval(() => {
        setExerciseTime((prev) => {
          if (prev <= 1) {
            clearInterval(iv);
            handleCompleteSet();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setExerciseInterval(iv);
      setIsPaused(false);
    } else {
      // Pause
      if (exerciseInterval) {
        clearInterval(exerciseInterval);
        setExerciseInterval(null);
      }
      setIsPaused(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const renderProgressDots = () => (
    <div className={styles['progress-dots']}>
      {exercises.map((_, i) => {
        const completed = exercises[i].completed;
        const current = i === currentExercise;
        return (
          <div
            key={i}
            className={`
              ${styles['progress-dot']}
              ${completed ? styles.completed : ''}
              ${current ? styles.current : ''}
            `}
          />
        );
      })}
    </div>
  );

  // Once completed, compute elapsed time
  useEffect(() => {
    if (finished) {
      const endTime = Date.now();
      setElapsedTime(Math.floor((endTime - startTime) / 1000));
    }
  }, [finished, startTime]);

  // Summary stats
  const totalExercises = exercises.length;
  const elapsedFormatted = formatTime(elapsedTime);

  // ← Sum calories **only** for completed exercises:
  const totalCalories = exercises
    .filter((ex) => ex.completed)            // include only done ones
    .reduce((sum, ex) => sum + (ex.calories || 0), 0)
    .toFixed(1);

  // Ending screen
  if (finished) {
    const handleFinish = async () => {
      // 1. Get the current user’s ID
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('Could not get user:', userError);
        return;
      }
      const userid = user.id;

      // 2. Compute which “weight” to record
      const weightToSave =
        weightValue && weightValue !== ''
          ? parseFloat(weightValue)
          : parseFloat(userProfile.weight || 0);

      // 3. Compute which “height” to record
      const heightToSave =
        heightValue && heightValue !== ''
          ? parseFloat(heightValue)
          : parseFloat(userProfile.height || 0);

      // 4. First, update User table with new weight & height
      const { error: updateUserError } = await supabase
        .from('User')
        .update({ weight: weightToSave, height: heightToSave })
        .eq('id', userid);

      if (updateUserError) {
        console.error('Error updating user profile:', updateUserError);
        // you can choose to early‐return here or continue
      }

      // 5. Prepare the WorkoutLog row
      const doneCount = exercises.filter((ex) => ex.completed).length;
      const totalCount = exercises.length;
      const logPayload = {
        userid: userid,
        planid: planid,
        date: new Date().toISOString(),
        exercisedone: doneCount,
        totalexercise: totalCount,
        feedback: feedback,
        currentweight: weightToSave,
        duration_seconds: elapsedTime,
        calories_burned: parseFloat(totalCalories),
      };

      // 6. Insert into WorkoutLog
      const {
        data: logData,
        error: logError,
      } = await supabase
        .from('WorkoutLog')
        .insert(logPayload)
        .select('logid')
        .single();

      if (logError) {
        console.error('Error inserting WorkoutLog:', logError);
        return;
      }

      const logid = logData.logid;

      // 7. Build and insert WorkoutLogExercise rows
      const logExercises = exercises
        .filter((ex) => ex.completed)
        .map((ex) => ({
          logid: logid,
          exerciseid: ex.id,
          planid: planid,
        }));

      if (logExercises.length > 0) {
        const { error: logExError } = await supabase
          .from('WorkoutLogExercise')
          .insert(logExercises);
        if (logExError) {
          console.error('Error inserting WorkoutLogExercise rows:', logExError);
          return;
        }
      }

      // 8. Finally, navigate away
      navigate('/dashboard');
    };

    return (
      <div className={styles['ending-container']}>
        <div className={styles['ending-header']}>
          <h1 className={styles['ending-title']}>Workout Completed!</h1>
          <h2 className={styles['workout-plan-title']}>{workoutPlan.planname}</h2>
        </div>

        <div className={styles['stats']}>
          <div className={styles['stat-item']}>
            <h3>Exercises</h3>
            <p>{totalExercises}</p>
          </div>
          <div className={styles['stat-item']}>
            <h3>Calories</h3>
            <p>{totalCalories}</p>
          </div>
          <div className={styles['stat-item']}>
            <h3>Time</h3>
            <p>{elapsedFormatted}</p>
          </div>
        </div>

        <div className={styles['feedback']}>
          <h3>How do you feel?</h3>
          <div className={styles['feedback-options']}>
            <button 
              className={`${styles.tooHard} ${feedback === 'too_hard' ? styles.selected : ''}`}
              onClick={() => setFeedback('too_hard')}
            >
              😣<span>Too hard</span>
            </button>
            <button 
              className={`${styles.justRight} ${feedback === 'just_right' ? styles.selected : ''}`}
              onClick={() => setFeedback('just_right')}
            >
              😃<span>Just right</span>
            </button>
            <button 
              className={`${styles.tooEasy} ${feedback === 'too_easy' ? styles.selected : ''}`}
              onClick={() => setFeedback('too_easy')}
            >
              😌<span>Too easy</span>
            </button>
          </div>
        </div>

        <div className={styles['input-group']}>
          <label htmlFor="weight">Weight</label>
          <input
            id="weight"
            type="number"
            placeholder={`${userProfile.weight} kg`}
            value={weightValue}
            onChange={(e) => setWeightValue(e.target.value)}
          />
        </div>

        <div className={styles['input-group']}>
          <label htmlFor="height">Height</label>
          <input
            id="height"
            type="number"
            placeholder={`${userProfile.height} cm`}
            value={heightValue}
            onChange={(e) => setHeightValue(e.target.value)}
          />
        </div>

        <button onClick={handleFinish} className={styles['finish-button']}>
          Next
        </button>
      </div>
    );
  }

  // Loading state
  if (!exercises.length) {
    return (
      <div className={styles['workout-container']}>
        <p>Loading workout...</p>
      </div>
    );
  }

  // Active exercise or rest
  const ex = exercises[currentExercise];

  return (
    <div className={styles['workout-container']}>
      <div className={styles['workout-content']}>
        {/* Left Visual Section */}
        <div className={styles['exercise-visual']}>
          {/* Back → custom confirmation, then navigate to WorkoutDetail */}
          <button
            className={styles['back-button']}
            onClick={() => {
              const leave = window.confirm('Are you sure you want to leave the workout?');
              if (leave) {
                navigate(`/workoutdetail/${planid}`);
              }
            }}
          >
            <i className="bx bx-arrow-back"></i>
          </button>
          <div className={styles['exercise-video-container']}>
            <video
              src={ex.image}
              className={styles['exercise-video']}
              muted
              loop
              autoPlay
              playsInline
            />
          </div>
        </div>

        <div className={styles.divider}></div>

        {/* Right Details Section */}
        <div className={styles['exercise-details']}>
          {renderProgressDots()}

          {isResting ? (
            <div className={styles['rest-section']}>
              <h2 className={styles['rest-title']}>REST</h2>
              <div className={styles['rest-timer']}>{formatTime(restTime)}</div>
              <div className={styles['rest-controls']}>
                <button className={styles['time-button']} onClick={addTime}>
                  +20s
                </button>
                <button className={styles['skip-button']} onClick={skipRest}>
                  Skip
                </button>
              </div>
            </div>
          ) : (
            <div className={styles['exercise-info']}>
              <div className={styles['exercise-header']}>
                <div className={styles['exercise-position']}>
                  {currentExercise + 1}/{exercises.length}
                </div>
                <h2 className={styles['exercise-title']}>{ex.name}</h2>
              </div>

              {/* Show "Set X/Y" for duration-based */}
              {ex.duration != null && (
                <div className={styles['exercise-counter']}>
                  <div className={styles['sets-text']}>
                    Set {currentSet}/{ex.sets}
                  </div>
                  <div className={styles['duration-timer']}>{formatTime(exerciseTime)}</div>
                </div>
              )}

              {/* Show reps for rep-based */}
              {ex.duration == null && (
                <div className={styles['exercise-counter']}>
                  <div className={styles['sets-text']}>
                    Set {currentSet}/{ex.sets}
                  </div>
                  <div className={styles['reps-count']}>× {ex.reps}</div>
                </div>
              )}

              <div className={styles['exercise-description']}>
                <p>{ex.description}</p>
              </div>

              <div className={styles['navigation-controls']}>
                <button
                  className={`${styles['nav-button']} ${styles['prev-button']}`}
                  onClick={moveToPrevExercise}
                  disabled={currentExercise === 0}
                  title="Previous"
                >
                  <i className="bx bx-chevron-left"></i>
                </button>

                {ex.duration != null && (
                  <button
                    className={`${styles['nav-button']} ${styles['pause-button']}`}
                    onClick={togglePause}
                    title={isPaused ? 'Resume' : 'Pause'}
                  >
                    <i className={`bx ${isPaused ? 'bx-play' : 'bx-pause'}`}></i>
                  </button>
                )}

                {ex.duration == null && (
                  <button
                    className={`${styles['nav-button']} ${styles['complete-button']}`}
                    onClick={handleCompleteSet}
                    title="Complete"
                  >
                    <i className="bx bx-check"></i>
                  </button>
                )}

                <button
                  className={`${styles['nav-button']} ${styles['next-button']}`}
                  onClick={moveToNextExercise}
                  title="Next"
                >
                  <i className="bx bx-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}