import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({
    user: null,
    token: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      setAuth(parsed);
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password });
    const { user, token } = res.data;
    const authData = { user, token };

    setAuth(authData);
    localStorage.setItem('auth', JSON.stringify(authData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/user/dashboard');
    }
  };

  const logout = () => {
    setAuth({ user: null, token: '' });
    localStorage.removeItem('auth');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
