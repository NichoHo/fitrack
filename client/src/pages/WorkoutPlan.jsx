import React, { useState, useEffect } from "react";
import styles from "../assets/css/workoutplan.module.css";
import "boxicons/css/boxicons.min.css";
import Sidebar from "../components/Sidebar";
import WorkoutPlanImage from "../assets/img/workoutplan1.jpg";

const WorkoutPlan = () => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768 && !isOpen) {
        setIsOpen(true);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen]);

  useEffect(() => {
    document.title = "Workout Plan - Fitrack";
  }, []);

  return (
    <div>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={styles["workout-plan-header"]}>
        <h1>Workout Plan</h1>
      </div>
      <div className={styles["workout-cards-container"]}>
        {[1, 2, 3].map((_, index) => (
          <div key={index} className={styles["workout-plan-card"]}>
            <img
              src={WorkoutPlanImage}
              alt="Workout Plan"
              className={styles["workout-plan-image"]}
            />
            <div className={styles["workout-plan-content"]}>
              <h3 className={styles["workout-plan-title"]}>Full Body Blast</h3>
              <div className={styles["workout-plan-meta"]}>
                <span className={styles["meta-item"]}>
                  <i className="bx bx-layer"></i>
                  <span>Intermediate</span>
                </span>
                <span className={styles["meta-item"]}>
                  <i className="bx bx-list-ul"></i>
                  <span>5 Exercises</span>
                </span>
              </div>
              <button className={styles["workout-plan-action-btn"]}>
                View Plan <i className="bx bx-right-arrow-alt"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPlan;