import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/css/login.module.css'; // Reusing login styles for consistency
import logo from '../assets/img/logo.png';

const UpdatePassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // This effect can be used to check if the user is redirected with a valid token
        // Supabase handles the token validation internally for `updateUser`
    }, []);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                throw error;
            }

            setMessage('Your password has been updated successfully!');
            setTimeout(() => {
                navigate('/login');
            }, 3000); // Redirect to login after 3 seconds
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
                <h2>Update Password</h2>
                <form onSubmit={handleUpdatePassword} className={styles['login-form']}>
                    <div className={styles['form-group']}>
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your new password"
                        />
                    </div>
                    <div className={styles['form-group']}>
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm your new password"
                        />
                    </div>
                    {message && <p className={styles['success-message']}>{message}</p>}
                    {error && <p className={styles['error-message']}>{error}</p>}
                    <button type="submit" disabled={loading} className={styles['btn-login']}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;