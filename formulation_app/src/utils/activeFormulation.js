/**
 * Active Formulation Cache Utility
 *
 * Tracks the currently active formulation being worked on.
 * Uses localStorage to persist across page navigations.
 */

const STORAGE_KEY = 'activeFormulation';

export const setActiveFormulation = (formulation) => {
  if (formulation && formulation.id) {
    const data = {
      id: formulation.id,
      product_name: formulation.product_name,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const getActiveFormulation = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading active formulation:', e);
  }
  return null;
};

export const clearActiveFormulation = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export default {
  set: setActiveFormulation,
  get: getActiveFormulation,
  clear: clearActiveFormulation
};
