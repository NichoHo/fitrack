import React, { useState } from 'react';
import '../assets/css/sidebar.css';
import logo from '../assets/img/logo.png';

export default function Sidebar({ isOpen, setIsOpen }) {
  const [showDropup, setShowDropup] = useState(false);

  const toggleDropup = () => {
    setShowDropup(!showDropup);
  };

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
          {/* More menu for mobile only */}
          <li className="nav-link mobile-more-menu">
            <a href="#" onClick={(e) => {
              e.preventDefault();
              toggleDropup();
            }}>
              <i className="bx bx-dots-horizontal-rounded icon" />
              <span className="nav-text">More</span>
            </a>
            {showDropup && (
              <div className="mobile-dropup">
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

        {/* Desktop bottom content - hidden on mobile */}
        <div className="nav-bottom-content">
          <ul>
            <li>
              <a href="/account">
                <i className="bx bx-user icon" />
                {isOpen && <span className="nav-text">Account</span>}
              </a>
            </li>
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