/**
 * Login Page
 * 
 * Handles user authentication with:
 * - Email/password form
 * - Loading state during login
 * - Error message display
 * - Redirect after successful login
 * - Display auth errors from session expiry
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle, Beaker } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authError, clearError } = useAuth();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check for redirect error message (e.g., session expired)
  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
      // Clear the state so error doesn't persist on refresh
      window.history.replaceState({}, document.title);
    } else if (authError) {
      setError(authError);
    }
  }, [location.state, authError]);

  // Clear error when user starts typing
  useEffect(() => {
    if (email || password) {
      setError(null);
      clearError();
    }
  }, [email, password, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await login(email.trim(), password);

    setLoading(false);

    if (result.success) {
      // Get redirect URL from location state, or default to formulations
      const from = location.state?.from?.pathname || '/formulations';
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  // Fill with default credentials (for demo)
  const fillDefaults = () => {
    setEmail('admin@swatisoaps.com');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Beaker className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Swati Soaps</h1>
          <p className="text-gray-600 mt-1">Formulation Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                autoComplete="email"
                autoFocus
                className={`
                  w-full px-4 py-3 border rounded-lg transition-colors
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                  ${error ? 'border-red-300' : 'border-gray-300'}
                `}
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                autoComplete="current-password"
                className={`
                  w-full px-4 py-3 border rounded-lg transition-colors
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                  ${error ? 'border-red-300' : 'border-gray-300'}
                `}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3 px-4 rounded-lg font-medium text-white
                transition-all duration-200
                flex items-center justify-center gap-2
                ${loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-[0.98]'
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials Helper */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={fillDefaults}
              disabled={loading}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Use demo credentials: <span className="font-medium">admin@swatisoaps.com / admin123</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © 2025 Swati Soaps. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
