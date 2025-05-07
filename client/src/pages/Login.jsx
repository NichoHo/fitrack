import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/login.css';
import 'boxicons/css/boxicons.min.css';
import logo from '../assets/img/logo.png';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = 'Login - Fitrack';
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: fieldValue
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Login submitted:', formData);
      setSubmitted(true);
      
      // Simulate authentication process
      setTimeout(() => {
        console.log('Redirecting to dashboard...');
        // Implement your redirect logic here
      }, 2000);
    }
  };

  if (submitted) {
    return (
      <div className="login-container">
        <div className="login-success">
          <i className='bx bx-check-circle'></i>
          <h2>Login Successful!</h2>
          <p>You are being redirected to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <Link to="/" className="back-button">
          <i className='bx bx-arrow-back'></i>
        </Link>
        <div className="logo-container">
          <img src={logo} alt="Fitrack Logo" className="login-logo" />
          <h1>Fitrack</h1>
        </div>
      </div>
      
      <div className="login-form-container">
        <div className="login-form-header">
          <h2>Welcome Back!</h2>
          <p>Log in to continue your fitness journey</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                <i className={`bx ${showPassword ? 'bx-hide' : 'bx-show'}`}></i>
              </button>
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
          </div>
          
          <button type="submit" className="btn-login">
            Login
          </button>
          
          <div className="divider">
            <span>or continue with</span>
          </div>
          
          <div className="social-logins">
            <button type="button" className="social-btn google">
              <i className='bx bxl-google'></i>
              <span>Google</span>
            </button>
            <button type="button" className="social-btn facebook">
              <i className='bx bxl-facebook'></i>
              <span>Facebook</span>
            </button>
          </div>
        </form>
        
        <div className="register-link">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}