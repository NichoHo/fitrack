import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../assets/css/register.module.css';
import 'boxicons/css/boxicons.min.css';
import logo from '../assets/img/logo.png';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    height: '',
    weight: '',
    goal: ''
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

const DEFAULT_WORKOUT_PLANS = {
  "Fat Burner": {
    "id": 1,
    "planname": "Fat Burner",
    "description": "A mix of cardio and core exercises to aid fat loss.",
    "difficulty": 4,
    "goal": "Weight Loss",
    "exercises": [
      { "exerciseid": 42, "name": "Barbell Bicep Curl", "description": "Strengthens the biceps by curling a barbell from waist to shoulder level.", "sets": 3, "reps": 12, "duration": null, "resttime": 45, "difficulty": 4, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/bicep%20curl.mp4", "calories_burned": 14 },
      { "exerciseid": 43, "name": "Dumbbell Hammer Curl", "description": "Targets both the biceps and forearms using a neutral grip with dumbbells.", "sets": 3, "reps": 10, "duration": null, "resttime": 45, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/hammer%20curl.mp4", "calories_burned": 15 },
      { "exerciseid": 44, "name": "Preacher Curl (Machine)", "description": "Isolates the biceps on a preacher bench using a machine for controlled motion.", "sets": 3, "reps": 12, "duration": null, "resttime": 45, "difficulty": 3, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/preacher%20curl.mp4", "calories_burned": 11 },
      { "exerciseid": 45, "name": "Cable Bicep Curl", "description": "Provides constant tension on biceps using cable pulley system.", "sets": 3, "reps": 15, "duration": null, "resttime": 30, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/cable%20bicep%20curl.mp4", "calories_burned": 22 },
      { "exerciseid": 46, "name": "Tricep Pushdown", "description": "Works the triceps by pushing a cable down using a bar or rope attachment.", "sets": 3, "reps": 12, "duration": null, "resttime": 45, "difficulty": 4, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/tricep%20pushdown.mp4", "calories_burned": 14 },
      { "exerciseid": 47, "name": "Overhead Dumbbell Extension", "description": "Targets the long head of the triceps with a single dumbbell overhead.", "sets": 3, "reps": 12, "duration": null, "resttime": 45, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/overhead%20dumbell%20extension.mp4", "calories_burned": 18 },
      { "exerciseid": 48, "name": "Triceps Dip (Machine)", "description": "Assisted dip machine to build triceps strength safely.", "sets": 3, "reps": 10, "duration": null, "resttime": 60, "difficulty": 3, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/tricep%20dip.mp4", "calories_burned": 9 },
      { "exerciseid": 49, "name": "Barbell Back Squat", "description": "Compound movement that builds quads, hamstrings, and glutes using a barbell.", "sets": 4, "reps": 8, "duration": null, "resttime": 60, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/barbell%20back%20squat.mp4", "calories_burned": 16 },
      { "exerciseid": 50, "name": "Leg Press", "description": "Machine-based exercise that targets quads, glutes, and hamstrings.", "sets": 3, "reps": 12, "duration": null, "resttime": 45, "difficulty": 4, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/leg%20press.mp4", "calories_burned": 14 },
      { "exerciseid": 51, "name": "Leg Extension", "description": "Isolates and strengthens the quadriceps via machine.", "sets": 3, "reps": 15, "duration": null, "resttime": 45, "difficulty": 3, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/leg%20extension.mp4", "calories_burned": 14 },
      { "exerciseid": 52, "name": "Leg Curl (Seated or Lying)", "description": "Targets the hamstrings using a machine.", "sets": 3, "reps": 15, "duration": null, "resttime": 45, "difficulty": 3, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/leg%20curl.mp4", "calories_burned": 14 },
      { "exerciseid": 53, "name": "Dumbbell Lunges", "description": "Enhances single-leg strength and balance using dumbbells.", "sets": 3, "reps": 10, "duration": null, "resttime": 60, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/dumbell%20lunges.mp4", "calories_burned": 15 },
      { "exerciseid": 54, "name": "Glute Kickback (Cable)", "description": "Isolates the glutes using cable machine with ankle attachment.", "sets": 3, "reps": 15, "duration": null, "resttime": 30, "difficulty": 4, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/glute%20kickback.mp4", "calories_burned": 18 },
      { "exerciseid": 55, "name": "Standing Calf Raise", "description": "Works the calf muscles with bodyweight or added resistance.", "sets": 3, "reps": 20, "duration": null, "resttime": 30, "difficulty": 3, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/standing%20calf%20raise.mp4", "calories_burned": 18 }
    ]
  },
  "Muscle Builder": {
    "id": 2,
    "planname": "Muscle Builder",
    "description": "A strength-focused routine with heavy compound lifts for hypertrophy.",
    "difficulty": 5,
    "goal": "Muscle Gain",
    "exercises": [
      { "exerciseid": 56, "name": "Lat Pulldown", "description": "Pulls down a bar to chest level to target the latissimus dorsi.", "sets": 3, "reps": 10, "duration": null, "resttime": 45, "difficulty": 4, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/lat%20pulldown.mp4", "calories_burned": 12 },
      { "exerciseid": 57, "name": "Seated Row (Cable)", "description": "Pulls a cable handle toward the torso to engage mid-back muscles.", "sets": 3, "reps": 12, "duration": null, "resttime": 45, "difficulty": 4, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/seated%20row.mp4", "calories_burned": 14 },
      { "exerciseid": 58, "name": "Deadlift", "description": "Full-body compound lift emphasizing lower back, glutes, and hamstrings.", "sets": 4, "reps": 6, "duration": null, "resttime": 90, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/deadlift.mp4", "calories_burned": 12 },
      { "exerciseid": 59, "name": "T-Bar Row", "description": "Uses a T-bar or landmine setup to strengthen the mid-back and lats.", "sets": 3, "reps": 10, "duration": null, "resttime": 60, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/t-bar%20row.mp4", "calories_burned": 15 },
      { "exerciseid": 60, "name": "Cable Straight-Arm Pulldown", "description": "Isolates the lats by pulling down with extended arms.", "sets": 3, "reps": 15, "duration": null, "resttime": 45, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/straight%20arm%20pulldown.mp4", "calories_burned": 22 },
      { "exerciseid": 61, "name": "Assisted Pull-Up", "description": "Uses a machine to support bodyweight for vertical pulling.", "sets": 3, "reps": 10, "duration": null, "resttime": 60, "difficulty": 4, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/assited%20pull%20up.mp4", "calories_burned": 12 },
      { "exerciseid": 62, "name": "Dumbbell Shoulder Press", "description": "Pushes dumbbells overhead to work all deltoid heads.", "sets": 3, "reps": 10, "duration": null, "resttime": 60, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/dumbell%20shoulder%20press.mp4", "calories_burned": 15 },
      { "exerciseid": 63, "name": "Lateral Raise", "description": "Raises arms sideways to isolate lateral delts.", "sets": 3, "reps": 15, "duration": null, "resttime": 30, "difficulty": 4, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/lateral%20raise.mp4", "calories_burned": 18 },
      { "exerciseid": 64, "name": "Front Raise", "description": "Lifts weights forward to strengthen front delts.", "sets": 3, "reps": 12, "duration": null, "resttime": 45, "difficulty": 4, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/front%20raise.mp4", "calories_burned": 14 },
      { "exerciseid": 65, "name": "Rear Delt Fly", "description": "Targets rear delts with reverse fly motion.", "sets": 3, "reps": 15, "duration": null, "resttime": 30, "difficulty": 3, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/rear%20delt%20fly.mp4", "calories_burned": 14 },
      { "exerciseid": 66, "name": "Smith Machine Overhead Press", "description": "Controlled overhead press using Smith machine.", "sets": 3, "reps": 10, "duration": null, "resttime": 60, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/smith%20shoulder%20press.mp4", "calories_burned": 15 },
      { "exerciseid": 67, "name": "Barbell Bench Press", "description": "Lies on bench pressing barbell to chest for chest mass.", "sets": 4, "reps": 8, "duration": null, "resttime": 60, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/barbell%20bench%20press.mp4", "calories_burned": 16 },
      { "exerciseid": 68, "name": "Incline Bench Press", "description": "Targets upper chest with incline bench and barbell.", "sets": 4, "reps": 10, "duration": null, "resttime": 60, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/incline%20bench%20press.mp4", "calories_burned": 20 }
    ]
  },
  "Cardio Boost": {
    "id": 3,
    "planname": "Cardio Boost",
    "description": "A cardio-centric routine to boost heart and lung capacity.",
    "difficulty": 5,
    "goal": "Cardiovascular Health",
    "exercises": [
      { "exerciseid": 69, "name": "Dumbbell Chest Press", "description": "Performs chest press with dumbbells for stability.", "sets": 3, "reps": 10, "duration": null, "resttime": 60, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/dumbell%20chest%20press.mp4", "calories_burned": 15 },
      { "exerciseid": 70, "name": "Cable Chest Fly", "description": "Uses cables to bring arms together in arc for chest isolation.", "sets": 3, "reps": 15, "duration": null, "resttime": 45, "difficulty": 4, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/chest%20fly.mp4", "calories_burned": 18 },
      { "exerciseid": 71, "name": "Pec Deck Fly", "description": "Machine fly movement focusing on chest squeeze.", "sets": 3, "reps": 12, "duration": null, "resttime": 45, "difficulty": 3, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/peck%20deck%20fly.mp4", "calories_burned": 11 },
      { "exerciseid": 72, "name": "Push-Up", "description": "Bodyweight push using chest, triceps and shoulders.", "sets": 3, "reps": 15, "duration": null, "resttime": 30, "difficulty": 4, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/push%20up.mp4", "calories_burned": 18 },
      { "exerciseid": 73, "name": "Plank", "description": "Isometric hold that engages full core.", "sets": 3, "reps": null, "duration": 30, "resttime": 30, "difficulty": 3, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/plank.mp4", "calories_burned": 27 },
      { "exerciseid": 74, "name": "Woodchopper", "description": "Rotational cable exercise targeting obliques.", "sets": 3, "reps": 12, "duration": null, "resttime": 30, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/wood%20chopper.mp4", "calories_burned": 18 },
      { "exerciseid": 75, "name": "Seated Leg Raise", "description": "Raises legs on chair apparatus to work lower abs.", "sets": 3, "reps": 15, "duration": null, "resttime": 30, "difficulty": 4, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/seated%20leg%20raise.mp4", "calories_burned": 18 },
      { "exerciseid": 76, "name": "Weighted Plank", "description": "Static hold with added weight for core endurance.", "sets": 3, "reps": null, "duration": 30, "resttime": 30, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/weighted%20plank.mp4", "calories_burned": 45 },
      { "exerciseid": 77, "name": "Bicycle Crunch", "description": "Dynamic twisting crunch that targets all abs.", "sets": 3, "reps": null, "duration": 60, "resttime": 30, "difficulty": 4, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/bycicle%20crunch.mp4", "calories_burned": 24 },
      { "exerciseid": 78, "name": "Treadmill Running", "description": "Running on treadmill for aerobic conditioning.", "sets": 2, "reps": null, "duration": 150, "resttime": 30, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/treadmill%20running.mp4", "calories_burned": 500 },
      { "exerciseid": 79, "name": "Stair Climber", "description": "Mimics stair climbing for legs and cardio.", "sets": 10, "reps": null, "duration": 600, "resttime": 30, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/stair%20climber.mp4", "calories_burned": 250 },
      { "exerciseid": 80, "name": "Stationary Bike", "description": "Seated cycling for low-impact cardio.", "sets": 2, "reps": null, "duration": 150, "resttime": 30, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/stationary%20bike.mp4", "calories_burned": 500 },
      { "exerciseid": 81, "name": "Rowing Machine", "description": "Rowing motion for full-body cardio and back work.", "sets": 10, "reps": null, "duration": 600, "resttime": 30, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/rowing.mp4", "calories_burned": 250 },
      { "exerciseid": 82, "name": "Elliptical Trainer", "description": "Smooth striding motion for cardio with low joint impact.", "sets": 20, "reps": null, "duration": 1200, "resttime": 30, "difficulty": 5, "animationurl": "https://zxfzxpcbjikmzykfqxsc.supabase.co/storage/v1/object/public/exercisevids/vids/elliptical%20machine.mp4", "calories_burned": 500 }
    ]
  }
};
  const { signUp } = useAuth();

  useEffect(() => {
    document.title = 'Register - Fitrack';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (generalError) setGeneralError('');
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.gender) newErrors.gender = 'Please select a gender';
    if (!formData.height || formData.height < 100 || formData.height > 250) newErrors.height = 'Height must be between 100 and 250 cm';
    if (!formData.weight || formData.weight < 30 || formData.weight > 300) newErrors.weight = 'Weight must be between 30 and 300 kg';
    if (!formData.goal) newErrors.goal = 'Please select a fitness goal';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handlePrevious = () => {
    setStep(1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (step === 1 && !validateStep1()) return;
    if (!validateStep2()) return;

    setLoading(true);
    setGeneralError('');
    setErrors({});

    try {
      // Create the new user via Supabase Auth
      const { data: authData, error: authError } = await signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            gender: formData.gender,
            height: formData.height,
            weight: formData.weight,
            goal: formData.goal
          }
        }
      });

      if (authError) {
        setGeneralError(authError.message || 'Failed to create account. Please try again.');
        setLoading(false);
        return;
      }

      // Supabase returns authData.user once the account is created
      const newUser = authData.user;
      if (!newUser || !newUser.id) {
        // Unexpected case where no user object is returned
        setGeneralError('An unexpected error occurred during sign up.');
        setLoading(false);
        return;
      }

      const plansToInsert = [];
      const planExercisesToInsert = [];

      for (const planName in DEFAULT_WORKOUT_PLANS) {
        const planData = DEFAULT_WORKOUT_PLANS[planName];
        plansToInsert.push({
          planname: planData.planname,
          description: planData.description,
          difficulty: planData.difficulty,
          goal: planData.goal,
          userid: newUser.id
        });
      }

      const { data: insertedPlans, error: planInsertError } = await supabase
        .from('WorkoutPlan')
        .insert(plansToInsert)
        .select('planid, planname');

      if (planInsertError) {
        console.error('Error inserting default plans:', planInsertError);
        setGeneralError('Account created, but failed to add default workout plans. Please check your email to confirm your account.');
        setSubmitted(true); // Still consider signup "successful" for the user
        setLoading(false);
        return;
      }

      for (const plan of insertedPlans) {
        const originalPlan = DEFAULT_WORKOUT_PLANS[plan.planname];
        if (originalPlan && originalPlan.exercises) {
          originalPlan.exercises.forEach((exercise, index) => {
            planExercisesToInsert.push({
              planid: plan.planid,
              exerciseid: exercise.exerciseid,
              exercise_order: index + 1 // Assign exercise_order based on array index
            });
          });
        }
      }

      const { error: planExInsertError } = await supabase
        .from('WorkoutPlanExercise')
        .insert(planExercisesToInsert);

      if (planExInsertError) {
        console.error('Error inserting default plan exercises:', planExInsertError);
        // User account and plans are created, but exercises failed.
        // We can inform the user but don't prevent signup completion.
        // setGeneralError('Account created, but failed to add exercises to default plans.');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Registration submission error:', error);
      setGeneralError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles['register-container']}>
        <div className={styles['register-success']}>
          <i className='bx bx-check-circle'></i>
          <h2>Registration Process Initiated!</h2>
          <p>
            Your account registration has started.
            Please check your email ({formData.email}) to confirm your account.
          </p>
          <Link to="/login" className={styles['btn-login']}>Proceed to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['register-container']}>
      <div className={styles['register-header']}>
        <Link to="/" className={styles['back-button']}>
          <i className='bx bx-arrow-back'></i>
        </Link>
        <div className={styles['logo-container']}>
          <img src={logo} alt="Fitrack Logo" className={styles['register-logo']} />
          <h1>Fitrack</h1>
        </div>
      </div>

      <div className={styles['register-form-container']}>
        <div className={styles['register-form-header']}>
          <h2>Create Your Account</h2>
          <div className={styles['step-indicator']}>
            <div className={`${styles.step} ${step === 1 ? styles.active : (step > 2 ? styles.completed : '')}`}>1</div>
            <div className={styles['step-line']}></div>
            <div className={`${styles.step} ${step === 2 ? styles.active : ''}`}>2</div>
          </div>
        </div>

        {generalError && <div className={`${styles.message} ${styles['error-message']} ${styles['main-error']}`}>{generalError}</div>}

        <form onSubmit={handleSubmit} className={styles['register-form']}>
          {step === 1 ? (
            <div className={styles['form-step']}>
              <h3>Account Information</h3>
              <div className={styles['form-group']}>
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? styles.error : ''}
                  disabled={loading}
                />
                {errors.name && <div className={styles['error-message']}>{errors.name}</div>}
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? styles.error : ''}
                  disabled={loading}
                />
                {errors.email && <div className={styles['error-message']}>{errors.email}</div>}
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? styles.error : ''}
                  disabled={loading}
                />
                {errors.password && <div className={styles['error-message']}>{errors.password}</div>}
                {!errors.password && <div className={styles['password-hint']}>Password must be at least 6 characters</div>}
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? styles.error : ''}
                  disabled={loading}
                />
                {errors.confirmPassword && <div className={styles['error-message']}>{errors.confirmPassword}</div>}
              </div>
              <div className={styles['form-actions']}>
                <button type="button" className={styles['btn-next']} onClick={handleNext} disabled={loading}>
                  Next <i className='bx bx-right-arrow-alt'></i>
                </button>
              </div>
            </div>
          ) : (
            <div className={styles['form-step']}>
              <h3>Personal Information</h3>
              <div className={styles['form-group']}>
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={errors.gender ? styles.error : ''}
                  disabled={loading}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {errors.gender && <div className={styles['error-message']}>{errors.gender}</div>}
              </div>
              <div className={styles['form-row']}>
                <div className={`${styles['form-group']} ${styles.half}`}>
                  <label htmlFor="height">Height (cm)</label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    min="100"
                    max="250"
                    className={errors.height ? styles.error : ''}
                    disabled={loading}
                  />
                  {errors.height && <div className={styles['error-message']}>{errors.height}</div>}
                </div>
                <div className={`${styles['form-group']} ${styles.half}`}>
                  <label htmlFor="weight">Weight (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min="30"
                    max="300"
                    step="0.1"
                    className={errors.weight ? styles.error : ''}
                    disabled={loading}
                  />
                  {errors.weight && <div className={styles['error-message']}>{errors.weight}</div>}
                </div>
              </div>
              <div className={styles['form-group']}>
                <label htmlFor="goal">Fitness Goal</label>
                <select
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className={errors.goal ? styles.error : ''}
                  disabled={loading}
                >
                  <option value="">Select Goal</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Cardiovascular Health">Cardiovascular Health</option>
                </select>
                {errors.goal && <div className={styles['error-message']}>{errors.goal}</div>}
              </div>
              <div className={styles['form-actions']}>
                <button
                  type="button"
                  className={styles['btn-back']}
                  onClick={handlePrevious}
                  disabled={loading}
                >
                  <i className='bx bx-left-arrow-alt'></i> Back
                </button>
                <button type="submit" className={styles['btn-register']} disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className={styles['login-link']}>
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
}
