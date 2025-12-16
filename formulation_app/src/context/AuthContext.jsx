/**
 * Authentication Context
 * 
 * Provides application-wide authentication state management:
 * - Validates token on app load
 * - Handles login/logout
 * - Listens for auth errors from API client
 * - Stores user information
 * 
 * Usage:
 *   // In App.jsx
 *   import { AuthProvider } from './context/AuthContext';
 *   <AuthProvider><App /></AuthProvider>
 * 
 *   // In components
 *   import { useAuth } from '../context/AuthContext';
 *   const { user, login, logout, isAuthenticated } = useAuth();
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { onAuthError, getErrorMessage } from '../api/client';

// =============================================================================
// CONTEXT CREATION
// =============================================================================

const AuthContext = createContext(null);

// =============================================================================
// AUTH PROVIDER COMPONENT
// =============================================================================

export const AuthProvider = ({ children }) => {
  // State
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start true - checking auth on load
  const [authError, setAuthError] = useState(null);

  // ---------------------------------------------------------------------------
  // LOGOUT FUNCTION
  // ---------------------------------------------------------------------------
  
  const logout = useCallback((reason = null) => {
    console.log('Logging out:', reason || 'User initiated');
    
    // Clear token from storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(reason);
  }, []);

  // ---------------------------------------------------------------------------
  // VALIDATE TOKEN ON LOAD
  // ---------------------------------------------------------------------------
  
  const validateToken = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    // No token - not authenticated
    if (!token) {
      console.log('No token found - user not authenticated');
      setIsLoading(false);
      return;
    }
    
    console.log('Token found - validating with server...');
    
    try {
      // Call backend to validate token and get user info
      const response = await api.get('/auth/me');
      
      if (response.data.user) {
        console.log('Token valid - user authenticated:', response.data.user.email);
        setUser(response.data.user);
        setIsAuthenticated(true);
        setAuthError(null);
      } else {
        // Unexpected response format
        console.warn('Unexpected response from /auth/me');
        logout('Invalid server response');
      }
    } catch (error) {
      console.error('Token validation failed:', getErrorMessage(error));
      logout('Session expired - please login again');
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  // ---------------------------------------------------------------------------
  // LOGIN FUNCTION
  // ---------------------------------------------------------------------------
  
  const login = async (email, password) => {
    setAuthError(null);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user: userData } = response.data;
      
      if (!token || !userData) {
        throw new Error('Invalid response from server');
      }
      
      // Store token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log('Login successful:', userData.email);
      
      return { success: true };
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Login failed:', message);
      setAuthError(message);
      return { success: false, error: message };
    }
  };

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------
  
  // Validate token on mount
  useEffect(() => {
    validateToken();
  }, [validateToken]);
  
  // Listen for auth errors from API client
  useEffect(() => {
    const unsubscribe = onAuthError((event) => {
      console.log('Auth error event received:', event.detail.reason);
      logout(event.detail.reason);
    });
    
    return unsubscribe;
  }, [logout]);

  // ---------------------------------------------------------------------------
  // CONTEXT VALUE
  // ---------------------------------------------------------------------------
  
  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    authError,
    
    // Actions
    login,
    logout,
    validateToken,
    clearError: () => setAuthError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// =============================================================================
// CUSTOM HOOK
// =============================================================================

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// =============================================================================
// EXPORT
// =============================================================================

export default AuthContext;
