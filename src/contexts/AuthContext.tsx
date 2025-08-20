'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      const userData = await apiClient.getCurrentUser();      
      console.log('Auth status check result:', userData);
      setUser(userData.user);
    } catch (error) {
      console.log('Auth status check error:', error);
      setUser(null); // Ensure user is null on error
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Use email as username for backend compatibility
      const data = await apiClient.login(email, password);
      
      // Set the auth token for future requests
      if (data.token) {
        apiClient.setAuthToken(data.token);
      }
      
      // Set user data
      setUser(data.user);
      
      // Ensure loading is set to false after successful login
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
      apiClient.clearAuthToken();
      setUser(null);
      setLoading(false);
    } catch (error) {
      console.error('Logout error:', error);
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 