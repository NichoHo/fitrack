// ─── WorkoutDetail.jsx ──────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "../assets/css/workoutdetail.module.css";
import "boxicons/css/boxicons.min.css";
import Sidebar from "../components/Sidebar";
import DifficultyRating from "../components/DifficultyRating";
import { supabase } from "../services/supabase";

export default function WorkoutDetail() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // If the URL ends with "/new", or the route param is literally "new", treat as "new".
  // Otherwise, take planid from params.
  const rawPlanId = params.planid; // could be undefined for "/workoutdetail/new"
  const isNew =
    rawPlanId === "new" || location.pathname.endsWith("/new");
  // In “new” mode, we'll never fetch from the DB; only insert later.
  const planid = isNew ? null : rawPlanId; 

  // Edit mode is when there's a numeric/string planid (not null) and URL ends with "/edit"
  const isEdit = Boolean(!isNew && location.pathname.endsWith("/edit"));
  // View mode is when there's a numeric/string planid and NOT in edit
  const isView = Boolean(!isNew && !isEdit);

  const [hasChanges, setHasChanges] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const [planName, setPlanName] = useState("");
  const [planGoal, setPlanGoal] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [planDifficulty, setPlanDifficulty] = useState(1);
  const [planExercises, setPlanExercises] = useState([]);
  const [log, setLog] = useState(null);

  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [allExercises, setAllExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const markDirty = useCallback(() => {
    if (!hasChanges) setHasChanges(true);
  }, [hasChanges]);

  // Warn before unload if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  // ─── Load plan / exercises / log ────────────────────────────────────────────────
  useEffect(() => {
    document.title = 'Workout Detail - Fitrack';
    async function load() {
      setLoading(true);

      // 1) Get the logged‐in user
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();
      if (authErr || !user) return navigate("/login");
      setUserId(user.id);

      // 2) Only fetch an existing plan if planid is non-null (i.e. not "new")
      if (!isNew && planid) {
        // fetch plan
        const { data: planData, error: planErr } = await supabase
          .from("WorkoutPlan")
          .select("*")
          .eq("planid", planid)
          .eq("userid", user.id)
          .single();
        if (planErr) {
          // if plan does not exist or some error → go back
         return navigate("/workoutplan");
       }
        setPlanName(planData.planname);
        setPlanGoal(planData.goal);
        setPlanDescription(planData.description);
        setPlanDifficulty(planData.difficulty);

        // fetch exercises for that plan
        const { data: exRows, error: exErr } = await supabase
          .from("WorkoutPlanExercise")
          .select(`
           planid,
            exerciseid,
            exercise_order,
            Exercise (
              exerciseid,
              name,
              description,
              sets,
              reps,
              duration,
              difficulty,
              animationurl
            )
          `)
          .eq("planid", planid)
          .order("exercise_order", { ascending: true });
        if (exErr) console.error("Error fetching plan exercises:", exErr);
        setPlanExercises(exRows || []);
      }

      setLoading(false);
    }
    load();
  }, [planid, isNew, isView, navigate]);

  // computed values
  const totalExercises = planExercises.length;
  const doneCount = log?.exercisedone ?? 0;
  const inProgress = log && doneCount > 0 && doneCount < totalExercises;
  const totalDurationMin = Math.round(
    planExercises.reduce((sum, pe) => sum + (pe.Exercise.duration || 0), 0) / 60
  );

  // navigation handlers
  const handleBack = () => {
    if (hasChanges && !window.confirm("You have unsaved changes. Discard?")) return;
    navigate("/workoutplan");
  };
  const handleStart = () => navigate(`/workout/${planid}?restart=true`);

  // add / delete exercise in editor
  const openAddModal = async () => {
    markDirty();
    setShowExerciseModal(true);
    if (!allExercises.length) {
      const { data, error } = await supabase
        .from("Exercise")
        .select("*")
        .order("name", { ascending: true });
      if (!error) setAllExercises(data);
    }
  };
  const addExercise = (ex) => {
    markDirty();
    setPlanExercises([
      ...planExercises,
      {
        planid: isNew ? null : Number(planid),
        exerciseid: ex.exerciseid,
        exercise_order: planExercises.length + 1,
        Exercise: ex,
      },
    ]);
    setShowExerciseModal(false);
  };
  const deleteExercise = (idx) => {
    markDirty();
    const filtered = planExercises
      .filter((_, i) => i !== idx)
      .map((pe, i) => ({
        ...pe,
        exercise_order: i + 1,
      }));
    setPlanExercises(filtered);
  };

  // modal search
  const filteredExercises = allExercises.filter(
    (ex) =>
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ex.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ─── SAVING LOGIC ───────────────────────────────────────────────────────────────
  async function handleSave() {
    setLoading(true);
    try {
      // 1) compute new difficulty = floor(average of all exercise difficulties)
      const avg =
        planExercises.reduce((sum, pe) => sum + pe.Exercise.difficulty, 0) /
        (planExercises.length || 1);
      const newDiff = Math.floor(avg) || 1;

      let savedPlanId;
      if (isNew) {
        // INSERT new plan
        const { data, error } = await supabase
          .from("WorkoutPlan")
          .insert([
            {
              planname: planName,
              description: planDescription,
              goal: planGoal,
              difficulty: newDiff,
              userid: userId,
            },
          ])
          .select("planid")
          .single();
        if (error) throw error;
        savedPlanId = data.planid;
      } else {
        // UPDATE existing
        const { error } = await supabase
          .from("WorkoutPlan")
          .update({
            planname: planName,
            description: planDescription,
            goal: planGoal,
            difficulty: newDiff,
          })
          .eq("planid", planid);
        if (error) throw error;
        savedPlanId = Number(planid);
      }

      // 2) delete old exercises (for edit)
      if (!isNew) {
        const { error } = await supabase
          .from("WorkoutPlanExercise")
          .delete()
          .eq("planid", savedPlanId);
        if (error) throw error;
      }

      // 3) insert new planExercises
      const rows = planExercises.map((pe) => ({
        planid: savedPlanId,
        exerciseid: pe.exerciseid,
        exercise_order: pe.exercise_order,
      }));
      const { error: exError } = await supabase
        .from("WorkoutPlanExercise")
        .insert(rows);
      if (exError) throw exError;

      setHasChanges(false);
      navigate("/workoutplan");
    } catch (err) {
      console.error("Error saving plan:", err.message);
      alert("Failed to save workout plan: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className={styles["workout-detail-container"]}>
          <p>Loading workout details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={isOpen ? styles.appContainer : styles.appContainerClosed}>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className={styles["workout-detail-container"]}>
        <div className={styles["workout-detail-header"]}>
          <button className={styles["back-button"]} onClick={handleBack}>
            <i className="bx bx-arrow-back"></i>
          </button>

          <div className={styles["header-right"]}>
            {isView ? (
              <>
                <div className={styles["workout-day"]}>{planName}</div>
                <div className={styles["difficulty-level"]}>
                  <DifficultyRating difficulty={planDifficulty} />
                </div>
                <div className={styles["plan-details"]}>
                  <div className={styles["plan-goal"]}>{planGoal}</div>
                  <div className={styles["plan-description"]}>
                    {planDescription}
                  </div>
                </div>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={planName}
                  onChange={(e) => {
                    setPlanName(e.target.value);
                    markDirty();
                  }}
                  placeholder="Plan Name"
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    marginBottom: "1rem",
                  }}
                />
                <select
                  value={planGoal}
                  onChange={(e) => {
                    setPlanGoal(e.target.value);
                    markDirty();
                  }}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginBottom: "1rem",
                    fontSize: "1rem",
                  }}
                >
                  <option value="" disabled>
                    Select Goal
                  </option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Cardiovascular Health">Cardiovascular Health</option>
                </select>
                <textarea
                  value={planDescription}
                  onChange={(e) => {
                    setPlanDescription(e.target.value);
                    markDirty();
                  }}
                  placeholder="Description"
                  rows={3}
                  style={{
                    width: "100%",
                    marginBottom: "1rem",
                    padding: "0.5rem",
                    fontSize: "1rem",
                  }}
                />
              </>
            )}
          </div>
        </div>

        <div className={styles["exercise-section"]}>
          {!isView && (
            <h3 className={styles["exercise-section-title"]}>
              {isNew ? "Add Exercises" : "Edit Exercises"}
            </h3>
          )}
          <div className={styles["exercise-list"]}>
            {planExercises.map((pe, idx) => {
              const ex = pe.Exercise;
              return (
                <div
                  key={`${pe.exerciseid}-${idx}`}
                  className={styles["exercise-item"]}
                >
                  <video
                    src={ex.animationurl}
                    className={styles["exercise-video"]}
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                  <div className={styles["exercise-info"]}>
                    <div className={styles["exercise-name"]}>{ex.name}</div>
                    {isView ? (
                      <div className={styles["exercise-duration"]}>
                        {ex.reps != null
                          ? `${ex.sets} sets × ${ex.reps} reps`
                          : `${ex.sets} sets × ${ex.duration}s`}
                      </div>
                    ) : (
                      // In edit mode, we do not allow changing sets/reps/duration
                      <div className={styles["exercise-duration"]}>
                        {ex.reps != null
                          ? `${ex.sets} sets × ${ex.reps} reps`
                          : `${ex.sets} sets × ${ex.duration}s`}
                      </div>
                    )}
                  </div>

                  {!isView && (
                    <button
                      className={styles["delete-ex-btn"]}
                      onClick={() => deleteExercise(idx)}
                    >
                      <i className="bx bx-trash"></i>
                    </button>
                  )}
                </div>
              );
            })}

            {!isView && (
              <button
                className={styles["add-ex-btn"]}
                onClick={openAddModal}
              >
                <i className="bx bx-plus"></i> Add Exercise
              </button>
            )}
          </div>
        </div>

        {showExerciseModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Add Exercise</h3>
                <p className={styles.modalSubtitle}>
                  Choose an exercise to add to your workout plan
                </p>
                <button
                  className={styles.modalClose}
                  onClick={() => {
                    setShowExerciseModal(false);
                    setSearchTerm("");
                  }}
                >
                  <i className="bx bx-x"></i>
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.searchContainer}>
                  <i className={`bx bx-search ${styles.searchIcon}`}></i>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {filteredExercises.length === 0 ? (
                  <div className={styles.noResults}>
                    <i className="bx bx-search-alt"></i>
                    <p>No exercises found matching your search.</p>
                  </div>
                ) : (
                  <ul className={styles.exerciseSelectList}>
                    {filteredExercises.map((ex) => (
                      <li
                        key={ex.exerciseid}
                        className={styles.exerciseSelectItem}
                        onClick={() => {
                          addExercise(ex);
                          setSearchTerm("");
                        }}
                      >
                        <video
                          src={ex.animationurl}
                          className={styles["exercise-video"]}
                          muted
                          loop
                          autoPlay
                          playsInline
                        />
                        <div className={styles.exerciseSelectInfo}>
                          <span className={styles.exerciseName}>{ex.name}</span>
                          {ex.description && (
                            <p className={styles.exerciseDescription}>
                              {ex.description}
                            </p>
                          )}
                          <div className={styles.exerciseMeta}>
                            <div
                              className={styles.exerciseMetaItem}
                            >
                              <i
                                className={`bx bx-repeat ${styles.exerciseMetaIcon}`}
                              ></i>
                              <span>{ex.sets} sets</span>
                            </div>
                            {ex.reps != null ? (
                              <div
                                className={styles.exerciseMetaItem}
                              >
                                <i
                                  className={`bx bx-target-lock ${styles.exerciseMetaIcon}`}
                                ></i>
                                <span>{ex.reps} reps</span>
                              </div>
                            ) : (
                              <div
                                className={styles.exerciseMetaItem}
                              >
                                <i
                                  className={`bx bx-time ${styles.exerciseMetaIcon}`}
                                ></i>
                                <span>{ex.duration}s</span>
                              </div>
                            )}
                            <div className={styles.exerciseMetaItem}>
                              <i className={`bx bxs-flame ${styles.exerciseMetaIcon}`}></i>
                              <span>{ex.difficulty}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        <div className={styles["action-buttons"]}>
          {isNew || isEdit ? (
            <button className={styles["submit-btn"]} onClick={handleSave}>
              Save Workout
            </button>
          ) : (
            <button
              className={styles["submit-btn"]}
              onClick={handleStart}
            >
              Start Workout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}