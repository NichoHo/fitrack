import React, { useState } from 'react';
import styles from '../assets/css/sidebar.module.css';
import logo from '../assets/img/logo.png';

export default function Sidebar({ isOpen, setIsOpen }) {
  const [showDropup, setShowDropup] = useState(false);

  const toggleDropup = () => {
    setShowDropup(!showDropup);
  };

  return (
    <nav className={`${styles.sidebar} ${!isOpen ? styles.close : ''}`}>
      <header>
        <div className={styles['nav-image-text']}>
          <img className={styles['nav-image']} src={logo} alt="Fitrack Logo" />
          {isOpen && (
            <div className={`${styles['nav-text']} ${styles['logo-text']}`}>
              <span className={styles['logo-name']}>Fitrack</span>
            </div>
          )}
        </div>
        <i
          className={`bx bx-chevron-right ${styles.toggle}`}
          onClick={() => setIsOpen(!isOpen)}
        />
      </header>

      <div className={styles['nav-menu-bar']}>
        <ul className={styles['nav-menu-links']}>
          <li className={styles['nav-link']}>
            <a href="/dashboard">
              <i className="bx bx-home-alt icon" />
              <span className={styles['nav-text']}>Dashboard</span>
            </a>
          </li>
          <li className={styles['nav-link']}>
            <a href="/workoutplan">
              <i className="bx bx-dumbbell icon" />
              <span className={styles['nav-text']}>Work Out Plans</span>
            </a>
          </li>
          <li className={styles['nav-link']}>
            <a href="/history">
              <i className="bx bx-line-chart icon" />
              <span className={styles['nav-text']}>History</span>
            </a>
          </li>
          <li className={`${styles['nav-link']} ${styles['mobile-more-menu']}`}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toggleDropup();
              }}
            >
              <i className="bx bx-dots-horizontal-rounded icon" />
              <span className={styles['nav-text']}>More</span>
            </a>
            {showDropup && (
              <div className={styles['mobile-dropup']}>
                <ul>
                  <li>
                    <a href="/account">
                      <i className="bx bx-user icon" />
                      <span>Account</span>
                    </a>
                  </li>
                  <li>
                    <a href="/logout">
                      <i className="bx bx-log-out icon" />
                      <span>Log Out</span>
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>

        <div className={styles['nav-bottom-content']}>
          <ul>
            <li>
              <a href="/account">
                <i className="bx bx-user icon" />
                {isOpen && <span className={styles['nav-text']}>Account</span>}
              </a>
            </li>
            <li>
              <a href="/logout">
                <i className="bx bx-log-out icon" />
                {isOpen && <span className={styles['nav-text']}>Log Out</span>}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}