import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { routes } from '../navConfig';

/**
 * Custom hook for swipe navigation on touch devices
 * Swipe left = next route, Swipe right = previous route
 */
export function useSwipeNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);
  const minSwipeDistanceRef = useRef(50); // Minimum distance in pixels to trigger swipe

  // Get the ordered list of navigable routes
  const navigableRoutes = routes.filter((route) => route.showInNav && !route.hideInNav);

  // Find current route index
  const getCurrentRouteIndex = () => {
    const currentPath = location.pathname;
    // Check exact match first
    let index = navigableRoutes.findIndex((route) => route.path === currentPath);
    
    // If no exact match, check if current path starts with any route path
    if (index === -1) {
      index = navigableRoutes.findIndex((route) => currentPath.startsWith(route.path));
    }
    
    return index >= 0 ? index : 0;
  };

  // Navigate to next route
  const navigateNext = () => {
    const currentIndex = getCurrentRouteIndex();
    const nextIndex = (currentIndex + 1) % navigableRoutes.length;
    const nextRoute = navigableRoutes[nextIndex];
    if (nextRoute) {
      navigate(nextRoute.path);
    }
  };

  // Navigate to previous route
  const navigatePrevious = () => {
    const currentIndex = getCurrentRouteIndex();
    const prevIndex = currentIndex === 0 ? navigableRoutes.length - 1 : currentIndex - 1;
    const prevRoute = navigableRoutes[prevIndex];
    if (prevRoute) {
      navigate(prevRoute.path);
    }
  };

  // Check if the touch target is an interactive element that should prevent swipe
  const isInteractiveElement = (target) => {
    if (!target) return false;
    
    // Check for interactive elements
    const interactiveSelectors = [
      'input',
      'textarea',
      'select',
      'button',
      'a',
      '[role="button"]',
      '[contenteditable="true"]',
      '.swiper', // Common class for carousels
      '[data-no-swipe]', // Allow opt-out with data attribute
    ];
    
    // Check if target or any parent matches
    let element = target;
    while (element && element !== document.body) {
      const tagName = element.tagName?.toLowerCase();
      const role = element.getAttribute('role');
      const contentEditable = element.getAttribute('contenteditable');
      const noSwipe = element.hasAttribute('data-no-swipe');
      
      if (noSwipe) return true;
      if (interactiveSelectors.includes(tagName)) return true;
      if (role === 'button') return true;
      if (contentEditable === 'true') return true;
      if (element.classList?.contains('swiper')) return true;
      
      element = element.parentElement;
    }
    
    return false;
  };

  useEffect(() => {
    // Only enable on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) return;

    const handleTouchStart = (e) => {
      // Don't interfere with interactive elements
      if (isInteractiveElement(e.target)) {
        touchStartRef.current = null;
        return;
      }

      // Don't enable swipe if there's a modal or overlay open
      const hasModal = document.querySelector('[role="dialog"], .modal, [data-modal], .fixed.inset-0.z-40');
      if (hasModal) {
        touchStartRef.current = null;
        return;
      }

      const firstTouch = e.touches[0];
      touchStartRef.current = {
        x: firstTouch.clientX,
        y: firstTouch.clientY,
        time: Date.now(),
      };
      touchEndRef.current = null;
    };

    const handleTouchMove = (e) => {
      // Update touch end position during move
      if (touchStartRef.current && e.touches.length > 0) {
        const currentTouch = e.touches[0];
        touchEndRef.current = {
          x: currentTouch.clientX,
          y: currentTouch.clientY,
        };
      }
    };

    const handleTouchEnd = (e) => {
      if (!touchStartRef.current || !touchEndRef.current) return;

      const start = touchStartRef.current;
      const end = touchEndRef.current;
      
      const deltaX = end.x - start.x;
      const deltaY = end.y - start.y;
      const deltaTime = Date.now() - start.time;

      // Check if this was a horizontal swipe (not vertical scroll)
      // Require horizontal movement to be at least 2x the vertical movement
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) * 2;
      
      // Check if swipe was fast enough (less than 500ms) and far enough
      const isFastEnough = deltaTime < 500;
      const isFarEnough = Math.abs(deltaX) > minSwipeDistanceRef.current;

      // Only trigger if it's clearly a horizontal swipe, not a scroll
      if (isHorizontalSwipe && isFastEnough && isFarEnough) {
        // Prevent default to avoid scrolling
        e.preventDefault();
        
        if (deltaX > 0) {
          // Swipe right = previous route
          navigatePrevious();
        } else {
          // Swipe left = next route
          navigateNext();
        }
      }

      // Reset
      touchStartRef.current = null;
      touchEndRef.current = null;
    };

    // Add touch event listeners to the main content area
    let mainElement = null;
    let retryTimeout = null;

    const setupListeners = () => {
      mainElement = document.querySelector('main');
      if (!mainElement) {
        // Retry after a short delay if main element isn't ready
        retryTimeout = setTimeout(setupListeners, 100);
        return;
      }

      mainElement.addEventListener('touchstart', handleTouchStart, { passive: true });
      mainElement.addEventListener('touchmove', handleTouchMove, { passive: true });
      mainElement.addEventListener('touchend', handleTouchEnd, { passive: false });
    };

    setupListeners();

    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      if (mainElement) {
        mainElement.removeEventListener('touchstart', handleTouchStart);
        mainElement.removeEventListener('touchmove', handleTouchMove);
        mainElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [location.pathname, navigate]);
}

