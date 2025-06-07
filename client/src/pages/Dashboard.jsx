// Dashboard.jsx
import React, { useEffect, useState } from "react";
import styles from "../assets/css/dashboard.module.css";
import "boxicons/css/boxicons.min.css";
import Sidebar from "../components/Sidebar";
import { supabase } from "../services/supabase";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// ─── Register Chart.js components ────────────────────────────────────────────
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(true);

  const [weeklyStreakData, setWeeklyStreakData] = useState([]);
  const [streakCount, setStreakCount] = useState(0);

  // ─── Weekly Report State ────────────────────────────────────────────────────
  const [weeklyWorkoutsCount, setWeeklyWorkoutsCount] = useState(0);
  const [weeklyCalories, setWeeklyCalories] = useState(0);
  const [weeklyDurationSeconds, setWeeklyDurationSeconds] = useState(0);

  // ─── Weight/BMI Overall State ────────────────────────────────────────────────
  const [currentWeight, setCurrentWeight] = useState(null);
  const [heaviestWeight, setHeaviestWeight] = useState(null);
  const [lightestWeight, setLightestWeight] = useState(null);
  const [heightCm, setHeightCm] = useState(null);

  // ─── Historical Arrays for Weight Chart ──────────────────────────────────────
  const [weightHistory, setWeightHistory] = useState([]);

  // ─── Current BMI + Status ───────────────────────────────────────────────────
  const [bmiValue, setBmiValue] = useState(null);
  const [bmiStatus, setBmiStatus] = useState("");

  useEffect(() => {
    document.title = "Dashboard - Fitrack";
  }, []);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768 && !isOpen) {
        setIsOpen(true);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen]);

  // ─── Fetch Weekly + All‐Time Logs ────────────────────────────────────────────
  useEffect(() => {
    async function fetchDashboardData() {
      // 1) Who's logged in?
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("No logged-in user:", authError);
        return;
      }
      const userId = user.id;

      // 2) Get the user's height & (latest) weight from "User" table
      const { data: userProfile, error: profileError } = await supabase
        .from("User")
        .select("weight, height")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error loading user profile:", profileError);
      } else if (userProfile) {
        setCurrentWeight(userProfile.weight);
        setHeightCm(userProfile.height);
      }

      // 3) Compute one‐week‐ago timestamp
      const oneWeekAgo = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).toISOString();

      // 4) Fetch all WorkoutLog rows from the last 7 days
      const { data: thisWeekLogs, error: weeklyError } = await supabase
        .from("WorkoutLog")
        .select("calories_burned, duration_seconds, currentweight, date")
        .eq("userid", userId)
        .gte("date", oneWeekAgo);

      if (weeklyError) {
        console.error("Error fetching weekly logs:", weeklyError);
      } else if (thisWeekLogs) {
        setWeeklyWorkoutsCount(thisWeekLogs.length);

        const buildWeeklyStreak = () => {
          // 1) Compute Monday…Sunday of this week in local time
          const today = new Date();
          today.setHours(0,0,0,0);

          const dow       = today.getDay();              // 0=Sun,1=Mon…6=Sat
          const mondayOff = dow === 0 ? -6 : 1 - dow;
          const monday    = new Date(today);
          monday.setDate(today.getDate() + mondayOff);

          // 2) Make a helper to turn any Date into "YYYY-MM-DD"
          const toKey = d => {
            const Y = d.getFullYear();
            const M = String(d.getMonth()+1).padStart(2,'0');
            const D = String(d.getDate()).padStart(2,'0');
            return `${Y}-${M}-${D}`;
          };

          // 3) Build a Set of the days you actually have logs for
          const loggedDates = new Set(
            thisWeekLogs.map(l => {
              const dt = new Date(l.date);
              dt.setHours(0,0,0,0);
              return toKey(dt);
            })
          );

          const todayKey = toKey(today);

          // 4) Build your 7-day array
          const weekArray = [];
          let currentIdx = -1;

          for (let i = 0; i < 7; i++) {
            const d   = new Date(monday);
            d.setDate(monday.getDate() + i);
            d.setHours(0,0,0,0);

            const key  = toKey(d);
            const lbl  = d.toLocaleDateString('default',{ weekday:'short' });
            let   status = 'future';

            if (key === todayKey) {
              // today: completed if you have any log
              status = loggedDates.has(key) ? 'completed' : 'current';
              currentIdx = i;
            } else if (loggedDates.has(key)) {
              // any other logged day
              status = 'completed';
            }

            weekArray.push({ date:d, dayLabel:lbl, status, dateKey:key });
          }

          // 5) Compute your consecutive‐day streak
          let streak = 0;
          if (weekArray[currentIdx]?.status === 'completed') streak++;
          for (let j = currentIdx - 1; j >= 0; j--) {
            if (weekArray[j].status === 'completed') streak++;
            else break;
          }

          setWeeklyStreakData(weekArray);
          setStreakCount(streak);
        };

        buildWeeklyStreak();

        const totalCals = thisWeekLogs.reduce(
          (sum, row) => sum + parseFloat(row.calories_burned || 0),
          0
        );
        setWeeklyCalories(totalCals.toFixed(1));

        const totalSecs = thisWeekLogs.reduce(
          (sum, row) => sum + parseInt(row.duration_seconds || 0, 10),
          0
        );
        setWeeklyDurationSeconds(totalSecs);
      }

      // 5) Fetch ALL WorkoutLog rows (to build weight history)
      const { data: allLogs, error: allLogsError } = await supabase
        .from("WorkoutLog")
        .select("currentweight, date")
        .eq("userid", userId)
        .order("date", { ascending: true });

      if (allLogsError) {
        console.error(
          "Error fetching all logs for weight history:",
          allLogsError
        );
      } else if (allLogs && allLogs.length > 0) {
        // Build an array of { date, weight } from each row (filter NaN)
        const parsedHistory = allLogs
          .map((row) => {
            const w = parseFloat(row.currentweight || 0);
            return isNaN(w) ? null : { date: row.date, weight: w };
          })
          .filter((entry) => entry !== null);

        if (parsedHistory.length) {
          setWeightHistory(parsedHistory);

          const weightsOnly = parsedHistory.map((e) => e.weight);
          setHeaviestWeight(Math.max(...weightsOnly));
          setLightestWeight(Math.min(...weightsOnly));

          // If User table’s weight was null, fallback to last log’s weight
          if (userProfile.weight == null) {
            setCurrentWeight(parsedHistory[parsedHistory.length - 1].weight);
          }
        }
      }
    }

    fetchDashboardData();
  }, [heightCm]);

  // ─── Compute Current BMI & Label ──────────────────────────────────────────────
  useEffect(() => {
    if (currentWeight != null && heightCm != null) {
      const heightMeters = heightCm / 100;
      const bmi = currentWeight / (heightMeters * heightMeters);
      const rounded = parseFloat(bmi.toFixed(1));
      setBmiValue(rounded);

      let statusLabel = "";
      if (rounded < 18.5) statusLabel = "Underweight";
      else if (rounded < 24.9) statusLabel = "Normal";
      else if (rounded < 29.9) statusLabel = "Overweight";
      else if (rounded < 34.9) statusLabel = "Obese";
      else statusLabel = "Extreme";
      setBmiStatus(statusLabel);
    }
  }, [currentWeight, heightCm]);

  // ─── Helper: Format seconds → "MM:SS" ─────────────────────────────────────────
  const formatDuration = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // ─── Weight Chart Data/Options (unchanged) ───────────────────────────────────
  const weightChartData = {
    labels: weightHistory.map((p) => new Date(p.date).toLocaleDateString()),
    datasets: [
      {
        label: "Weight (kg)",
        data: weightHistory.map((p) => p.weight),
        fill: false,
        tension: 0.2,
        borderColor: "#03A9F4",
        backgroundColor: "#03A9F4",
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };
  const weightChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
    scales: {
      x: {
        title: { display: true, text: "Date" },
      },
      y: {
        title: { display: true, text: "KG" },
        beginAtZero: false,
      },
    },
  };

  return (
    <div className={styles["dashboard-wrapper"]}>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <section className={styles.home}>
        <div className={styles["top-row"]}>
          {/* ==================== Weekly Report ==================== */}
          <div className={`${styles.section} ${styles["reports-section"]}`}>
            <h2 className={styles["section-title"]}>Weekly Report</h2>
            <div className={styles.reports}>
              <div className={styles["report-card"]}>
                <i className={`bx bx-dumbbell icon ${styles["report-icon"]}`} />
                <h3>{weeklyWorkoutsCount}</h3>
                <p>WORKOUTS</p>
              </div>

              <div className={styles["report-card"]}>
                <i className={`bx bxs-flame ${styles["report-icon"]}`} />
                <h3>{weeklyCalories}</h3>
                <p>KCAL</p>
              </div>

              <div className={styles["report-card"]}>
                <i className={`bx bx-time icon ${styles["report-icon"]}`} />
                <h3>{formatDuration(weeklyDurationSeconds)}</h3>
                <p>DURATION</p>
              </div>
            </div>
          </div>

          {/* ==================== Weight & Weight Chart ==================== */}
          <div className={`${styles.section} ${styles["weight-section"]}`}>
            <div className={styles["section-header"]}>
              <h2 className={styles["section-title"]}>Weight (kg)</h2>
            </div>

            {/* Stats Row */}
            <div className={styles["stats-row"]}>
              <div className={styles["stat-item"]}>
                <h4>{currentWeight != null ? currentWeight : "—"}</h4>
                <p>Current</p>
              </div>
              <div className={styles["stat-item"]}>
                <h4>{heaviestWeight != null ? heaviestWeight : "—"}</h4>
                <p>Heaviest</p>
              </div>
              <div className={styles["stat-item"]}>
                <h4>{lightestWeight != null ? lightestWeight : "—"}</h4>
                <p>Lightest</p>
              </div>
            </div>

            {/* Weight Chart */}
            <div
              className={styles["chart-container"]}
              style={{ marginTop: "1rem" }}
            >
              {weightHistory.length > 0 ? (
                <Line data={weightChartData} options={weightChartOptions} />
              ) : (
                <p style={{ textAlign: "center", color: "#666" }}>
                  No weight history yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className={styles["bottom-row"]}>
          {/* ========== BMI (Current) — Gauge/Scale ========== */}
          <div className={`${styles.section} ${styles["bmi-section"]}`}>
            <div className={styles["section-header"]}>
              <h2 className={styles["section-title"]}>BMI (kg/m²)</h2>
            </div>

            {/* ─── New: Show Current Weight & Height Above BMI Score ───────────────── */}
            <div className={styles["bmi-header"]}>
              <p>
                <strong>Weight:</strong>{" "}
                {currentWeight != null ? `${currentWeight} kg` : "—"}
              </p>
              <p>
                <strong>Height:</strong>{" "}
                {heightCm != null ? `${heightCm} cm` : "—"}
              </p>
            </div>

            {/* Current BMI + Status */}
            <div
              className={styles["bmi-value"]}
              style={{ marginBottom: "0.75rem" }}
            >
              <h2>{bmiValue != null ? bmiValue : "—"}</h2>
              <p className={styles["bmi-status"]}>{bmiStatus || "—"}</p>
            </div>

            {/* ─── BMI Category Scale ──────────────────────────────────────────────── */}
            <div className={styles["bmi-scale-container"]}>
              {/* ─── Colored Bar ────────────────────────────────────────────────────────── */}
              <div className={styles["bmi-scale"]}>
                {/* Underweight: 0–18.5 */}
                <div
                  className={styles["bmi-segment"]}
                  data-tooltip="Underweight (< 18.5)"
                  title="Underweight (< 18.5)"
                  style={{
                    width: `${(18.5 / 40) * 100}%`,
                    backgroundColor: "#3b82f6",
                  }}
                />

                {/* Normal: 18.5–24.9 */}
                <div
                  className={styles["bmi-segment"]}
                  data-tooltip="Normal (18.5 – 24.9)"
                  title="Normal (18.5 – 24.9)"
                  style={{
                    width: `${((24.9 - 18.5) / 40) * 100}%`,
                    backgroundColor: "#22c55e",
                  }}
                />

                {/* Overweight: 25–29.9 */}
                <div
                  className={styles["bmi-segment"]}
                  data-tooltip="Overweight (25 – 29.9)"
                  title="Overweight (25 – 29.9)"
                  style={{
                    width: `${((29.9 - 25) / 40) * 100}%`,
                    backgroundColor: "#eab308",
                  }}
                />

                {/* Obese: 30–34.9 */}
                <div
                  className={styles["bmi-segment"]}
                  data-tooltip="Obese (30 – 34.9)"
                  title="Obese (30 – 34.9)"
                  style={{
                    width: `${((34.9 - 30) / 40) * 100}%`,
                    backgroundColor: "#f87171",
                  }}
                />

                {/* Extreme: 35–40 (anything >40 clamps to 40) */}
                <div
                  className={styles["bmi-segment"]}
                  data-tooltip="Extreme (> 35)"
                  title="Extreme (> 35)"
                  style={{
                    width: `${((40 - 35) / 40) * 100}%`,
                    backgroundColor: "#b91c1c",
                  }}
                />

                {/* ─── Marker (needle) for "current BMI" ─────────────────────────────── */}
                {bmiValue != null && (
                  <div
                    className={styles["bmi-marker"]}
                    style={{
                      left: `${(Math.min(bmiValue, 40) / 40) * 100}%`,
                    }}
                  />
                )}
              </div>

              {/* ─── Category Labels, each with same width as its segment ────────────── */}
              <div className={styles["bmi-labels"]}>
                <div
                  className={styles["bmi-label"]}
                  style={{ width: `${(18.5 / 40) * 100}%` }}
                >
                  Underweight
                </div>
                <div
                  className={styles["bmi-label"]}
                  style={{ width: `${((24.9 - 18.5) / 40) * 100}%` }}
                >
                  Normal
                </div>
                <div
                  className={styles["bmi-label"]}
                  style={{ width: `${((29.9 - 25) / 40) * 100}%` }}
                >
                  Overweight
                </div>
                <div
                  className={styles["bmi-label"]}
                  style={{ width: `${((34.9 - 30) / 40) * 100}%` }}
                >
                  Obese
                </div>
                <div
                  className={styles["bmi-label"]}
                  style={{ width: `${((40 - 35) / 40) * 100}%` }}
                >
                  Extreme
                </div>
              </div>
            </div>
          </div>

          {/* ==================== Streak Tracker ==================== */}
          <div className={`${styles.section} ${styles["streak-section"]}`}>
            <div className={styles["section-header"]}>
              <h2 className={styles["section-title"]}>Streak Tracker</h2>
              <a href="/history" className={styles["all-records-link"]}>
                All records <i className="bx bx-chevron-right"></i>
              </a>
            </div>

            {/* Weekly view */}
            <div className={styles["weekly-streak-calendar"]}>
              {weeklyStreakData.map((day, idx) => (
                <div className={styles["week-column"]} key={idx}>
                  <div className={styles["week-label"]}>{day.dayLabel}</div>

                  {day.status === "completed" ? (
                    <div className={`${styles["week-circle"]} ${styles["completed"]}`}>
                      <i className="bx bx-check"></i>
                    </div>
                  ) : day.status === "current" ? (
                    <div className={`${styles["week-circle"]} ${styles["current"]}`}>
                      {day.date.getDate()}
                    </div>
                  ) : (
                    <div className={styles["week-number"]}>
                      {day.date.getDate()}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Dynamic streak count */}
            <div className={styles["streak-stats"]}>
              <div className={styles["streak-badge"]}>
                <i className="bx bxs-medal"></i>
              </div>
              <div className={styles["streak-info"]}>
                <h3 className={styles["streak-current"]}>
                  {streakCount}-week streak
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}