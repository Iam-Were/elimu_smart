import { useEffect } from 'react';

/**
 * useKeyboardNavigation Hook
 * Detects keyboard navigation and adds visual focus indicators
 * Helps distinguish between mouse and keyboard users
 */
export const useKeyboardNavigation = () => {
  useEffect(() => {
    let isKeyboardUser = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab key pressed - user is navigating with keyboard
      if (e.key === 'Tab' && !isKeyboardUser) {
        isKeyboardUser = true;
        document.body.classList.add('keyboard-navigation');
      }
    };

    const handleMouseDown = () => {
      // Mouse clicked - user is navigating with mouse
      if (isKeyboardUser) {
        isKeyboardUser = false;
        document.body.classList.remove('keyboard-navigation');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
};

/**
 * useFocusTrap Hook
 * Traps focus within a modal/dialog for keyboard users
 * WCAG 2.1 AA: 2.4.3 Focus Order
 */
export const useFocusTrap = (isActive: boolean, containerRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Close modal/dialog on Escape
        container.dispatchEvent(new CustomEvent('escape-pressed'));
      }
    };

    container.addEventListener('keydown', handleTabKey as EventListener);
    container.addEventListener('keydown', handleEscapeKey as EventListener);

    // Focus first element on mount
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey as EventListener);
      container.removeEventListener('keydown', handleEscapeKey as EventListener);
    };
  }, [isActive, containerRef]);
};

/**
 * useAriaLive Hook
 * Announces dynamic content changes to screen readers
 * WCAG 2.1 AA: 4.1.3 Status Messages
 */
export const useAriaLive = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
  useEffect(() => {
    if (!message) return;

    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', politeness);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.textContent = message;

    document.body.appendChild(liveRegion);

    // Remove after announcement
    const timeout = setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 1000);

    return () => {
      clearTimeout(timeout);
      if (document.body.contains(liveRegion)) {
        document.body.removeChild(liveRegion);
      }
    };
  }, [message, politeness]);
};

/**
 * useReducedMotion Hook
 * Respects user's motion preferences
 * WCAG 2.1 AAA: 2.3.3 Animation from Interactions
 */
export const useReducedMotion = () => {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return prefersReducedMotion;
};

export default {
  useKeyboardNavigation,
  useFocusTrap,
  useAriaLive,
  useReducedMotion,
};
