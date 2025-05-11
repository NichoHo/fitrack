import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import 'boxicons/css/boxicons.min.css';
import '../assets/css/history.css';

export default function History() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Sample workout data - would be fetched from API in actual implementation
  const workoutData = {
    '2025-05-01': { completed: true },
    '2025-05-02': { completed: true },
    '2025-05-03': { completed: true },
    '2025-05-05': { completed: true },
    '2025-05-06': { completed: true },
    '2025-05-07': { completed: false },
    '2025-05-08': { completed: true },
    '2025-05-09': { completed: false },
    '2025-05-11': { completed: true },
    '2025-05-12': { completed: true, current: true },
  };

  // Sample workout history data
  const workoutHistory = [
    {
      period: 'May 2025',
      workouts: 15,
      duration: '25:45',
      entries: [
        {
          name: 'Lose Belly Fat - Day 7',
          duration: '00:13',
          calories: 5.3,
          date: 'May 11, 11:32 PM',
        },
        {
          name: 'Lose Belly Fat - Day 7',
          duration: '00:04',
          calories: 1.6,
          date: 'May 8, 4:43 PM',
        },
        {
          name: 'Lose Belly Fat - Day 7',
          duration: '00:19',
          calories: 7.7,
          date: 'May 6, 11:48 AM',
        },
        {
          name: 'Lose Belly Fat - Day 6',
          duration: '00:22',
          calories: 8.2,
          date: 'May 5, 10:15 AM',
        },
        {
          name: 'Lose Belly Fat - Day 5',
          duration: '00:13',
          calories: 4.9,
          date: 'May 4, 9:30 PM',
        },
        // More entries for the month...
      ]
    },
    // Additional months if needed
  ];

  useEffect(() => {
    document.title = 'History - Fitrack';
    
    function onResize() {
      if (window.innerWidth >= 768 && !isOpen) {
        setIsOpen(true);
      }
    }
    
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isOpen]);

  // Navigation for calendar month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Format month and year for display
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Generate days for the current month's calendar
  const renderCalendar = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    const endDate = new Date(monthEnd);
    
    const dateFormat = 'YYYY-MM-DD';
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    // Create header with day names
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const dayHeaders = daysOfWeek.map(dayName => (
      <div key={`header-${dayName}`} className="calendar-day-header">
        {dayName}
      </div>
    ));
    rows.push(<div className="calendar-days-header" key="header">{dayHeaders}</div>);

    // Add empty cells for days before the first of the month
    let dayOfWeek = day.getDay();
    for (let i = 0; i < dayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add days of the month
    while (day <= endDate) {
      formattedDate = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
      
      const workoutDay = workoutData[formattedDate];
      const isCurrentDay = day.toDateString() === new Date().toDateString();
      
      days.push(
        <div key={day.toString()} className={`calendar-day ${isCurrentDay ? 'today' : ''}`}>
          <div className={`day-number ${workoutDay?.current ? 'current' : ''}`}>
            {workoutDay?.completed ? (
              <div className="workout-completed">
                <i className='bx bx-check'></i>
              </div>
            ) : day.getDate()}
          </div>
        </div>
      );

      // Start a new row after Saturday
      if (days.length === 7) {
        rows.push(<div className="calendar-week" key={day.toString()}>{days}</div>);
        days = [];
      }
      
      day = new Date(day.getTime() + 86400000); // add one day
    }

    // Add remaining empty cells
    if (days.length > 0) {
      while (days.length < 7) {
        days.push(<div key={`empty-end-${days.length}`} className="calendar-day empty"></div>);
      }
      rows.push(<div className="calendar-week" key="last-row">{days}</div>);
    }

    return <div className="calendar-grid">{rows}</div>;
  };

  return (
    <div className="history-page">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      
      <div className={`history-content ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="history-header">
          <h1>History</h1>
        </div>
        
        <div className="history-container">
          <div className="calendar-section">
            <div className="calendar-header">
              <button className="month-nav" onClick={prevMonth}>
                <i className='bx bx-chevron-left'></i>
              </button>
              <h2>{formatMonthYear(currentMonth)}</h2>
              <button className="month-nav" onClick={nextMonth}>
                <i className='bx bx-chevron-right'></i>
              </button>
            </div>
            
            {renderCalendar()}
          </div>
          
          <div className="history-divider"></div>
          
          <div className="workout-history-section">
            <div className="workout-history-content">
              <h2>Monthly report</h2>
              
              {workoutHistory.map((month, index) => (
                <div key={index} className="monthly-summary">
                  <div className="month-period">{month.period}</div>
                  <div className="month-stats">{month.workouts} workout{month.workouts !== 1 ? 's' : ''} {month.duration}</div>
                  
                  {month.entries.map((workout, wIndex) => (
                    <div key={wIndex} className="workout-entry">
                      <div className="workout-entry-left">
                        <div className="workout-details">
                          <div className="workout-name">{workout.name}</div>
                          <div className="workout-meta">
                            <span><i className='bx bx-time'></i> {workout.duration}</span>
                            <span><i className='bx bx-flame'></i> {workout.calories} Kcal</span>
                          </div>
                        </div>
                      </div>
                      <div className="workout-date">
                        {workout.date}
                      </div>
                    </div>
                  ))}
                  
                  {index < workoutHistory.length - 1 && <div className="divider"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}