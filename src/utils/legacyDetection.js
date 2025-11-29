/**
 * Legacy Device Detection
 * Detects if the device is running an old browser that doesn't support modern features
 * Used to disable animations and use fallback UI on Android 4.4 KitKat / Chrome 30-40
 */

/**
 * Check if the browser supports modern JavaScript features
 * @returns {boolean} true if legacy browser detected
 */
export function isLegacyBrowser() {
  // Check for ES6 features
  if (typeof Symbol === 'undefined') return true;
  if (typeof Promise === 'undefined') return true;
  
  // Check for arrow function support (syntax check)
  try {
    // eslint-disable-next-line no-eval
    eval('(() => {})');
  } catch (e) {
    return true;
  }
  
  // Check for CSS Grid support
  if (typeof CSS !== 'undefined' && CSS.supports) {
    if (!CSS.supports('display', 'grid')) {
      return true;
    }
  } else {
    // CSS.supports not available = very old browser
    return true;
  }
  
  // Check for Fetch API
  if (typeof fetch === 'undefined') {
    return true;
  }
  
  // Check Chrome version (if available)
  const userAgent = navigator.userAgent;
  const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
  if (chromeMatch) {
    const chromeVersion = parseInt(chromeMatch[1], 10);
    if (chromeVersion < 50) {
      return true; // Chrome < 50 is too old
    }
  }
  
  // Check Android version
  const androidMatch = userAgent.match(/Android (\d+\.\d+)/);
  if (androidMatch) {
    const androidVersion = parseFloat(androidMatch[1]);
    if (androidVersion < 5.0) {
      return true; // Android < 5.0 (KitKat 4.4)
    }
  }
  
  return false;
}

/**
 * Check if animations should be disabled
 * @returns {boolean} true if animations should be disabled
 */
export function shouldDisableAnimations() {
  return isLegacyBrowser();
}

/**
 * Get a safe animation component wrapper
 * Returns a no-op component on legacy browsers
 */
export function SafeMotion({ children, fallback = null, ...props }) {
  if (shouldDisableAnimations()) {
    return fallback || children;
  }
  
  // Dynamic import to avoid loading framer-motion on legacy browsers
  // This will be handled by the component using this utility
  return children;
}

