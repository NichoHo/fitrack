import React, { useState, useEffect } from 'react';
import '../assets/css/dashboard.css';
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
    <div className="dashboard-wrapper">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <section className="home">
        <div className="top-row">
          {/* Reports */}
          <div className="section reports-section">
            <h2 className="section-title">Reports</h2>
            <div className="reports">
              <div className="report-card">
                <i className="bx bx-dumbbell icon report-icon" />
                <h3>2</h3>
                <p>WORKOUTS</p>
              </div>
              <div className="report-card">
                <i className="bx bxs-flame report-icon" />
                <h3>76.2</h3>
                <p>KCAL</p>
              </div>
              <div className="report-card">
                <i className="bx bx-time icon report-icon" />
                <h3>3m15s</h3>
              </div>
            </div>
          </div>

          {/* Weight */}
          <div className="section weight-section">
            <div className="section-header">
              <h2 className="section-title">Weight (kg)</h2>
            </div>
            <div className="stats-row">
              <div className="stat-item">
                <h4>65</h4>
                <p>Current</p>
              </div>
              <div className="stat-item">
                <h4>65</h4>
                <p>Heaviest</p>
              </div>
              <div className="stat-item">
                <h4>65</h4>
                <p>Lightest</p>
              </div>
            </div>
            <div className="chart-placeholder">[Weight Chart Here]</div>
          </div>
        </div>

        <div className="bottom-row">
          {/* BMI */}
          <div className="section bmi-section">
            <div className="section-header">
              <h2 className="section-title">BMI (kg/m²)</h2>
            </div>
            <div className="bmi-value">
              <h2>21.2</h2>
              <p className="bmi-status">Healthy weight</p>
            </div>
            <div className="bmi-scale">
              <div className="scale-bar">[Gradient Scale Here]</div>
              <div className="height-input">
                <span>Height</span>
                <div className="height-value">175 cm</div>
              </div>
            </div>
          </div>

          {/* Streak Tracker */}
          <div className="section streak-section">
            <div className="section-header">
              <h2 className="section-title">Streak Tracker</h2>
            </div>
            <div className="streak-calendar">
              {/* You can replace this div with an actual calendar UI later */}
              [Weekly Streak Tracker Here]
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}