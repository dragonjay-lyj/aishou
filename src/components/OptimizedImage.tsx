// src/components/OptimizedImage.tsx
import React, { useState, useCallback } from 'react';
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { Progress } from "@nextui-org/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useImageLoader } from '../hooks/useImageLoader';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  onLoad,
  onError,
}) => {
  const { isLoaded, error, isInView } = useImageLoader(src);
  const [retryCount, setRetryCount] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // 模拟加载进度
  const simulateProgress = useCallback(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
      }
      setLoadProgress(Math.min(progress, 100));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setLoadProgress(0);
      simulateProgress();
    }
  };

  React.useEffect(() => {
    if (!isLoaded && !error) {
      const cleanup = simulateProgress();
      return cleanup;
    }
  }, [isLoaded, error, simulateProgress]);

  if (error && retryCount >= 3) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-default-100 flex flex-col items-center justify-center p-4 ${className}`}
      >
        <p className="text-small text-default-500 mb-2">加载失败</p>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          onPress={handleRetry}
        >
          重试
        </Button>
      </motion.div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 加载状态 */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-default-200"
          >
            <Progress
              size="sm"
              value={loadProgress}
              color="primary"
              className="max-w-[200px] mb-2"
            />
            <p className="text-tiny text-default-500">
              加载中... {Math.round(loadProgress)}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 图片 */}
      <Image
        src={priority || isInView ? src : ''}
        alt={alt}
        className={`
          transition-all duration-500
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${isHovered ? 'scale-105' : 'scale-100'}
        `}
        width={width}
        height={height}
        data-src={src}
        onError={() => {
          handleRetry();
          onError?.();
        }}
        onLoad={() => {
          setLoadProgress(100);
          onLoad?.();
        }}
      />

      {/* 悬浮效果 */}
      <AnimatePresence>
        {isHovered && isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-sm"
          >
            <p className="text-white text-sm">{alt}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
