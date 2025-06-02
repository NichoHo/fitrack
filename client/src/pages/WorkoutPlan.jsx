import React, { useState, useEffect } from "react";
import styles from "../assets/css/workoutplan.module.css";
import "boxicons/css/boxicons.min.css";
import Sidebar from "../components/Sidebar";
import DifficultyRating from '../components/DifficultyRating';
import { supabase } from "../services/supabase";
import WorkoutPlanImage from "../assets/img/workoutplan1.jpg";
import { useNavigate } from "react-router-dom";

const WorkoutPlan = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    async function fetchPlansAndCounts() {
      setLoading(true);
      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setPlans([]);
        setLoading(false);
        return;
      }

      // Fetch user's workout plans
      const { data: plansData, error: plansError } = await supabase
        .from("WorkoutPlan")
        .select("*")
        .eq("userid", user.id)
        .order("created_at", { ascending: false });

      if (plansError || !plansData) {
        console.error("Error fetching workout plans:", plansError);
        setPlans([]);
        setLoading(false);
        return;
      }

      // Fetch all plan exercises
      const { data: planExercises, error: exError } = await supabase
        .from("WorkoutPlanExercise")
        .select("planid, exerciseid");

      if (exError) {
        console.error("Error fetching plan exercises:", exError);
      }

      // Count exercises per plan
      const exerciseCounts = (planExercises || []).reduce((acc, item) => {
        acc[item.planid] = (acc[item.planid] || 0) + 1;
        return acc;
      }, {});

      // Merge counts into plans
      const plansWithCount = plansData.map((plan) => ({
        ...plan,
        exerciseCount: exerciseCounts[plan.planid] || 0,
      }));

      setPlans(plansWithCount);
      setLoading(false);
    }

    fetchPlansAndCounts();
  }, []);

  const handleOptionsClick = (index, event) => {
    event.stopPropagation();
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleAddNew = () => {
    navigate("/workoutdetail/new");
  };

  const handleEdit = (planId) => {
    setActiveDropdown(null);
    navigate(`/workoutdetail/${planId}/edit`);
  };

  const handleDelete = async (planId) => {
    try {
      setActiveDropdown(null);

      const { error: exError } = await supabase
        .from('WorkoutPlanExercise')
        .delete()
        .eq('planid', planId);

      if (exError) {
        console.error('Error deleting exercises:', exError);
        alert('Failed to delete workout plan exercises.');
        return;
      }

      const { error: planError } = await supabase
        .from('WorkoutPlan')
        .delete()
        .eq('planid', planId);

      if (planError) {
        console.error('Error deleting workout plan:', planError);
        alert('Failed to delete workout plan.');
        return;
      }

      setPlans((prevPlans) => prevPlans.filter(plan => plan.planid !== planId));

      alert('Workout plan deleted successfully.');
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <div>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={styles["workout-plan-header"]}>
        <h1>Workout Plan</h1>
        <button className={styles["add-new-btn"]} onClick={handleAddNew}>
          <i className="bx bx-plus"></i> Add New
        </button>
      </div>
      <div className={styles["workout-cards-container"]}>
        {loading && <p>Loading workout plans...</p>}
        {!loading && plans.length === 0 && <p>No workout plans found.</p>}
        {!loading &&
          plans.map((plan, index) => (
            <div key={plan.planid} className={styles["workout-plan-card"]}>
              <div className={styles["card-header"]}>
                <div className={styles["options-dropdown"]}>
                  <button
                    className={styles["options-btn"]}
                    onClick={(e) => handleOptionsClick(index, e)}
                  >
                    <i className="bx bx-dots-horizontal-rounded"></i>
                  </button>
                  {activeDropdown === index && (
                    <div className={styles["dropdown-menu"]}>
                      <button
                        className={styles["dropdown-item"]}
                        onClick={() => handleEdit(plan.planid)}
                      >
                        <i className="bx bx-edit"></i> Edit
                      </button>
                      <button
                        className={styles["dropdown-item"]}
                        onClick={() => handleDelete(plan.planid)}
                      >
                        <i className="bx bx-trash"></i> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <img
                src={WorkoutPlanImage}
                alt={plan.planname}
                className={styles["workout-plan-image"]}
              />
              <div className={styles["workout-plan-content"]}>
                <h3 className={styles["workout-plan-title"]}>{plan.planname}</h3>
                <p>{plan.description}</p>
                <div className={styles["workout-plan-meta"]}>
                  <DifficultyRating difficulty={plan.difficulty} />
                  <span className={styles["meta-item"]}>
                    <i className="bx bx-list-check"></i>
                    <span>{plan.exerciseCount} Exercises</span>
                  </span>
                </div>
                <button
                  className={styles["workout-plan-action-btn"]}
                  onClick={() => navigate(`/workoutdetail/${plan.planid}`)}
                >
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