import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ts_token'));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('ts_user');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  });

  const login = useCallback((tok: string, usr: User) => {
    localStorage.setItem('ts_token', tok);
    localStorage.setItem('ts_user', JSON.stringify(usr));
    setToken(tok);
    setUser(usr);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ts_token');
    localStorage.removeItem('ts_user');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('ts:session-expired', handler);
    return () => window.removeEventListener('ts:session-expired', handler);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
