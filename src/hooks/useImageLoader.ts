// src/hooks/useImageLoader.ts
import { useState, useEffect, useCallback } from 'react';

interface ImageLoaderOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useImageLoader = (src: string, options: ImageLoaderOptions = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const onIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsInView(entry.isIntersecting);
  }, []);

  useEffect(() => {
    if (!src) return;

    const observer = new IntersectionObserver(onIntersect, {
      threshold: options.threshold || 0,
      rootMargin: options.rootMargin || '50px',
    });

    const element = document.querySelector(`img[data-src="${src}"]`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [src, options.threshold, options.rootMargin, onIntersect]);

  useEffect(() => {
    if (!isInView || isLoaded) return;

    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setError(new Error('Failed to load image'));
  }, [src, isInView, isLoaded]);

  return { isLoaded, error, isInView };
};
