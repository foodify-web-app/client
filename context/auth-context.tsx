'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRes } from '@/types';
import { getUserById } from '@/api/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: UserRes) => void;
  logout: () => void;
  signup: (user: UserRes) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on first mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setLoading(false);   // <-- Important
      return;
    }

    const getUser = async () => {
      try {
        const res = await getUserById(userId);
        
        const resData: User = await {
          id: res.data.data._id,
          name: res.data.data.name,
          email: res.data.data.email,
          role: res.data.data.role,
        };
        
        setUser(resData);

      } finally {
        setLoading(false);  // <-- Important
      }
    };

    getUser();

  }, []);



  const login = async (userData: UserRes) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("userId", userData.userId);

    const res = await getUserById(userData.userId);

    const resData = await {
      id: res.data.data._id,
      name: res.data.data.name,
      email: res.data.data.email,
      role: res.data.data.role,
    };

    setUser(resData);

  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
  };

  const signup = (userData: UserRes) => { };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,  // best way
        login,
        logout,
        signup,
      }}
    >
      {!loading && children}
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
