import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import styles from '../assets/css/login.module.css';
import logo from '../assets/img/logo.png';
import { Link } from 'react-router-dom';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`, // This URL should be handled by another page to set the new password
            });

            if (error) {
                throw error;
            }

            setMessage('Password reset email sent. Please check your inbox.');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles['login-container']}>
            <div className={styles['login-form-container']}>
                <div className={styles['logo-container']}>
                    <img src={logo} alt="Logo" className={styles['login-logo']} />
                    <h1>Fitrack</h1> {/* Added Fitrack title for consistency with Login page */}
                </div>
                <h2>Forget Password</h2>
                <form onSubmit={handleResetPassword} className={styles['login-form']}>
                    <div className={styles['form-group']}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    {message && <p className={styles['success-message']}>{message}</p>}
                    {error && <p className={styles['error-message']}>{error}</p>}
                    <button type="submit" disabled={loading} className={styles['btn-login']}>
                        {loading ? 'Sending...' : 'Reset Password'}
                    </button>
                </form>
                <div className={styles['register-link']}> {/* Using register-link for consistency */}
                    Remembered your password? <Link to="/login">Log in</Link>
                </div>
                <div className={styles['register-link']}> {/* Using register-link for consistency */}
                    Don't have an account? <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;