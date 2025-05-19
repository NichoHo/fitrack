import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import styles from '../assets/css/workout.module.css';

// Import placeholder images - replace with actual assets in production
import sidebridge from '../assets/img/side-bridge.jpg';
import obliqueTwist from '../assets/img/oblique-twist.png';

export default function Workout() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [restTime, setRestTime] = useState(30);
  const [isResting, setIsResting] = useState(false);
  const [timer, setTimer] = useState(null);
  const [goToNext, setGoToNext] = useState(false);

  const exercises = [
    {
      id: 1,
      name: "SIDE BRIDGES RIGHT",
      image: sidebridge,
      reps: 6,
      description: "Lie on your right side with your right elbow under your shoulder. Lift your hips and keep your body in a straight line.",
      completed: false,
      position: 7,
    },
    {
      id: 2,
      name: "RECLINED OBLIQUE TWIST",
      image: obliqueTwist,
      reps: 12,
      description: "Lie on your back with your legs bent. Twist your knees to one side while keeping your shoulders on the ground.",
      completed: false,
      perSide: 6,
      position: 8,
    },
  ];

  useEffect(() => {
    document.title = 'Workout - Fitrack';
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  const startRest = () => {
    setIsResting(true);
    setRestTime(30);
    const interval = setInterval(() => {
      setRestTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResting(false);
          setTimer(null);
          if (goToNext && currentExercise < exercises.length - 1) {
            setCurrentExercise(prevIndex => prevIndex + 1);
            setGoToNext(false);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimer(interval);
  };

  const addTime = () => {
    setRestTime(prev => prev + 20);
  };

  const skipRest = () => {
    if (timer) clearInterval(timer);
    setIsResting(false);
    setTimer(null);
    if (goToNext && currentExercise < exercises.length - 1) {
      setCurrentExercise(prevIndex => prevIndex + 1);
      setGoToNext(false);
    }
  };

  const completeExercise = () => {
    const updatedExercises = [...exercises];
    updatedExercises[currentExercise].completed = true;
    setGoToNext(true);
    startRest();
  };

  const moveToNextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const moveToPrevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderProgressDots = () => {
    return (
      <div className={styles['progress-dots']}>
        {Array(17).fill().map((_, i) => {
          const current = i === exercises[currentExercise].position - 1;
          const completed = i < exercises[currentExercise].position - 1;
          return (
            <div
              key={i}
              className={`${styles['progress-dot']} ${completed ? styles.completed : ''} ${current ? styles.current : ''}`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles['workout-container']}>
      <div className={styles['workout-content']}>
        <div className={styles['exercise-visual']}>
          <Link to="/dashboard" className={styles['back-button']}>
            <i className='bx bx-arrow-back'></i>
          </Link>
          <div className={styles['exercise-image-container']}>
            <img
              src={exercises[currentExercise].image}
              alt={exercises[currentExercise].name}
              className={styles['exercise-image']}
            />
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles['exercise-details']}>
          {renderProgressDots()}

          {isResting ? (
            <div className={styles['rest-section']}>
              <h2 className={styles['rest-title']}>REST</h2>
              <div className={styles['rest-timer']}>{formatTime(restTime)}</div>
              <div className={styles['rest-controls']}>
                <button className={styles['time-button']} onClick={addTime}>+20s</button>
                <button className={styles['skip-button']} onClick={skipRest}>Skip</button>
              </div>
            </div>
          ) : (
            <div className={styles['exercise-info']}>
              <div className={styles['exercise-header']}>
                <div className={styles['exercise-position']}>
                  NEXT {exercises[currentExercise].position}/{17}
                </div>
                <h2 className={styles['exercise-title']}>{exercises[currentExercise].name}</h2>
              </div>

              <div className={styles['exercise-counter']}>
                {exercises[currentExercise].perSide && (
                  <div className={styles['per-side-text']}>
                    Each Side × {exercises[currentExercise].perSide}
                  </div>
                )}
                <div className={styles['reps-count']}>× {exercises[currentExercise].reps}</div>
              </div>

              <div className={styles['exercise-description']}>
                <p>{exercises[currentExercise].description}</p>
              </div>

              <div className={styles['navigation-controls']}>
                <button
                  className={`${styles['nav-button']} ${styles.prev}`}
                  onClick={moveToPrevExercise}
                  disabled={currentExercise === 0}
                >
                  <i className='bx bx-chevron-left'></i>
                </button>

                <button className={styles['complete-button']} onClick={completeExercise}>
                  <i className='bx bx-check'></i>
                </button>

                <button
                  className={`${styles['nav-button']} ${styles.next}`}
                  onClick={moveToNextExercise}
                  disabled={currentExercise === exercises.length - 1}
                >
                  <i className='bx bx-chevron-right'></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}