'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string; // CUSTOMER or ADMIN
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  googleSignIn: (name: string, email: string, googleId: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('dairy_token');
      const storedUser = localStorage.getItem('dairy_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
          // Refresh profile details in background
          const res = await api.get('/auth/profile');
          setUser(res.data.user);
          localStorage.setItem('dairy_user', JSON.stringify(res.data.user));
        } catch (e) {
          console.error('Session expired or invalid token');
          localStorage.removeItem('dairy_token');
          localStorage.removeItem('dairy_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password: pass });
      const { token: jwtToken, user: userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('dairy_token', jwtToken);
      localStorage.setItem('dairy_user', JSON.stringify(userData));
    } catch (e: any) {
      throw new Error(e.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password: pass });
      const { token: jwtToken, user: userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('dairy_token', jwtToken);
      localStorage.setItem('dairy_user', JSON.stringify(userData));
    } catch (e: any) {
      throw new Error(e.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async (name: string, email: string, googleId: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/google', { name, email, googleId });
      const { token: jwtToken, user: userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('dairy_token', jwtToken);
      localStorage.setItem('dairy_user', JSON.stringify(userData));
    } catch (e: any) {
      throw new Error(e.response?.data?.error || 'Google Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('dairy_token');
    localStorage.removeItem('dairy_user');
    localStorage.removeItem('dairy_cart');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        googleSignIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
