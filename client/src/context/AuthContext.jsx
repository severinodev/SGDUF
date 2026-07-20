import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('farmasys_token');
      const savedUser = localStorage.getItem('farmasys_user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          const res = await api.get('/tenants/me').catch(() => null);
          if (res?.data) setTenant(res.data);
        } catch {
          localStorage.removeItem('farmasys_token');
          localStorage.removeItem('farmasys_user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('farmasys_token', token);
    localStorage.setItem('farmasys_user', JSON.stringify(userData));
    setUser(userData);
    
    const tenantRes = await api.get('/tenants/me', { headers: { Authorization: `Bearer ${token}` } }).catch(() => null);
    if (tenantRes?.data) setTenant(tenantRes.data);
    
    return userData;
  };
  
  const registerTenant = async (data) => {
    const res = await api.post('/auth/register-tenant', data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('farmasys_token');
    localStorage.removeItem('farmasys_user');
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
