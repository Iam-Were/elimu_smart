/**
 * React Hooks for Mobile Optimizations
 * 
 * Provides easy-to-use React hooks for mobile gestures, haptics,
 * and performance optimizations.
 */

import { useEffect, useRef, useCallback } from 'react';
import type { RefObject } from 'react';
import {
  SwipeDetector,
  PullToRefresh,
  haptics,
  isMobileDevice,
  observeElementIntersection,
  debounce,
  throttle,
} from '@/lib/mobileUtils';
import type { SwipeHandlers, PullToRefreshOptions } from '@/lib/mobileUtils';

// ============================================================================
// SWIPE GESTURES
// ============================================================================

/**
 * Hook for detecting swipe gestures on an element
 * 
 * @example
 * const cardRef = useSwipeGesture({
 *   onSwipeLeft: () => handleNext(),
 *   onSwipeRight: () => handlePrevious(),
 * });
 * 
 * return <div ref={cardRef}>Swipeable content</div>
 */
export function useSwipeGesture<T extends HTMLElement = HTMLDivElement>(
  handlers: SwipeHandlers
): RefObject<T> {
  const elementRef = useRef<T>(null);
  const detectorRef = useRef<SwipeDetector | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Create detector
    detectorRef.current = new SwipeDetector(handlers);
    
    // Attach to element
    const cleanup = detectorRef.current.attach(element);

    return cleanup;
  }, [handlers]);

  return elementRef as RefObject<T>;
}

// ============================================================================
// PULL-TO-REFRESH
// ============================================================================

/**
 * Hook for implementing pull-to-refresh on a scrollable element
 * 
 * @example
 * const scrollRef = usePullToRefresh({
 *   onRefresh: async () => {
 *     await fetchNewData();
 *   },
 *   threshold: 80,
 * });
 * 
 * return <div ref={scrollRef} className="overflow-y-auto">...</div>
 */
export function usePullToRefresh<T extends HTMLElement = HTMLDivElement>(
  options: PullToRefreshOptions
): RefObject<T> {
  const elementRef = useRef<T>(null);
  const ptrRef = useRef<PullToRefresh | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !isMobileDevice()) return;

    // Create pull-to-refresh
    ptrRef.current = new PullToRefresh(options);
    
    // Attach to element
    const cleanup = ptrRef.current.attach(element);

    return cleanup;
  }, [options]);

  return elementRef as RefObject<T>;
}

// ============================================================================
// HAPTIC FEEDBACK
// ============================================================================

/**
 * Hook that returns haptic feedback functions
 * 
 * @example
 * const { success, error, light } = useHaptics();
 * 
 * const handleSubmit = () => {
 *   if (isValid) {
 *     success(); // Trigger success haptic
 *     onSubmit();
 *   } else {
 *     error(); // Trigger error haptic
 *   }
 * };
 */
export function useHaptics() {
  return haptics;
}

/**
 * Higher-order function that adds haptic feedback to any callback
 * 
 * @example
 * const handleClick = useHapticCallback(
 *   () => console.log('Clicked!'),
 *   'medium' // haptic intensity
 * );
 */
export function useHapticCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  intensity: keyof typeof haptics = 'light'
): T {
  return useCallback(
    ((...args: Parameters<T>) => {
      haptics[intensity]();
      return callback(...args);
    }) as T,
    [callback, intensity]
  );
}

// ============================================================================
// MOBILE DETECTION
// ============================================================================

/**
 * Hook that returns mobile device status
 * Useful for conditional rendering or behavior
 * 
 * @example
 * const { isMobile, isIOS, isAndroid } = useMobileDetection();
 * 
 * if (isMobile) {
 *   return <MobileLayout />;
 * }
 */
export function useMobileDetection() {
  const [isMobile, setIsMobile] = React.useState(() => isMobileDevice());

  useEffect(() => {
    // Re-check on resize (e.g., device rotation)
    const handleResize = debounce(() => {
      setIsMobile(isMobileDevice());
    }, 200);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile,
    isIOS: isMobile && /iPad|iPhone|iPod/.test(navigator.userAgent),
    isAndroid: isMobile && /Android/.test(navigator.userAgent),
  };
}

// ============================================================================
// LAZY LOADING / INTERSECTION OBSERVER
// ============================================================================

/**
 * Hook for lazy loading images or content when entering viewport
 * 
 * @example
 * const imageRef = useInViewport((isVisible) => {
 *   if (isVisible) {
 *     loadImage();
 *   }
 * });
 * 
 * return <img ref={imageRef} data-src={imageSrc} />
 */
export function useInViewport<T extends HTMLElement = HTMLDivElement>(
  callback: (isVisible: boolean) => void,
  options?: IntersectionObserverInit
): RefObject<T> {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const cleanup = observeElementIntersection(
      element,
      (entry) => {
        callback(entry.isIntersecting);
      },
      options
    );

    return cleanup;
  }, [callback, options]);

  return elementRef as RefObject<T>;
}

