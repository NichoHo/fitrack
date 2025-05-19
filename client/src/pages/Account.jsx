import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Sidebar from '../components/Sidebar';
import 'boxicons/css/boxicons.min.css';
import styles from '../assets/css/account.module.css';

export default function Account() {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    gender: '',
    height: '',
    weight: '',
    goal: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        navigate('/login');
        return;
      }

      const { data: userRow, error: dbError } = await supabase
        .from('User')
        .select('*')
        .eq('id', user.id)
        .single();

      if (dbError || !userRow) {
        setErrorMessage('Failed to load profile data');
        return;
      }

      setFormData({
        name: userRow.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        gender: userRow.gender || '',
        height: userRow.height || '',
        weight: userRow.weight || '',
        goal: userRow.goal || ''
      });
    }

    loadUser();
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && !isOpen) setIsOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    document.title = 'Account - Fitrack';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      setErrorMessage('User not authenticated');
      return;
    }

    const { error } = await supabase
      .from('User')
      .update({
        name: formData.name,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        goal: formData.goal
      })
      .eq('id', user.id)
      .select();

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage('Profile updated successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.newPassword) {
      setErrorMessage('New password is required');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (formData.newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: formData.newPassword
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage('Password updated successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles['dashboard-wrapper']}>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <section className={styles.home}>
        <div className={styles['account-container']}>
          <div className={`${styles.section} ${styles['account-section']}`}>
            <div className={styles['section-header']}>
              <h2 className={styles['section-title']}>Account Settings</h2>
            </div>

            {successMessage && (
              <div className={`${styles.message} ${styles['success-message']}`}>
                <i className="bx bx-check-circle"></i> {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className={`${styles.message} ${styles['error-message']}`}>
                <i className="bx bx-error-circle"></i> {errorMessage}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className={styles['account-form']}>
              <div className={styles['form-group']}>
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={formData.email} disabled />
              </div>

              <div className={styles['section-divider']}></div>

              <div className={styles['section-header']}>
                <h3 className={styles['section-subtitle']}>Personal Information</h3>
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>
                </select>
              </div>

              <div className={styles['form-row']}>
                <div className={`${styles['form-group']} ${styles.half}`}>
                  <label htmlFor="height">Height (cm)</label>
                  <input
                    id="height"
                    name="height"
                    type="number"
                    value={formData.height}
                    onChange={handleChange}
                    min="100"
                    max="250"
                    required
                  />
                </div>
                <div className={`${styles['form-group']} ${styles.half}`}>
                  <label htmlFor="weight">Weight (kg)</label>
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleChange}
                    min="30"
                    max="300"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="goal">Fitness Goal</label>
                <select id="goal" name="goal" value={formData.goal} onChange={handleChange} required>
                  <option value="">Select Goal</option>
                  <option>Weight Loss</option>
                  <option>Muscle Gain</option>
                  <option>Improved Cardiovascular Health</option>
                  <option>Flexibility and Mobility</option>
                </select>
              </div>

              <div className={styles['form-actions']}>
                <button type="submit" className={styles['btn-save']}>
                  Save Changes
                </button>
              </div>
            </form>

            <div className={styles['section-divider']}></div>

            <form onSubmit={handlePasswordSubmit} className={styles['password-form']}>
              <div className={styles['section-header']}>
                <h3 className={styles['section-subtitle']}>Change Password</h3>
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles['form-actions']}>
                <button type="submit" className={styles['btn-save']}>
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}