import {  Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminPanel from './pages/AdminPanel';
import AddBook from './pages/AddBook';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Register />} />             {/* ✅ Default: Register */}
        <Route path="/login" element={<Login />} />           {/* ✅ Login */}
        <Route path="/dashboard" element={<UserDashboard />} /> {/* ✅ User area */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/add-book" element={<AddBook />} />        {/* ✅ Admin area */}
      </Routes>
  );
}

export default App;
