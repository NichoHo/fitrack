import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../assets/css/errorpage.module.css';

const ErrorPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/">
          <button className={`${styles.button} ${styles['cool-button']}`}>
            Go Back to Landing Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;