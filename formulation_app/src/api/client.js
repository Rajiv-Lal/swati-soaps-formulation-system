/**
 * Centralized API Client
 * 
 * This module provides a configured axios instance that:
 * - Automatically adds JWT token to all requests
 * - Handles authentication errors (401/422) globally
 * - Provides consistent error formatting
 * - Supports request/response logging in development
 * 
 * Usage:
 *   import api from '../api/client';
 *   const response = await api.get('/ingredients');
 *   const data = await api.post('/formulations', { name: 'Test' });
 */

import axios from 'axios';

// =============================================================================
// CONFIGURATION
// =============================================================================

// API base URL - empty string means requests go to same origin (nginx proxies to Flask)
const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// =============================================================================
// AUTH EVENT SYSTEM
// =============================================================================

// Custom event for auth failures - AuthContext listens to this
// This decouples the API client from React components
const AUTH_ERROR_EVENT = 'auth:error';

export const onAuthError = (callback) => {
  window.addEventListener(AUTH_ERROR_EVENT, callback);
  return () => window.removeEventListener(AUTH_ERROR_EVENT, callback);
};

const emitAuthError = (reason) => {
  window.dispatchEvent(new CustomEvent(AUTH_ERROR_EVENT, { detail: { reason } }));
};

// =============================================================================
// REQUEST INTERCEPTOR
// =============================================================================

api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// =============================================================================
// RESPONSE INTERCEPTOR
// =============================================================================

api.interceptors.response.use(
  // Success handler - just return the response
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  
  // Error handler - process different error types
  (error) => {
    const { response, config } = error;
    
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${config?.url} - ${response?.status || 'Network Error'}`);
    }
    
    // Handle different error scenarios
    if (response) {
      const { status } = response;
      
      // Authentication errors - token invalid or expired
      if (status === 401 || status === 422) {
        // Don't emit auth error for login attempts
        if (!config.url?.includes('/auth/login')) {
          console.warn('Authentication failed - token may be expired');
          emitAuthError('Token expired or invalid');
        }
      }
      
      // Forbidden - user doesn't have permission
      if (status === 403) {
        console.warn('Access forbidden - insufficient permissions');
      }
      
      // Server error
      if (status >= 500) {
        console.error('Server error occurred');
      }
    } else if (error.request) {
      // Request was made but no response received (network error)
      console.error('Network error - no response received');
    } else {
      // Error in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    // Always reject so calling code can handle specific cases
    return Promise.reject(error);
  }
);

// =============================================================================
// HELPER METHODS
// =============================================================================

/**
 * Extract error message from API error response
 * @param {Error} error - Axios error object
 * @returns {string} Human-readable error message
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message === 'Network Error') {
    return 'Unable to connect to server. Please check your internet connection.';
  }
  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.';
  }
  return error.message || 'An unexpected error occurred';
};

/**
 * Check if error is an authentication error
 * @param {Error} error - Axios error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  const status = error.response?.status;
  return status === 401 || status === 422;
};

/**
 * Check if error is a network error
 * @param {Error} error - Axios error object
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return !error.response && error.request;
};

// =============================================================================
// EXPORT
// =============================================================================

export default api;
