/**
 * Mobile Optimization Utilities
 * 
 * Provides mobile-first utilities for touch gestures, haptic feedback,
 * and performance optimizations following Apple HIG and Material Design.
 */

// ============================================================================
// HAPTIC FEEDBACK
// ============================================================================

/**
 * Vibration patterns for different interaction types
 */
export const HapticPattern = {
  LIGHT: [10] as const,           // Quick tap, button press
  MEDIUM: [20] as const,          // Selection, toggle
  HEAVY: [30] as const,           // Important action, error
  SUCCESS: [10, 50, 10] as const, // Success confirmation
  ERROR: [50, 100, 50] as const,  // Error notification
  SELECTION: [5, 50, 5] as const, // Item selection
} as const;

/**
 * Triggers haptic feedback on supported devices
 * Falls back gracefully on unsupported browsers
 */
export const triggerHaptic = (pattern: readonly number[] = HapticPattern.LIGHT): void => {
  // Check if Vibration API is supported
  if (!('vibrate' in navigator)) {
    return; // Graceful degradation - no haptics on desktop
  }

  try {
    navigator.vibrate(pattern);
  } catch (error) {
    // Silently fail - haptics are enhancement, not requirement
    console.debug('Haptic feedback not available', error);
  }
};

/**
 * Convenience functions for common haptic patterns
 */
export const haptics = {
  light: () => triggerHaptic(HapticPattern.LIGHT),
  medium: () => triggerHaptic(HapticPattern.MEDIUM),
  heavy: () => triggerHaptic(HapticPattern.HEAVY),
  success: () => triggerHaptic(HapticPattern.SUCCESS),
  error: () => triggerHaptic(HapticPattern.ERROR),
  selection: () => triggerHaptic(HapticPattern.SELECTION),
};

// ============================================================================
// TOUCH GESTURE DETECTION
// ============================================================================

export interface SwipeEvent {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  duration: number;
}

export interface SwipeHandlers {
  onSwipeLeft?: (event: SwipeEvent) => void;
  onSwipeRight?: (event: SwipeEvent) => void;
  onSwipeUp?: (event: SwipeEvent) => void;
  onSwipeDown?: (event: SwipeEvent) => void;
  onSwipe?: (event: SwipeEvent) => void;
}

/**
 * Swipe gesture detector with velocity tracking
 * 
 * @example
 * const swipeDetector = useSwipeDetector(elementRef, {
 *   onSwipeLeft: () => console.log('Swiped left'),
 *   onSwipeRight: () => console.log('Swiped right'),
 * });
 */
export class SwipeDetector {
  private startX = 0;
  private startY = 0;
  private startTime = 0;
  private minSwipeDistance = 50; // pixels
  private maxSwipeTime = 500; // ms
  private handlers: SwipeHandlers;

  constructor(handlers: SwipeHandlers) {
    this.handlers = handlers;
  }

  handleTouchStart = (e: TouchEvent): void => {
    const touch = e.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.startTime = Date.now();
  };

  handleTouchEnd = (e: TouchEvent): void => {
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const endTime = Date.now();

    const deltaX = endX - this.startX;
    const deltaY = endY - this.startY;
    const duration = endTime - this.startTime;

    // Calculate distance and velocity
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / duration;

    // Only trigger if swipe is fast enough and within time limit
    if (distance < this.minSwipeDistance || duration > this.maxSwipeTime) {
      return;
    }

    // Determine primary direction (horizontal or vertical)
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

    let direction: SwipeEvent['direction'];
    if (isHorizontal) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    const swipeEvent: SwipeEvent = {
      direction,
      distance,
      velocity,
      duration,
    };

    // Trigger specific handler
    switch (direction) {
      case 'left':
        this.handlers.onSwipeLeft?.(swipeEvent);
        break;
      case 'right':
        this.handlers.onSwipeRight?.(swipeEvent);
        break;
      case 'up':
        this.handlers.onSwipeUp?.(swipeEvent);
        break;
      case 'down':
        this.handlers.onSwipeDown?.(swipeEvent);
        break;
    }

    // Trigger generic handler
    this.handlers.onSwipe?.(swipeEvent);
  };

  /**
   * Attach swipe detector to an element
   */
  attach(element: HTMLElement): () => void {
    element.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    element.addEventListener('touchend', this.handleTouchEnd, { passive: true });

    // Return cleanup function
    return () => {
      element.removeEventListener('touchstart', this.handleTouchStart);
      element.removeEventListener('touchend', this.handleTouchEnd);
    };
  }
}

// ============================================================================
// PULL-TO-REFRESH
// ============================================================================

