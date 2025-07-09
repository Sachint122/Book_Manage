import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css'

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', // default role
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/auth/register', form);
      alert('Registered successfully. Please log in.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <><div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>

        <input
          type="text"
          placeholder="Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Register</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem', color: '#ccc' }}>
        Already registered?{' '}
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'none',
            border: 'none',
            color: '#00c6ff',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Login here
        </button>
      </p>
    </div>
    </>
  );
};

export default Register;
