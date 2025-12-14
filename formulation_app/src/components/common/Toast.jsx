/**
 * Toast Notification System
 * 
 * Provides application-wide toast notifications:
 * - Success, error, warning, info types
 * - Auto-dismiss with configurable duration
 * - Stack multiple toasts
 * - Accessible design
 * 
 * Usage:
 *   // In App.jsx
 *   import { ToastProvider } from './components/common/Toast';
 *   <ToastProvider><App /></ToastProvider>
 * 
 *   // In components
 *   import { useToast } from '../components/common/Toast';
 *   const { showToast, showError, showSuccess } = useToast();
 *   showSuccess('Item saved!');
 *   showError('Failed to load data');
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// =============================================================================
// CONTEXT
// =============================================================================

const ToastContext = createContext(null);

// =============================================================================
// TOAST CONFIGURATION
// =============================================================================

const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    textColor: 'text-green-800',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    textColor: 'text-red-800',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-800',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-800',
  },
};

const DEFAULT_DURATION = 5000; // 5 seconds

// =============================================================================
// SINGLE TOAST COMPONENT
// =============================================================================

const Toast = ({ id, type, message, onDismiss }) => {
  const config = TOAST_TYPES[type] || TOAST_TYPES.info;
  const Icon = config.icon;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg
        ${config.bgColor} ${config.borderColor}
        animate-slide-in-right
        max-w-md w-full
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      
      <div className={`flex-1 text-sm ${config.textColor}`}>
        {message}
      </div>
      
      <button
        onClick={() => onDismiss(id)}
        className={`
          flex-shrink-0 p-1 rounded-md transition-colors
          hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-1
          ${config.textColor}
        `}
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// =============================================================================
// TOAST CONTAINER
// =============================================================================

const ToastContainer = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="fixed top-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

// =============================================================================
// TOAST PROVIDER
// =============================================================================

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Generate unique ID for each toast
  const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Dismiss a toast by ID
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Show a toast
  const showToast = useCallback(({ type = 'info', message, duration = DEFAULT_DURATION }) => {
    const id = generateId();
    
    // Add toast to state
    setToasts((prev) => [...prev, { id, type, message }]);
    
    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
    
    return id;
  }, [dismissToast]);

  // Convenience methods
  const showSuccess = useCallback((message, duration) => {
    return showToast({ type: 'success', message, duration });
  }, [showToast]);

  const showError = useCallback((message, duration) => {
    return showToast({ type: 'error', message, duration: duration || 7000 }); // Errors stay longer
  }, [showToast]);

  const showWarning = useCallback((message, duration) => {
    return showToast({ type: 'warning', message, duration });
  }, [showToast]);

  const showInfo = useCallback((message, duration) => {
    return showToast({ type: 'info', message, duration });
  }, [showToast]);

  // Clear all toasts
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissToast,
    clearAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

// =============================================================================
// CUSTOM HOOK
// =============================================================================

export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

// =============================================================================
// CSS ANIMATION (add to your global CSS or Tailwind config)
// =============================================================================

// Add this to your index.css or tailwind.config.js:
/*
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}
*/

export default ToastContext;
