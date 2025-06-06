import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const { signUp } = useAuth();
  const navigate = useNavigate();

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
      // 1) Create the new user via Supabase Auth
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

      // 2) Insert the three default plans into WorkoutPlan
      //    We’re using .insert(...).select() to retrieve each new plan’s planid
      const defaultPlans = [
        {
          planname: 'Fat Burner',
          description: 'A mix of cardio and core exercises to aid fat loss.',
          difficulty: 4,
          goal: 'Weight Loss',
          userid: newUser.id
        },
        {
          planname: 'Muscle Builder',
          description: 'A strength-focused routine with heavy compound lifts for hypertrophy.',
          difficulty: 5,
          goal: 'Muscle Gain',
          userid: newUser.id
        },
        {
          planname: 'Cardio Boost',
          description: 'A cardio-centric routine to boost heart and lung capacity.',
          difficulty: 5,
          goal: 'Cardiovascular Health',
          userid: newUser.id
        }
      ];

      const { data: insertedPlans, error: planInsertError } = await supabase
        .from('WorkoutPlan')
        .insert(defaultPlans)
        .select('planid'); 
      // --> `insertedPlans` will be an array like: [ { planid: 7 }, { planid: 8 }, { planid: 9 } ]

      if (planInsertError) {
        console.error('Error inserting default plans:', planInsertError);
        // We do not abort the whole flow if plans fail—still consider the user created. 
        // However, you can choose to show an error message here if you prefer:
        // setGeneralError('Account created, but failed to add default workout plans.');
        setSubmitted(true);
        setLoading(false);
        return;
      }

      // 3) Build and insert the corresponding WorkoutPlanExercise rows
      //    The JSON you provided maps exactly to each plan’s exercises.
      //    We must match `insertedPlans[0].planid` → exercises for “Fat Burner” and so on.
      const planExercises = [
        // For "Fat Burner"  (insertedPlans[0])
        { planid: insertedPlans[0].planid, exerciseid: 78, exercise_order: 1 },
        { planid: insertedPlans[0].planid, exerciseid: 79, exercise_order: 2 },
        { planid: insertedPlans[0].planid, exerciseid: 80, exercise_order: 3 },
        { planid: insertedPlans[0].planid, exerciseid: 73, exercise_order: 4 },
        { planid: insertedPlans[0].planid, exerciseid: 77, exercise_order: 5 },

        // For "Muscle Builder" (insertedPlans[1])
        { planid: insertedPlans[1].planid, exerciseid: 49, exercise_order: 1 },
        { planid: insertedPlans[1].planid, exerciseid: 58, exercise_order: 2 },
        { planid: insertedPlans[1].planid, exerciseid: 67, exercise_order: 3 },
        { planid: insertedPlans[1].planid, exerciseid: 62, exercise_order: 4 },
        { planid: insertedPlans[1].planid, exerciseid: 59, exercise_order: 5 },

        // For "Cardio Boost" (insertedPlans[2])
        { planid: insertedPlans[2].planid, exerciseid: 78, exercise_order: 1 },
        { planid: insertedPlans[2].planid, exerciseid: 79, exercise_order: 2 },
        { planid: insertedPlans[2].planid, exerciseid: 81, exercise_order: 3 },
        { planid: insertedPlans[2].planid, exerciseid: 82, exercise_order: 4 },
        { planid: insertedPlans[2].planid, exerciseid: 80, exercise_order: 5 }
      ];

      const { error: planExInsertError } = await supabase
        .from('WorkoutPlanExercise')
        .insert(planExercises);

      if (planExInsertError) {
        console.error('Error inserting default plan exercises:', planExInsertError);
        // Again—we’ve already created the user and plans, so we’ll consider signup “successful.”
        // If you want to inform the user, you could set: 
        // setGeneralError('Account created, but failed to add exercises to default plans.');
      }

      // 4) Finally, mark registration as submitted (so they see “Check your email”)
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