import React from 'react';
import logo from '../assets/img/logo.png';

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <nav className={`sidebar ${isOpen ? '' : 'close'}`}>
      <header>
        <div className="nav-image-text">
          <img className="nav-image" src={logo} alt="Fitrack Logo" />
          {isOpen && (
            <div className="nav-text logo-text">
              <span className="logo-name">Fitrack</span>
            </div>
          )}
        </div>
        <i
          className="bx bx-chevron-right toggle"
          onClick={() => setIsOpen(!isOpen)}
        />
      </header>

      <div className="nav-menu-bar">
        <ul className="nav-menu-links">
          <li className="nav-link">
            <a href="/dashboard">
              <i className="bx bx-home-alt icon" />
              <span className="nav-text">Dashboard</span>
            </a>
          </li>
          <li className="nav-link">
            <a href="/workout-plans">
              <i className="bx bx-dumbbell icon" />
              <span className="nav-text">Work Out Plans</span>
            </a>
          </li>
          <li className="nav-link">
            <a href="/history">
              <i className="bx bx-line-chart icon" />
              <span className="nav-text">History</span>
            </a>
          </li>
        </ul>

        <div className="nav-bottom-content">
          <ul>
            <li>
              <a href="/logout">
                <i className="bx bx-log-out icon" />
                {isOpen && <span className="nav-text">Log Out</span>}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}