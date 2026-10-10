import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

const TOKEN_KEY = 'smart_park_token';
const USER_KEY = 'smart_park_user';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [loading, setLoading] = useState(false);

  // Keep localStorage in sync with state
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  /**
   * Login — calls POST /api/auth/login, stores JWT + user
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const cleanEmail = email ? email.trim().toLowerCase() : '';
      const res = await api.login(cleanEmail, password);
      if (res && res.token && res.user) {
        setToken(res.token);
        setCurrentUser(res.user);
        // Persist synchronously so ParkingContext storage listener fires correctly
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        // Signal ParkingContext to reload data for this user
        window.dispatchEvent(new StorageEvent('storage', { key: USER_KEY }));
        return { success: true, user: res.user };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      const message = err.status === 401
        ? 'Invalid email or password. Please verify your credentials or use the quick demo account buttons.'
        : (err.message || 'Login failed. Please try again.');
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register — calls POST /api/auth/register, auto-logs in with JWT
   */
  const register = async (userData) => {
    setLoading(true);
    try {
      const cleanEmail = userData.email ? userData.email.trim().toLowerCase() : '';
      const res = await api.register({
        name: userData.fullName || userData.name || 'Smart Driver',
        email: cleanEmail,
        password: userData.password,
        phone: userData.phone || '',
        vehicleNumber: userData.vehicleNumber ? userData.vehicleNumber.trim().toUpperCase() : '',
        vehicleModel: userData.vehicleModel || 'Standard Vehicle'
      });
      // res = { token, tokenType, user }
      if (res && res.token && res.user) {
        setToken(res.token);
        setCurrentUser(res.user);
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        window.dispatchEvent(new StorageEvent('storage', { key: USER_KEY }));
        return { success: true, user: res.user };
      }
      return { success: false, message: 'Registration failed. Please try again.' };
    } catch (err) {
      const message = err.status === 400
        ? (err.message || 'An account with this email already exists.')
        : (err.message || 'Registration failed. Please try again.');
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout — clears JWT token and user state
   */
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Signal ParkingContext to clear user data
    window.dispatchEvent(new StorageEvent('storage', { key: USER_KEY }));
  };

  /**
   * Update profile — calls PUT /api/users/:email, updates local state
   */
  const updateProfile = async (updatedFields) => {
    if (currentUser?.email) {
      try {
        const updated = await api.updateProfile(currentUser.email, updatedFields);
        setCurrentUser(prev => ({ ...prev, ...updated }));
        return { success: true };
      } catch (err) {
        console.warn('API profile update failed:', err.message);
        // Optimistic update even if API fails
        setCurrentUser(prev => ({ ...prev, ...updatedFields }));
        return { success: false, message: err.message };
      }
    }
    setCurrentUser(prev => ({ ...prev, ...updatedFields }));
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      token,
      isAuthenticated: !!currentUser && !!token,
      isAdmin: currentUser?.role?.toLowerCase() === 'admin',
      loading,
      login,
      register,
      logout,
      updateProfile
    }}>
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