/**
 * Hook for lazy loading images with automatic src switching
 * 
 * @example
 * const imageRef = useLazyImage();
 * return <img ref={imageRef} data-src={imageSrc} alt="..." />
 */
export function useLazyImage(): RefObject<HTMLImageElement> {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;

    const cleanup = observeElementIntersection(
      img,
      (entry) => {
        if (entry.isIntersecting) {
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }
        }
      },
      { rootMargin: '50px' } // Preload 50px before entering viewport
    );

    return cleanup;
  }, []);

  return imageRef as RefObject<HTMLImageElement>;
}

// ============================================================================
// PERFORMANCE HOOKS
// ============================================================================

/**
 * Hook for debounced values (useful for search inputs)
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 300);
 * 
 * useEffect(() => {
 *   // API call with debounced value
 *   search(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for throttled callbacks (useful for scroll handlers)
 * 
 * @example
 * const handleScroll = useThrottle((e) => {
 *   console.log('Scroll position:', e.target.scrollTop);
 * }, 100);
 * 
 * return <div onScroll={handleScroll}>...</div>
 */
export function useThrottle<T extends (...args: unknown[]) => void>(
  callback: T,
  limit: number
): T {
  const throttledCallback = useRef(throttle(callback, limit));

  useEffect(() => {
    throttledCallback.current = throttle(callback, limit);
  }, [callback, limit]);

  return throttledCallback.current as T;
}

// ============================================================================
// SCROLL OPTIMIZATION
// ============================================================================

/**
 * Hook for optimizing scroll performance on an element
 * Adds GPU acceleration and will-change hints
 * 
 * @example
 * const scrollRef = useScrollOptimization();
 * return <div ref={scrollRef} className="overflow-auto">...</div>
 */
export function useScrollOptimization<T extends HTMLElement = HTMLDivElement>(): RefObject<T> {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Apply scroll optimizations
    element.style.willChange = 'transform';
    element.style.transform = 'translateZ(0)';
    // iOS momentum scrolling (using unknown cast to bypass TypeScript limitation)
    (element.style as unknown as Record<string, string>)['-webkit-overflow-scrolling'] = 'touch';

    return () => {
      // Cleanup
      element.style.willChange = '';
      element.style.transform = '';
      (element.style as unknown as Record<string, string>)['-webkit-overflow-scrolling'] = '';
    };
  }, []);

  return elementRef as RefObject<T>;
}

/**
 * Hook for detecting scroll direction
 * Useful for hiding/showing headers on scroll
 * 
 * @example
 * const { isScrollingDown, scrollY } = useScrollDirection();
 * 
 * return (
 *   <header className={isScrollingDown ? 'translate-y-[-100%]' : 'translate-y-0'}>
 *     ...
 *   </header>
 * )
 */
export function useScrollDirection() {
  const [scrollY, setScrollY] = React.useState(0);
  const [isScrollingDown, setIsScrollingDown] = React.useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;
      
      setIsScrollingDown(currentScrollY > lastScrollY.current && currentScrollY > 50);
      setScrollY(currentScrollY);
      
      lastScrollY.current = currentScrollY;
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollY, isScrollingDown };
}

// ============================================================================
// TOUCH TARGET OPTIMIZATION
// ============================================================================

/**
 * Hook that warns if touch targets are too small (< 44x44px)
 * Useful for accessibility auditing in development
 * 
 * @example
 * const buttonRef = useTouchTargetWarning();
 * return <button ref={buttonRef}>Click me</button>
 */
export function useTouchTargetWarning<T extends HTMLElement = HTMLButtonElement>(): RefObject<T> {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const element = elementRef.current;
    if (!element) return;

    const { width, height } = element.getBoundingClientRect();
    const minTouchTarget = 44; // Apple HIG minimum

    if (width < minTouchTarget || height < minTouchTarget) {
      console.warn(
        `Touch target too small: ${width}x${height}px (minimum ${minTouchTarget}x${minTouchTarget}px)`,
        element
      );
    }
  }, []);

  return elementRef as RefObject<T>;
}

// Add missing React import
import React from 'react';
