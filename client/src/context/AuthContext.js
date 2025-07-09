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
    const stored = sessionStorage.getItem('auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      setAuth(parsed);
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
    }
  }, []);
  
  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      const { user, token } = res.data;
  
      const authData = { user, token };
      setAuth(authData);
  
      sessionStorage.setItem('auth', JSON.stringify(authData)); // ✅ Use sessionStorage
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      throw err;
    }
  };
  
  const logout = () => {
    sessionStorage.removeItem('auth');
    setAuth({ user: null, token: '' });
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
