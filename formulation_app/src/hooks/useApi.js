/**
 * useApi Custom Hook
 * 
 * Provides a consistent way to make API calls with:
 * - Loading state management
 * - Error handling
 * - Automatic toast notifications
 * - Data caching (optional)
 * 
 * Usage:
 *   const { data, loading, error, execute, reset } = useApi();
 *   
 *   // In useEffect or event handler:
 *   await execute(() => api.get('/ingredients'));
 *   
 *   // Or with immediate execution:
 *   const { data, loading, error } = useApi({
 *     immediate: true,
 *     fn: () => api.get('/ingredients')
 *   });
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import api, { getErrorMessage, isAuthError } from '../api/client';
import { useToast } from '../components/common/Toast';

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

const useApi = (options = {}) => {
  const {
    immediate = false,      // Execute immediately on mount
    fn = null,              // Function to execute immediately
    showErrorToast = true,  // Show toast on error
    showSuccessToast = false, // Show toast on success
    successMessage = 'Operation completed successfully',
    onSuccess = null,       // Callback on success
    onError = null,         // Callback on error
  } = options;

  // State
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);
  
  // Toast notifications
  const toast = useToast();

  // Cleanup on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // EXECUTE API CALL
  // ---------------------------------------------------------------------------

  const execute = useCallback(async (apiFunction, executeOptions = {}) => {
    const {
      showErrorToast: showError = showErrorToast,
      showSuccessToast: showSuccess = showSuccessToast,
      successMessage: successMsg = successMessage,
    } = executeOptions;

    // Reset state
    setLoading(true);
    setError(null);

    try {
      // Execute the API function
      const response = await apiFunction();
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        setData(response.data);
        setLoading(false);

        // Show success toast if enabled
        if (showSuccess && toast) {
          toast.showSuccess(successMsg);
        }

        // Call success callback
        if (onSuccess) {
          onSuccess(response.data);
        }
      }

      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = getErrorMessage(err);

      // Only update state if component is still mounted
      if (isMounted.current) {
        setError(errorMessage);
        setLoading(false);

        // Show error toast if enabled (but not for auth errors - those redirect)
        if (showError && toast && !isAuthError(err)) {
          toast.showError(errorMessage);
        }

        // Call error callback
        if (onError) {
          onError(err);
        }
      }

      return { success: false, error: errorMessage };
    }
  }, [showErrorToast, showSuccessToast, successMessage, onSuccess, onError, toast]);

  // ---------------------------------------------------------------------------
  // RESET STATE
  // ---------------------------------------------------------------------------

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  // ---------------------------------------------------------------------------
  // IMMEDIATE EXECUTION
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (immediate && fn) {
      execute(fn);
    }
  }, []); // Only run on mount

  // ---------------------------------------------------------------------------
  // RETURN VALUE
  // ---------------------------------------------------------------------------

  return {
    data,
    loading,
    error,
    execute,
    reset,
    setData, // Allow manual data updates
  };
};

// =============================================================================
// SPECIALIZED HOOKS
// =============================================================================

/**
 * Hook for fetching a list of items
 */
export const useFetchList = (endpoint, options = {}) => {
  const { data, loading, error, execute, reset } = useApi(options);
  
  const fetch = useCallback((params = {}) => {
    return execute(() => api.get(endpoint, { params }));
  }, [endpoint, execute]);

  const refetch = useCallback(() => {
    return fetch();
  }, [fetch]);

  return { data, loading, error, fetch, refetch, reset };
};

/**
 * Hook for fetching a single item by ID
 */
export const useFetchOne = (endpoint, id, options = {}) => {
  const { data, loading, error, execute, reset } = useApi(options);
  
  const fetch = useCallback(() => {
    if (!id) return Promise.resolve({ success: false });
    return execute(() => api.get(`${endpoint}/${id}`));
  }, [endpoint, id, execute]);

  return { data, loading, error, fetch, reset };
};

/**
 * Hook for mutation operations (create, update, delete)
 */
export const useMutation = (options = {}) => {
  const { 
    showSuccessToast = true,
    ...restOptions 
  } = options;

  const { loading, error, execute, reset } = useApi({
    showSuccessToast,
    ...restOptions,
  });

  const mutate = useCallback(async (apiFunction, mutateOptions = {}) => {
    return execute(apiFunction, mutateOptions);
  }, [execute]);

  return { loading, error, mutate, reset };
};

export default useApi;
