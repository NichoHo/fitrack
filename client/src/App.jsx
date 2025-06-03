import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgetPassword from './pages/ForgetPassword'; // Import ForgetPassword
import UpdatePassword from './pages/UpdatePassword'; // Import UpdatePassword
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import Workout from './pages/Workout';
import History from './pages/History';
import WorkoutPlan from './pages/WorkoutPlan';
import WorkoutDetail from './pages/WorkoutDetail';


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} /> {/* Add UpdatePassword route */}

          <Route
            path="/"
            element={<Dashboard />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workoutplan"
            element={
              <ProtectedRoute>
                <WorkoutPlan />
              </ProtectedRoute>
            }
          />

          {/* Detail / edit / new */}
          <Route
            path="/workoutdetail/new"
            element={
              <ProtectedRoute>
                <WorkoutDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workoutdetail/:planid"
            element={
              <ProtectedRoute>
                <WorkoutDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workoutdetail/:planid/edit"
            element={
              <ProtectedRoute>
                <WorkoutDetail />
              </ProtectedRoute>
            }
          />

          {/* Session page */}
          <Route
            path="/workout/:planid"
            element={
              <ProtectedRoute>
                <Workout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}