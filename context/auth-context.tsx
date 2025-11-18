'use client';

import React, { createContext, useContext, useState } from 'react';
import { User, UserRes } from '@/types';
interface AuthContextType {
  user: UserRes | null;
  isAuthenticated: boolean;
  login: (user: UserRes) => void;
  logout: () => void;
  signup: (user: UserRes) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserRes | null>(null);
  // const getLocalData = () => {
  //   const token: string | null = localStorage.getItem('token');
  //   const userId: string | null = localStorage.getItem('userId');
  //   return { token, userId };
  // }
  let token;
  let userId;
  if (typeof window !== "undefined") {
    token = localStorage.getItem('token');
    userId = localStorage.getItem('userId');
  }
  const login = (userData: UserRes) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userId', userData.userId);
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  const signup = (userData: UserRes) => {
    setUser(userData);
    // localStorage.setItem('t', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: token != null && userId != null, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
