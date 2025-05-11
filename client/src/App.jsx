import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import Register from './pages/Register';
import Login from './pages/Login';
import Workout from './pages/Workout';
import History from './pages/History';

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/account" element={<Account />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/workout" element={<Workout />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
}

export default App;