export interface PullToRefreshOptions {
  threshold?: number; // Distance in pixels to trigger refresh
  onRefresh: () => Promise<void>;
  resistance?: number; // 0-1, how much to resist pull (1 = no resistance)
}

/**
 * Pull-to-refresh implementation for mobile
 * 
 * @example
 * const ptr = new PullToRefresh({
 *   threshold: 80,
 *   onRefresh: async () => {
 *     await fetchData();
 *   }
 * });
 * ptr.attach(scrollContainerRef.current);
 */
export class PullToRefresh {
  private startY = 0;
  private currentY = 0;
  private isRefreshing = false;
  private threshold: number;
  private resistance: number;
  private onRefresh: () => Promise<void>;

  constructor(options: PullToRefreshOptions) {
    this.threshold = options.threshold ?? 80;
    this.resistance = options.resistance ?? 0.5;
    this.onRefresh = options.onRefresh;
  }

  handleTouchStart = (e: TouchEvent): void => {
    // Only trigger at scroll top
    const target = e.currentTarget as HTMLElement;
    if (target.scrollTop > 0) return;

    this.startY = e.touches[0].clientY;
  };

  handleTouchMove = (e: TouchEvent): void => {
    if (this.isRefreshing) return;

    const target = e.currentTarget as HTMLElement;
    if (target.scrollTop > 0) return;

    this.currentY = e.touches[0].clientY;
    const pullDistance = this.currentY - this.startY;

    // Only pull down
    if (pullDistance > 0) {
      // Apply resistance
      const resistedDistance = pullDistance * this.resistance;
      
      // Visual feedback (optional - implement in component)
      target.style.transform = `translateY(${Math.min(resistedDistance, this.threshold)}px)`;
    }
  };

  handleTouchEnd = async (e: TouchEvent): Promise<void> => {
    const target = e.currentTarget as HTMLElement;
    const pullDistance = this.currentY - this.startY;

    // Reset transform
    target.style.transform = '';

    // Trigger refresh if threshold exceeded
    if (pullDistance > this.threshold && !this.isRefreshing) {
      this.isRefreshing = true;
      haptics.medium(); // Haptic feedback on refresh trigger
      
      try {
        await this.onRefresh();
      } finally {
        this.isRefreshing = false;
      }
    }

    this.startY = 0;
    this.currentY = 0;
  };

  attach(element: HTMLElement): () => void {
    element.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    element.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    element.addEventListener('touchend', this.handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', this.handleTouchStart);
      element.removeEventListener('touchmove', this.handleTouchMove);
      element.removeEventListener('touchend', this.handleTouchEnd);
    };
  }
}

// ============================================================================
// MOBILE DETECTION
// ============================================================================

/**
 * Detects if device is mobile based on user agent and touch support
 */
export const isMobileDevice = (): boolean => {
  // Check for touch support
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Check for mobile user agent
  const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  return hasTouch && mobileUserAgent;
};

/**
 * Detects if device is iOS
 */
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

/**
 * Detects if device is Android
 */
export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

/**
 * Gets safe area insets for notch/dynamic island support
 */
export const getSafeAreaInsets = () => {
  const style = getComputedStyle(document.documentElement);
  
  return {
    top: parseInt(style.getPropertyValue('--sat') || '0', 10),
    right: parseInt(style.getPropertyValue('--sar') || '0', 10),
    bottom: parseInt(style.getPropertyValue('--sab') || '0', 10),
    left: parseInt(style.getPropertyValue('--sal') || '0', 10),
  };
};

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Adds will-change CSS for scroll performance
 */
export const optimizeScrollPerformance = (element: HTMLElement): void => {
  element.style.willChange = 'transform';
  element.style.transform = 'translateZ(0)'; // GPU acceleration
};

/**
 * Debounce utility for scroll/resize handlers
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle utility for frequent events
 */
export const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ============================================================================
// VIEWPORT UTILITIES
// ============================================================================

/**
 * Gets current viewport dimensions accounting for mobile browsers
 */
export const getViewportDimensions = () => {
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight,
  };
};

/**
 * Checks if element is in viewport (for lazy loading)
 */
export const isInViewport = (element: HTMLElement, offset = 0): boolean => {
  const rect = element.getBoundingClientRect();
  const viewport = getViewportDimensions();

  return (
    rect.top >= -offset &&
    rect.left >= -offset &&
    rect.bottom <= viewport.height + offset &&
    rect.right <= viewport.width + offset
  );
};

/**
 * Observes elements entering viewport (Intersection Observer wrapper)
 */
export const observeElementIntersection = (
  element: HTMLElement,
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
): (() => void) => {
  const observer = new IntersectionObserver(([entry]) => {
    callback(entry);
  }, options);

  observer.observe(element);

  return () => observer.disconnect();
};
