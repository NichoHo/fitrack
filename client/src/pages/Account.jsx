import React, { useState, useEffect } from 'react';
import '../assets/css/dashboard.css';
import '../assets/css/account.css';
import 'boxicons/css/boxicons.min.css';
import Sidebar from '../components/Sidebar';

export default function Account() {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    gender: 'Male',
    height: 175,
    weight: 65,
    goal: 'Weight Loss'
  });
  
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768 && !isOpen) {
        setIsOpen(true);
      }
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isOpen]);

  useEffect(() => {
    document.title = 'Account - Fitrack';
    // In a real app, you would fetch user data here
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const togglePasswordEdit = () => {
    setIsEditingPassword(!isEditingPassword);
    // Reset password fields when toggling
    if (!isEditingPassword) {
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (isEditingPassword) {
      if (!formData.currentPassword) {
        setErrorMessage('Current password is required');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setErrorMessage('New passwords do not match');
        return;
      }
      if (formData.newPassword && formData.newPassword.length < 6) {
        setErrorMessage('Password must be at least 6 characters');
        return;
      }
    }

    // Clear any previous messages
    setErrorMessage('');
    
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    
    // Show success message
    setSuccessMessage('Account updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <section className="home">
        <div className="account-container">
          <div className="section account-section">
            <div className="section-header">
              <h2 className="section-title">Account Settings</h2>
            </div>
            
            {successMessage && (
              <div className="message success-message">
                <i className="bx bx-check-circle"></i>
                {successMessage}
              </div>
            )}
            
            {errorMessage && (
              <div className="message error-message">
                <i className="bx bx-error-circle"></i>
                {errorMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="account-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group password-section">
                <div className="password-header">
                  <label>Password</label>
                  <button 
                    type="button" 
                    className="password-toggle-btn"
                    onClick={togglePasswordEdit}
                  >
                    {isEditingPassword ? 'Cancel' : 'Change Password'}
                  </button>
                </div>
                
                {isEditingPassword && (
                  <div className="password-fields">
                    <div className="form-group">
                      <label htmlFor="currentPassword">Current Password</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="newPassword">New Password</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="section-divider"></div>
              
              <div className="section-header">
                <h3 className="section-subtitle">Personal Information</h3>
              </div>
              
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
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
                  />
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
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="goal">Fitness Goal</label>
                <select
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Improved Cardiovascular Health">Improved Cardiovascular Health</option>
                  <option value="Flexibility and Mobility">Flexibility and Mobility</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-save">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}