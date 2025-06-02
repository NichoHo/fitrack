import React, { useState, useEffect } from 'react';
import { supabase, fetchWorkoutHistory } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import 'boxicons/css/boxicons.min.css';
import styles from '../assets/css/history.module.css';

export default function History() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [calendarData, setCalendarData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date()); // New state for custom calendar
  const currentDay = new Date(); // Constant for the current day for highlighting
  const [allWorkoutLogsByDate, setAllWorkoutLogsByDate] = useState({}); // New state to store all logs by date
  const [dailyWorkoutDetails, setDailyWorkoutDetails] = useState([]); // This will store details for the selected date

  useEffect(() => {
    document.title = 'History - Fitrack';

    // Sample workout data for testing
    const sampleData = [
      {
        id: '4bf3653e-dacd-4b41-861b-9cc6bd85a0a5',
        email: 'nicovalerian2@gmail.com',
        date: '2025-06-02T10:00:00Z',
        name: 'Morning Workout',
        duration_seconds: 3600,
        calories_burned: 400,
        WorkoutLogExercise: [
          { Exercises: { name: 'Squats' }, sets: 3, reps: 12, weight: 50 },
          { Exercises: { name: 'Push-ups' }, sets: 3, reps: 15 }
        ]
      },
      {
        id: '4bf3653e-dacd-4b41-861b-9cc6bd85a0a5',
        email: 'nicovalerian2@gmail.com',
        date: '2025-06-03T18:30:00Z',
        name: 'Evening Workout',
        duration_seconds: 2700,
        calories_burned: 350,
        WorkoutLogExercise: [
          { Exercises: { name: 'Running' }, sets: 1, reps: 1, weight: 0 },
          { Exercises: { name: 'Pull-ups' }, sets: 3, reps: 8 }
        ]
      }
    ];

    // For testing, use sample data instead of API call
    processHistory(sampleData);
    return;

    async function fetchLogs() {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        navigate('/login');
        return;
      }
      const userId = userData.user.id;

      const data = await fetchWorkoutHistory(userId);
      if (!data) {
        console.error('Error loading workout logs: No data returned');
        return;
      }

      if (userError) {
        console.error('Error fetching user data:', userError.message);
        navigate('/login');
        return;
      }

      if (!data) {
        console.error('Error loading workout logs: No data returned');
        return;
      }
      
      processHistory(data);
    }

    fetchLogs();
  }, [navigate]);

  function processHistory(data) {
    const calData = {};
    const dailyLogs = {}; // To store all workout logs by date

    data.forEach(log => {
      const d = new Date(log.date);
      const key = d.toLocaleDateString('en-CA'); // Format for calendar marking
      calData[key] = { completed: true };

      // Store daily workout logs for later retrieval
      if (!dailyLogs[key]) {
        dailyLogs[key] = [];
      }
      dailyLogs[key].push(log);
    });

    setAllWorkoutLogsByDate(dailyLogs); // Store all processed daily logs
    setCalendarData(calData);
  }

  // Effect to update daily workout details when selectedDate changes or allWorkoutLogsByDate is populated
  useEffect(() => {
    const fetchAndSetDailyDetails = () => {
      const formattedSelectedDate = selectedDate.toLocaleDateString('en-CA');
      // Use allWorkoutLogsByDate to get workouts for the selected date
      const workoutsForSelectedDate = allWorkoutLogsByDate[formattedSelectedDate] || [];
      const processedWorkouts = workoutsForSelectedDate.map(log => ({
        name: log.name, // Assuming WorkoutLog has a name field
        duration: new Date((log.duration_seconds || 0) * 1000).toISOString().substr(14, 5),
        calories: log.calories_burned || 0,
        date: new Date(log.date).toLocaleString('default', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        }),
        exercises: log.WorkoutLogExercise.map(ex => ({
          name: ex.Exercises.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight
        }))
      }));
      setDailyWorkoutDetails(processedWorkouts);
    };

    // Trigger this effect when selectedDate changes or allWorkoutLogsByDate is loaded/updated
    if (Object.keys(allWorkoutLogsByDate).length > 0 || Object.keys(allWorkoutLogsByDate).length === 0) {
      fetchAndSetDailyDetails();
    }
  }, [selectedDate, allWorkoutLogsByDate]); // Depend on selectedDate and allWorkoutLogsByDate

  const onDateChange = (date) => {
    setSelectedDate(date);
    // Ensure that when a date is selected, the month displayed is the month of the selected date
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const handleMonthChange = (offset) => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + offset, 1);
      return newMonth;
    });
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Determine the day of the week for the first day of the month (0 for Sunday, 1 for Monday, etc.)
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const days = [];

    // Add days from the previous month to fill the first week
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        dayOfMonth: prevMonthLastDay - i,
        isCurrentMonth: false
      });
    }

    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        dayOfMonth: i,
        isCurrentMonth: true
      });
    }

    // Add days from the next month to fill the last week
    const totalDaysDisplayed = days.length;
    const remainingSlots = 42 - totalDaysDisplayed; // Max 6 weeks * 7 days = 42 days for calendar grid
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        dayOfMonth: i,
        isCurrentMonth: false
      });
    }

    return days;
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
            {/* Custom Calendar Implementation */}
            <div className={styles['calendar-header']}>
              <button onClick={() => handleMonthChange(-1)}><i className='bx bx-chevron-left'></i></button>
              <h2>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
              <button onClick={() => handleMonthChange(1)}><i className='bx bx-chevron-right'></i></button>
            </div>
            <div className={styles['calendar-grid-container']}>
              <div className={styles['calendar-weekdays']}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className={styles['weekday']}>{day}</div>
                ))}
              </div>
              <div className={styles['calendar-days-grid']}>
                {generateCalendarDays().map((day, index) => (
                  <div
                    key={index}
                    className={`${styles['calendar-day']} ${day.isCurrentMonth ? '' : styles['other-month']} ${day.date.toDateString() === selectedDate.toDateString() ? styles['selected-date'] : ''} ${day.date.toDateString() === currentDay.toDateString() ? styles['current-day'] : ''}`}
                    onClick={() => onDateChange(day.date)}
                  >
                    <span>{day.dayOfMonth}</span>
                    {calendarData[day.date.toLocaleDateString('en-CA')] && (
                      <div className={styles['workout-completed-mark']}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles['history-divider']}></div>

          <div className={styles['daily-workout-details-section']}>
            <h2>Workouts on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
            {Array.isArray(dailyWorkoutDetails) && dailyWorkoutDetails.length > 0 ? (
              dailyWorkoutDetails.map((w, i) => (
                <div key={i} className={styles['workout-entry']}>
                  <div className={styles['workout-entry-header']}>
                    <div className={styles['workout-name']}>
                      <strong>{w.name}</strong>
                    </div>
                    <div className={styles['workout-meta']}>
                      <span><i className='bx bx-time'></i>{w.duration}</span>
                      <span><i className='bx bx-run'></i> {w.calories} kcal</span>
                      <span><i className='bx bx-calendar'></i>{w.date}</span>
                    </div>
                  </div>
                  {w.exercises && w.exercises.length > 0 && (
                    <div className={styles['exercise-details']}>
                      <h4 className={styles['exercise-details-header']}>Exercises:</h4>
                      {w.exercises.map((exercise, exIdx) => (
                        <div key={exIdx} className={styles['exercise-item']}>
                          <span className={styles['exercise-name']}>{exercise.name}:</span>
                          <span className={styles['exercise-stats']}>{exercise.sets} sets x {exercise.reps} reps {exercise.weight ? `x ${exercise.weight} kg` : ''}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No workouts recorded for this date.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}