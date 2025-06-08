import { Routes, Route } from 'react-router-dom';
import HomeRedirect from '../components/HomeRedirect';

import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgetPassword from '../pages/ForgetPassword';
import History from '../pages/History';
import Account from '../pages/Account';
import Workout from '../pages/Workout';
import WorkoutDetail from '../pages/WorkoutDetail';
import WorkoutPlan from '../pages/WorkoutPlan';
import Landing from '../pages/Landing';
import ErrorPage from '../pages/ErrorPage';

import ProtectedRoute from '../components/ProtectedRoute';
import UpdatePassword from '../pages/UpdatePassword';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/landing" element={<Landing />} />

      {/* Protected Routes */}
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
      <Route path="/workoutplan" element={<ProtectedRoute><WorkoutPlan /></ProtectedRoute>} />

      {/* Detail / edit / new */}
      <Route path="/workoutdetail/new" element={<ProtectedRoute><WorkoutDetail /></ProtectedRoute>} />
      <Route path="/workoutdetail/:planid" element={<ProtectedRoute><WorkoutDetail /></ProtectedRoute>} />
      <Route path="/workoutdetail/:planid/edit" element={<ProtectedRoute><WorkoutDetail /></ProtectedRoute>} />

      {/* Session page */}
      <Route path="/workout/:planid" element={<ProtectedRoute><Workout /></ProtectedRoute>} />

      {/* Catch-all route */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}