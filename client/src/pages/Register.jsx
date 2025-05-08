import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/register.css';
import 'boxicons/css/boxicons.min.css';
import logo from '../assets/img/logo.png';
import { supabase } from '../services/supabase';

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

  useEffect(() => {
    document.title = 'Register - Fitrack';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }
    
    if (!formData.height) {
      newErrors.height = 'Height is required';
    } else if (formData.height < 100 || formData.height > 250) {
      newErrors.height = 'Height must be between 100 and 250 cm';
    }
    
    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
    } else if (formData.weight < 30 || formData.weight > 300) {
      newErrors.weight = 'Weight must be between 30 and 300 kg';
    }
    
    if (!formData.goal) {
      newErrors.goal = 'Please select a fitness goal';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevious = () => {
    setStep(1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const { data, error } = await supabase
      .from('User')
      .insert([{
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        goal: formData.goal
      }]);
  
    if (error) {
      console.error('Error inserting user:', error);
      setErrors({ email: 'An account with this email may already exist.' });
    } else {
      setSubmitted(true);
    }
  };  

  if (submitted) {
    return (
      <div className="register-container">
        <div className="register-success">
          <i className='bx bx-check-circle'></i>
          <h2>Registration Successful!</h2>
          <p>Your account has been created successfully.</p>
          <Link to="/login" className="btn-login">Proceed to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-header">
        <Link to="/" className="back-button">
          <i className='bx bx-arrow-back'></i>
        </Link>
        <div className="logo-container">
          <img src={logo} alt="Fitrack Logo" className="register-logo" />
          <h1>Fitrack</h1>
        </div>
      </div>
      
      <div className="register-form-container">
        <div className="register-form-header">
          <h2>Create Your Account</h2>
          <div className="step-indicator">
            <div className={`step ${step === 1 ? 'active' : 'completed'}`}>1</div>
            <div className="step-line"></div>
            <div className={`step ${step === 2 ? 'active' : (step > 2 ? 'completed' : '')}`}>2</div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          {step === 1 ? (
            <>
              <div className="form-step">
                <h3>Account Information</h3>
                
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <div className="error-message">{errors.name}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                  />
                  {errors.password && <div className="error-message">{errors.password}</div>}
                  {!errors.password && (
                    <div className="password-hint">Password must be at least 6 characters</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  {errors.confirmPassword && (
                    <div className="error-message">{errors.confirmPassword}</div>
                  )}
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn-next" onClick={handleNext}>
                    Next <i className='bx bx-right-arrow-alt'></i>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-step">
                <h3>Personal Information</h3>
                
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={errors.gender ? 'error' : ''}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  {errors.gender && <div className="error-message">{errors.gender}</div>}
                </div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="height">Height (cm)</label>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      min="100"
                      max="250"
                      className={errors.height ? 'error' : ''}
                    />
                    {errors.height && <div className="error-message">{errors.height}</div>}
                  </div>
                  
                  <div className="form-group half">
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
                      className={errors.weight ? 'error' : ''}
                    />
                    {errors.weight && <div className="error-message">{errors.weight}</div>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="goal">Fitness Goal</label>
                  <select
                    id="goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className={errors.goal ? 'error' : ''}
                  >
                    <option value="">Select Goal</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Improved Cardiovascular Health">Improved Cardiovascular Health</option>
                    <option value="Flexibility and Mobility">Flexibility and Mobility</option>
                  </select>
                  {errors.goal && <div className="error-message">{errors.goal}</div>}
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn-back" onClick={handlePrevious}>
                    <i className='bx bx-left-arrow-alt'></i> Back
                  </button>
                  <button type="submit" className="btn-register">
                    Create Account
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
        
        <div className="login-link">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
}