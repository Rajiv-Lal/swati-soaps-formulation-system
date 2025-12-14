/**
 * Loading Spinner Component
 * 
 * Reusable loading indicator with multiple sizes and optional message.
 * 
 * Usage:
 *   import LoadingSpinner from '../components/common/LoadingSpinner';
 *   
 *   <LoadingSpinner />
 *   <LoadingSpinner size="lg" message="Loading ingredients..." />
 *   <LoadingSpinner fullScreen />
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

// Size configurations
const SIZES = {
  sm: {
    spinner: 'w-4 h-4',
    text: 'text-xs',
  },
  md: {
    spinner: 'w-6 h-6',
    text: 'text-sm',
  },
  lg: {
    spinner: 'w-8 h-8',
    text: 'text-base',
  },
  xl: {
    spinner: 'w-12 h-12',
    text: 'text-lg',
  },
};

const LoadingSpinner = ({ 
  size = 'md', 
  message = null,
  fullScreen = false,
  className = '',
}) => {
  const sizeConfig = SIZES[size] || SIZES.md;

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 
        className={`${sizeConfig.spinner} text-blue-600 animate-spin`}
        aria-hidden="true"
      />
      {message && (
        <p className={`${sizeConfig.text} text-gray-600`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
        role="status"
        aria-live="polite"
        aria-label={message || 'Loading'}
      >
        {content}
      </div>
    );
  }

  return (
    <div 
      role="status" 
      aria-live="polite" 
      aria-label={message || 'Loading'}
    >
      {content}
    </div>
  );
};

// =============================================================================
// LOADING OVERLAY VARIANT
// =============================================================================

export const LoadingOverlay = ({ isLoading, children, message }) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
          <LoadingSpinner size="lg" message={message} />
        </div>
      )}
    </div>
  );
};

// =============================================================================
// PAGE LOADING VARIANT
// =============================================================================

export const PageLoading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="xl" message={message} />
    </div>
  );
};

export default LoadingSpinner;
