import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider }      from './contexts/AuthContext';
import ProtectedRoute        from './components/ProtectedRoute';

import Login                 from './pages/Login';
import Register              from './pages/Register';
import Dashboard             from './pages/Dashboard';
import Account               from './pages/Account';
import Workout               from './pages/Workout';
import History               from './pages/History';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<Login />}    />
          <Route path="/register" element={<Register />} />

          {/* Private routes */}
          <Route path="/"         element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }/>
          <Route path="/account"  element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }/>
          <Route path="/workout"  element={
            <ProtectedRoute>
              <Workout />
            </ProtectedRoute>
          }/>
          <Route path="/history"  element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}