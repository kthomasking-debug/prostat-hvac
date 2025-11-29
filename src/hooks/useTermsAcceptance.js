import { useState, useEffect } from 'react';

const TERMS_ACCEPTANCE_KEY = 'engineering_suite_terms_accepted';
const TERMS_VERSION = '1.0'; // Update this when you change the terms

/**
 * Hook to manage terms acceptance status
 * Stores acceptance in localStorage so users only see the modal once
 * @returns {Object} { termsAccepted, markTermsAccepted, resetTermsAcceptance }
 */
export const useTermsAcceptance = () => {
  // Initialize synchronously from localStorage to avoid blocking render
  const [termsAccepted, setTermsAccepted] = useState(() => {
    try {
      const storedAcceptance = localStorage.getItem(TERMS_ACCEPTANCE_KEY);
      const storedVersion = localStorage.getItem(`${TERMS_ACCEPTANCE_KEY}_version`);
      
      // If terms version changed, reset acceptance
      if (storedVersion !== TERMS_VERSION) {
        localStorage.removeItem(TERMS_ACCEPTANCE_KEY);
        localStorage.setItem(`${TERMS_ACCEPTANCE_KEY}_version`, TERMS_VERSION);
        return false;
      }
      
      return storedAcceptance === 'true';
    } catch {
      return false;
    }
  });
  
  const [isLoaded, setIsLoaded] = useState(() => {
    // Start as loaded if we can read localStorage (for tests)
    try {
      localStorage.getItem(TERMS_ACCEPTANCE_KEY);
      return true;
    } catch {
      return false;
    }
  });

  // Sync with localStorage changes (for cross-tab updates)
  useEffect(() => {
    const storedAcceptance = localStorage.getItem(TERMS_ACCEPTANCE_KEY);
    const storedVersion = localStorage.getItem(`${TERMS_ACCEPTANCE_KEY}_version`);

    // If terms version changed, reset acceptance and show modal again
    if (storedVersion !== TERMS_VERSION) {
      localStorage.removeItem(TERMS_ACCEPTANCE_KEY);
      localStorage.setItem(`${TERMS_ACCEPTANCE_KEY}_version`, TERMS_VERSION);
      setTermsAccepted(false);
    } else if (storedAcceptance === 'true') {
      setTermsAccepted(true);
    }

    setIsLoaded(true);
  }, []);

  const markTermsAccepted = () => {
    localStorage.setItem(TERMS_ACCEPTANCE_KEY, 'true');
    localStorage.setItem(`${TERMS_ACCEPTANCE_KEY}_version`, TERMS_VERSION);
    setTermsAccepted(true);
  };

  const resetTermsAcceptance = () => {
    localStorage.removeItem(TERMS_ACCEPTANCE_KEY);
    localStorage.removeItem(`${TERMS_ACCEPTANCE_KEY}_version`);
    setTermsAccepted(false);
  };

  return {
    termsAccepted,
    markTermsAccepted,
    resetTermsAcceptance,
    isLoaded,
  };
};

export default useTermsAcceptance;
