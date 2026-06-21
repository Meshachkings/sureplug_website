import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../lib/api';

interface AuthState {
  token: string | null;
  user: User | null;
}

interface AuthContextValue extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadState(): AuthState {
  try {
    return {
      token: localStorage.getItem('sp_token'),
      user: JSON.parse(localStorage.getItem('sp_user') ?? 'null'),
    };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadState);

  const login = (token: string, user: User) => {
    localStorage.setItem('sp_token', token);
    localStorage.setItem('sp_user', JSON.stringify(user));
    setState({ token, user });
  };

  const logout = () => {
    localStorage.removeItem('sp_token');
    localStorage.removeItem('sp_user');
    setState({ token: null, user: null });
  };

  const updateUser = (patch: Partial<User>) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const updated = { ...prev.user, ...patch };
      localStorage.setItem('sp_user', JSON.stringify(updated));
      return { ...prev, user: updated };
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
