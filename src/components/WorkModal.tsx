// src/components/WorkModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, ModalContent } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { motion, AnimatePresence } from "framer-motion";
import type { WorkImage } from '../types/work';
import ZoomInIcon from './ZoomInIcon'
import ZoomOutIcon from './ZoomOutIcon'

interface WorkModalProps {
  image: WorkImage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WorkModal: React.FC<WorkModalProps> = ({ image, isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setIsZoomed(false);
      setImagePosition({ x: 0, y: 0 });
    }
  }, [isOpen, image]);

  if (!image) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || !isZoomed) return;

    const xDiff = e.touches[0].clientX - touchStart.x;
    const yDiff = e.touches[0].clientY - touchStart.y;

    setImagePosition(prev => ({
      x: prev.x + xDiff,
      y: prev.y + yDiff
    }));

    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isZoomed) return;
    
    setImagePosition(prev => ({
      x: prev.x - e.deltaX,
      y: prev.y - e.deltaY
    }));
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
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          {/* 加载动画 */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 图片容器 */}
          <motion.div
            className={`relative transition-all duration-300 ${
              isZoomed ? 'cursor-move' : 'cursor-zoom-in'
            }`}
            animate={{
              scale: isZoomed ? 2 : 1,
              x: isZoomed ? imagePosition.x : 0,
              y: isZoomed ? imagePosition.y : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Image
              src={image.url}
              alt={image.caption || ''}
              className={`
                max-h-[90vh] w-auto
                transition-opacity duration-300
                ${isLoading ? 'opacity-0' : 'opacity-100'}
              `}
              loading="eager"
              onLoad={() => setIsLoading(false)}
              onClick={() => setIsZoomed(!isZoomed)}
            />

            {/* 图片说明 */}
            <AnimatePresence>
              {!isZoomed && image.caption && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4"
                >
                  <p className="text-white text-center">{image.caption}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 控制按钮 */}
          <div className="fixed bottom-6 right-6 flex gap-2">
            <Button
              isIconOnly
              variant="flat"
              className="bg-white/10 backdrop-blur-md"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              {isZoomed ? <ZoomOutIcon /> : <ZoomInIcon />}
            </Button>
            <Button
              isIconOnly
              variant="flat"
              className="bg-white/10 backdrop-blur-md"
              onClick={onClose}
            >
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
