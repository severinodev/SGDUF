import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('sgduf_token');
      const savedUser = localStorage.getItem('sgduf_user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          const res = await api.get('/tenants/me').catch(() => null);
          if (res?.data) setTenant(res.data);
        } catch {
          localStorage.removeItem('sgduf_token');
          localStorage.removeItem('sgduf_user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('sgduf_token', token);
    localStorage.setItem('sgduf_user', JSON.stringify(userData));
    setUser(userData);
    
    const tenantRes = await api.get('/tenants/me', { headers: { Authorization: `Bearer ${token}` } }).catch(() => null);
    if (tenantRes?.data) setTenant(tenantRes.data);
    
    return userData;
  };
  
  const registerTenant = async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('sgduf_token');
    localStorage.removeItem('sgduf_user');
    setUser(null);
    setTenant(null);
  };

  return (
    <AuthContext.Provider value={{ user, tenant, setTenant, login, logout, registerTenant, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
