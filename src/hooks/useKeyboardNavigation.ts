// src/hooks/useKeyboardNavigation.ts
import { useEffect } from 'react';

export const useKeyboardNavigation = (
  onPrev: () => void,
  onNext: () => void,
  onClose: () => void,
  isActive: boolean
) => {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          onPrev();
          break;
        case 'ArrowRight':
          onNext();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onPrev, onNext, onClose]);
};
