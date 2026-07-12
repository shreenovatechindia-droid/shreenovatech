import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getMe } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('snt_admin_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('snt_admin_token');
    if (!token) { setLoading(false); return; }
    getMe()
      .then(r => { setUser(r.data.data); localStorage.setItem('snt_admin_user', JSON.stringify(r.data.data)); })
      .catch(() => { localStorage.removeItem('snt_admin_token'); localStorage.removeItem('snt_admin_user'); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (email, password) => {
    const r = await apiLogin({ email, password });
    const { token, user: u } = r.data.data;
    localStorage.setItem('snt_admin_token', token);
    localStorage.setItem('snt_admin_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const signOut = async () => {
    try { await apiLogout(); } catch {}
    localStorage.removeItem('snt_admin_token');
    localStorage.removeItem('snt_admin_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
