import React, { useState, useEffect } from 'react';
import styles from '../assets/css/dashboard.module.css';
import 'boxicons/css/boxicons.min.css';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(true);

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
    document.title = 'Dashboard - Fitrack';
  }, []);

  return (
    <div className={styles['dashboard-wrapper']}>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <section className={styles.home}>
        <div className={styles['top-row']}>
          {/* Reports */}
          <div className={`${styles.section} ${styles['reports-section']}`}>
            <h2 className={styles['section-title']}>Reports</h2>
            <div className={styles.reports}>
              <div className={styles['report-card']}>
                <i className={`bx bx-dumbbell icon ${styles['report-icon']}`} />
                <h3>2</h3>
                <p>WORKOUTS</p>
              </div>
              <div className={styles['report-card']}>
                <i className={`bx bxs-flame ${styles['report-icon']}`} />
                <h3>76.2</h3>
                <p>KCAL</p>
              </div>
              <div className={styles['report-card']}>
                <i className={`bx bx-time icon ${styles['report-icon']}`} />
                <h3>3m15s</h3>
              </div>
            </div>
          </div>

          {/* Weight */}
          <div className={`${styles.section} ${styles['weight-section']}`}>
            <div className={styles['section-header']}>
              <h2 className={styles['section-title']}>Weight (kg)</h2>
            </div>
            <div className={styles['stats-row']}>
              <div className={styles['stat-item']}>
                <h4>65</h4>
                <p>Current</p>
              </div>
              <div className={styles['stat-item']}>
                <h4>65</h4>
                <p>Heaviest</p>
              </div>
              <div className={styles['stat-item']}>
                <h4>65</h4>
                <p>Lightest</p>
              </div>
            </div>
            <div className={styles['chart-placeholder']}>[Weight Chart Here]</div>
          </div>
        </div>

        <div className={styles['bottom-row']}>
          {/* BMI */}
          <div className={`${styles.section} ${styles['bmi-section']}`}>
            <div className={styles['section-header']}>
              <h2 className={styles['section-title']}>BMI (kg/m²)</h2>
            </div>
            <div className={styles['bmi-value']}>
              <h2>21.2</h2>
              <p className={styles['bmi-status']}>Healthy weight</p>
            </div>
            <div className={styles['bmi-scale']}>
              <div className={styles['scale-bar']}>[Gradient Scale Here]</div>
              <div className={styles['height-input']}>
                <span>Height</span>
                <div className={styles['height-value']}>175 cm</div>
              </div>
            </div>
          </div>

          {/* Streak Tracker */}
          <div className={`${styles.section} ${styles['streak-section']}`}>
            <div className={styles['section-header']}>
              <h2 className={styles['section-title']}>Streak Tracker</h2>
            </div>
            <div className={styles['streak-calendar']}>
              [Weekly Streak Tracker Here]
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}