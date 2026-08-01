import { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

// Context API (Lec 6) de chia se trang thai dang nhap cho toan bo cay component,
// tranh phai truyen prop qua nhieu tang (prop drilling).
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khi F5 trang, React state mat het nhung token van con trong localStorage.
  // Goi /auth/me de lay lai thong tin user -> khoi phuc phien dang nhap.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    axiosClient
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []); // mang rong = chi chay 1 lan khi component mount

  async function login(email, password) {
    const res = await axiosClient.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  }

  async function register(name, email, password) {
    const res = await axiosClient.post('/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook cho gon, thay vi moi noi phai useContext(AuthContext)
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phai duoc dung ben trong AuthProvider');
  return ctx;
}
