import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useAccessibility';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  skeletonClassName?: string;
  containerClassName?: string;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * LazyImage Component
 * 
 * Lazy loads images using Intersection Observer API for better performance.
 * Shows loading skeleton with reduced motion support.
 * Falls back to default image on error.
 * 
 * @example
 * <LazyImage 
 *   src="/profile-photo.jpg" 
 *   alt="User profile" 
 *   fallback="/default-avatar.png"
 *   className="rounded-full"
 * />
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  fallback = '/default-avatar.png',
  className = '',
  skeletonClassName = '',
  containerClassName = '',
  threshold = 0.1,
  rootMargin = '50px',
  onLoad,
  onError,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Skip lazy loading if image is already in cache or reduced motion is preferred
    if (prefersReducedMotion) {
      setImageSrc(src);
      return;
    }

    const imageElement = imgRef.current;
    if (!imageElement) return;

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(imageElement);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(imageElement);

    return () => {
      if (imageElement) {
        observer.unobserve(imageElement);
      }
    };
  }, [src, threshold, rootMargin, prefersReducedMotion]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setImageSrc(fallback);
    onError?.();
  };

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {/* Loading Skeleton */}
      {isLoading && !hasError && (
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200',
            !prefersReducedMotion && 'animate-pulse',
            skeletonClassName
          )}
          aria-hidden="true"
        />
      )}

      {/* Actual Image */}
      <img
        ref={imgRef}
        src={imageSrc || undefined}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
        {...props}
      />
    </div>
  );
};

/**
 * LazyBackgroundImage Component
 * 
 * Lazy loads background images using Intersection Observer.
 * Useful for hero sections, wallpapers, and large background images.
 * 
 * @example
 * <LazyBackgroundImage 
 *   src="/wallpaper.jpg" 
 *   className="h-64 bg-cover"
 * >
 *   <h1>Content over background</h1>
 * </LazyBackgroundImage>
 */
interface LazyBackgroundImageProps {
  src: string;
  fallback?: string;
  className?: string;
  children?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export const LazyBackgroundImage: React.FC<LazyBackgroundImageProps> = ({
  src,
  fallback = '',
  className = '',
  children,
  threshold = 0.1,
  rootMargin = '50px',
}) => {
  const [backgroundSrc, setBackgroundSrc] = useState<string>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setBackgroundSrc(src);
      setIsLoading(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Preload image
            const img = new Image();
            img.src = src;
            img.onload = () => {
              setBackgroundSrc(src);
              setIsLoading(false);
            };
            img.onerror = () => {
              setBackgroundSrc(fallback);
              setIsLoading(false);
            };
            observer.unobserve(container);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(container);

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, [src, fallback, threshold, rootMargin, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative transition-all duration-500',
        isLoading && !prefersReducedMotion && 'animate-pulse bg-gray-200',
        className
      )}
      style={{
        backgroundImage: backgroundSrc ? `url(${backgroundSrc})` : undefined,
      }}
    >
      {children}
    </div>
  );
};

export default LazyImage;
