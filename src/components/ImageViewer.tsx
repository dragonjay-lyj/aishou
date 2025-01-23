// src/components/ImageViewer.tsx
import React, { useState, useEffect } from 'react';
import { Modal, ModalContent } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Tooltip } from "@nextui-org/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryImage } from '../types/gallery';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

interface ImageViewerProps {
  image: GalleryImage | null;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  image,
  isOpen,
  onClose,
  onPrev,
  onNext,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  
  useKeyboardNavigation(onPrev, onNext, onClose, isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
    }
  }, [image, isOpen]);

  if (!image) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) { // 最小滑动距离
      if (diff > 0) {
        onNext();
      } else {
        onPrev();
      }
    }
    setTouchStart(null);
  };

  return (
    <Modal 
      size="full" 
      isOpen={isOpen} 
      onClose={onClose}
      className="bg-black/95 backdrop-blur-lg"
      hideCloseButton
      motionProps={{
        variants: {
          enter: { opacity: 1 },
          exit: { opacity: 0 }
        }
      }}
    >
      <ModalContent>
        <div 
          className="flex items-center justify-center h-screen relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 导航按钮 */}
          <AnimatePresence>
            {!isZoomed && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute left-4 z-50"
                >
                  <Tooltip content="上一张 (←)" placement="right">
                    <Button
                      isIconOnly
                      onClick={onPrev}
                      variant="ghost"
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </Button>
                  </Tooltip>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute right-4 z-50"
                >
                  <Tooltip content="下一张 (→)" placement="left">
                    <Button
                      isIconOnly
                      onClick={onNext}
                      variant="ghost"
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Tooltip>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* 图片容器 */}
          <div className={`relative transition-transform duration-300 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            
            <Image
              src={image.src}
              alt={image.alt}
              className={`
                max-h-[90vh] w-auto
                transition-all duration-300
                ${isZoomed ? 'scale-150' : 'scale-100'}
                ${isLoading ? 'opacity-0' : 'opacity-100'}
              `}
              loading="eager"
              onLoad={() => setIsLoading(false)}
              onClick={() => setIsZoomed(!isZoomed)}
            />

            {/* 图片信息 */}
            <AnimatePresence>
              {!isZoomed && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6"
                >
                  <h2 className="text-white text-2xl font-bold mb-2">{image.title}</h2>
                  <p className="text-white/80">{image.artist}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 关闭按钮 */}
          <Button
            isIconOnly
            className="absolute top-4 right-4 z-50"
            onClick={onClose}
            variant="ghost"
            color="default"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};
