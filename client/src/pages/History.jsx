import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import 'boxicons/css/boxicons.min.css';
import styles from '../assets/css/history.module.css';

export default function History() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [calendarData, setCalendarData] = useState({});
  const [monthlyReport, setMonthlyReport] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    document.title = 'History - Fitrack';

    async function fetchLogs() {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        navigate('/login');
        return;
      }
      const userId = userData.user.id;

      const { data, error } = await supabase
        .from('WorkoutLog')
        .select('*')
        .eq('userid', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading workout logs:', error.message);
      } else {
        processHistory(data);
      }
    }

    fetchLogs();
  }, [navigate]);

  function processHistory(data) {
    const calData = {};
    const months = {};

    data.forEach(log => {
      const d = new Date(log.date);
      const key = d.toLocaleDateString('en-CA');
      calData[key] = { completed: true };

      const m = d.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!months[m]) {
        months[m] = {
          period: m,
          workouts: 0,
          durationSeconds: 0,
          entries: []
        };
      }

      months[m].workouts += 1;
      months[m].durationSeconds += log.duration_seconds || 0;

      months[m].entries.push({
        name: `Plan ${log.planid}`,
        duration: new Date((log.duration_seconds || 0) * 1000).toISOString().substr(14, 5),
        calories: log.calories_burned || 0,
        date: d.toLocaleString('default', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        })
      });
    });

    const report = Object.values(months).map(m => {
      const mmss = new Date(m.durationSeconds * 1000).toISOString().substr(14, 5);
      return { ...m, duration: mmss };
    });

    setCalendarData(calData);
    setMonthlyReport(report);
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const renderCalendar = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    const endDate = new Date(monthEnd);
    const rows = [];
    let days = [];
    let day = startDate;

    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const dayHeaders = daysOfWeek.map((d, i) => (
      <div key={`header-${d}-${i}`} className={styles['calendar-day-header']}>{d}</div>
    ));

    rows.push(
      <div className={styles['calendar-days-header']} key="header-row">
        {dayHeaders}
      </div>
    );

    for (let i = 0; i < day.getDay(); i++) {
      days.push(<div key={`empty-start-${i}`} className={`${styles['calendar-day']} ${styles.empty}`}></div>);
    }

    while (day <= endDate) {
      const formattedDate = day.toLocaleDateString('en-CA');
      const workoutDay = calendarData[formattedDate];
      const isCurrentDay = day.toDateString() === new Date().toDateString();

      days.push(
        <div key={formattedDate} className={`${styles['calendar-day']} ${isCurrentDay ? styles.today : ''}`}>
          <div className={styles['day-number']}>
            {workoutDay?.completed ? <i className='bx bx-check'></i> : day.getDate()}
          </div>
        </div>
      );

      if (days.length === 7) {
        rows.push(<div className={styles['calendar-week']} key={`week-${day}`}>{days}</div>);
        days = [];
      }

      day = new Date(day.getTime() + 86400000);
    }

    if (days.length > 0) {
      while (days.length < 7) {
        days.push(<div key={`empty-end-${days.length}`} className={`${styles['calendar-day']} ${styles.empty}`}></div>);
      }
      rows.push(<div className={styles['calendar-week']} key="last-row">{days}</div>);
    }

    return <div className={styles['calendar-grid']}>{rows}</div>;
  };

  return (
    <div className={styles['history-page']}>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className={`${styles['history-content']} ${isOpen ? styles['sidebar-open'] : styles['sidebar-closed']}`}>
        <div className={styles['history-header']}>
          <h1>History</h1>
        </div>

        <div className={styles['history-container']}>
          <div className={styles['calendar-section']}>
            <div className={styles['calendar-header']}>
              <button className={styles['month-nav']} onClick={prevMonth}>
                <i className='bx bx-chevron-left'></i>
              </button>
              <h2>{formatMonthYear(currentMonth)}</h2>
              <button className={styles['month-nav']} onClick={nextMonth}>
                <i className='bx bx-chevron-right'></i>
              </button>
            </div>

            {renderCalendar()}
          </div>

          <div className={styles['history-divider']}></div>

          <div className={styles['workout-history-section']}>
            {monthlyReport.map((month, idx) => (
              <div key={idx} className={styles['monthly-summary']}>
                <div className={styles['month-period']}>{month.period}</div>
                <div className={styles['month-stats']}>
                  {month.workouts} workout{month.workouts !== 1 ? 's' : ''} • {month.duration}
                </div>

                {month.entries.map((w, i) => (
                  <div key={i} className={styles['workout-entry']}>
                    <div><strong>{w.name}</strong> — {w.duration}</div>
                    <div>{w.calories} kcal • {w.date}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}