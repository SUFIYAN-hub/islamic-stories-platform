// frontend/src/context/UserContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/services/api';
import { storage } from '@/lib/utils';
import toast from 'react-hot-toast';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Initialize - check if user is logged in
  useEffect(() => {
    const savedToken = storage.get('user-token');
    const savedUser = storage.get('user-data');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials, remember = false) => {
    try {
      const response = await authAPI.login(credentials);
      const { token: newToken, user: userData } = response.data.data;

      setToken(newToken);
      setUser(userData);

      // Save to localStorage
      storage.set('user-token', newToken);
      storage.set('user-data', userData);

      if (remember) {
        storage.set('remember-me', true);
      }

      toast.success(`Welcome back, ${userData.name}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token: newToken, user: newUser } = response.data.data;

      setToken(newToken);
      setUser(newUser);

      // Save to localStorage
      storage.set('user-token', newToken);
      storage.set('user-data', newUser);

      toast.success(`Welcome, ${newUser.name}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);

    // Clear localStorage
    storage.remove('user-token');
    storage.remove('user-data');
    storage.remove('remember-me');

    toast.success('Logged out successfully');
  };

  // Update user data
  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    storage.set('user-data', updatedUser);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}