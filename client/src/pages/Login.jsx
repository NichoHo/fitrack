import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../assets/css/login.module.css';
import 'boxicons/css/boxicons.min.css';
import logo from '../assets/img/logo.png';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors]     = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = 'Login - Fitrack';
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = 'Email is invalid';

    if (!formData.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Direct Supabase Auth call
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password
    });

    if (error) {
      if (error.message.includes('not confirmed')) {
        setErrors({ email: 'Please confirm your email—check your inbox for the confirmation link.' });
      } else {
        setErrors({ email: 'Invalid email or password.' });
      }
      return;
    }
  };

  if (submitted) {
    return (
      <div className={styles['login-container']}>
        <div className={styles['login-success']}>
          <i className='bx bx-check-circle'></i>
          <h2>Login Successful!</h2>
          <p>You are being redirected to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-header']}>
        <Link to="/" className={styles['back-button']}>
          <i className='bx bx-arrow-back'></i>
        </Link>
        <div className={styles['logo-container']}>
          <img src={logo} alt="Fitrack Logo" className={styles['login-logo']} />
          <h1>Fitrack</h1>
        </div>
      </div>

      <div className={styles['login-form-container']}>
        <div className={styles['login-form-header']}>
          <h2>Welcome Back!</h2>
          <p>Log in to continue your fitness journey</p>
        </div>

        <form onSubmit={handleSubmit} className={styles['login-form']}>
          <div className={styles['form-group']}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles['error'] : ''}
              placeholder="Enter your email"
            />
            {errors.email && <div className={styles['error-message']}>{errors.email}</div>}
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="password">Password</label>
            <div className={styles['password-input-container']}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? styles['error'] : ''}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className={styles['toggle-password']}
                onClick={() => setShowPassword(v => !v)}
              >
                <i className={`bx ${showPassword ? 'bx-hide' : 'bx-show'}`}></i>
              </button>
            </div>
            {errors.password && <div className={styles['error-message']}>{errors.password}</div>}
          </div>

          <div className={styles['form-options']}>
            <div className={styles['remember-me']}>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <Link to="/forgot-password" className={styles['forgot-password']}>
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className={styles['btn-login']}>
            Login
          </button>
        </form>

        <div className={styles['register-link']}>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}