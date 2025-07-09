import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Register />} />             {/* ✅ Default: Register */}
        <Route path="/login" element={<Login />} />           {/* ✅ Login */}
        <Route path="/dashboard" element={<UserDashboard />} /> {/* ✅ User area */}
        <Route path="/admin" element={<AdminPanel />} />        {/* ✅ Admin area */}
      </Routes>
  );
}

export default App;
