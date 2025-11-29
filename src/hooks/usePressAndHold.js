// src/hooks/usePressAndHold.js
// Custom hook for press-and-hold interactions with stepper buttons

import { useState, useRef, useEffect } from "react";

/**
 * Trigger haptic feedback if available
 * @param {number|number[]} pattern - Vibration pattern in ms
 */
export function triggerHaptic(pattern = 10) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  } catch (error) {
    // Ignore if vibration API not available
    console.debug("Haptic API not available or failed to vibrate", error);
  }
}

/**
 * Hook for press-and-hold functionality on stepper buttons
 * Provides event handlers for continuous incrementing/decrementing while pressed
 * 
 * @param {Function} callback - Function to call repeatedly while pressed
 * @param {number} delay - Delay between calls in ms (default: 100)
 * @param {Object} options - Additional options
 * @param {number} options.initialDelay - Delay before rapid fire starts (default: 500)
 * @param {boolean} options.haptic - Whether to trigger haptic feedback (default: true)
 * @returns {Object} Event handlers to spread onto the element
 * 
 * @example
 * const handlers = usePressAndHold(() => setValue(v => v + 1), 100);
 * <button {...handlers}>+</button>
 */
export function usePressAndHold(callback, delay = 100, options = {}) {
  const { initialDelay = 500, haptic = true } = options;
  const [, setIsPressed] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const start = () => {
    setIsPressed(true);
    // Immediate first call
    callback();
    if (haptic) {
      triggerHaptic(10);
    }
    // Start rapid fire after initial delay
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(callback, delay);
    }, initialDelay);
  };

  const stop = () => {
    setIsPressed(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => () => stop(), []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
}

export default usePressAndHold;




