// src/components/ImageGallery.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@nextui-org/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { GalleryFilters } from './GalleryFilters';
import { ImageCard } from './ImageCard';
import { ImageViewer } from './ImageViewer';
import { ImageDetails } from './ImageDetails';
import { Pagination } from "@nextui-org/pagination";
import { useGallery } from '../hooks/useGallery';
import type { GalleryImage } from '../types/gallery';

interface ImageGalleryProps {
  initialImages: GalleryImage[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ initialImages }) => {
  const {
    images,
    totalPages,
    currentPage,
    setCurrentPage,
    updateFilters,
    filters
  } = useGallery(initialImages);

  const [viewerImage, setViewerImage] = useState<GalleryImage | null>(null);
  const [detailsImage, setDetailsImage] = useState<GalleryImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [columns, setColumns] = useState(4);

  // 模拟加载效果
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [filters, currentPage]);

  const handlePrevImage = () => {
    const currentIndex = initialImages.findIndex(img => img.id === viewerImage?.id);
    if (currentIndex > 0) {
      setViewerImage(initialImages[currentIndex - 1]);
    }
  };

  const handleNextImage = () => {
    const currentIndex = initialImages.findIndex(img => img.id === viewerImage?.id);
    if (currentIndex < initialImages.length - 1) {
      setViewerImage(initialImages[currentIndex + 1]);
    }
  };

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewerImage) {
        switch (e.key) {
          case 'ArrowLeft':
            handlePrevImage();
            break;
          case 'ArrowRight':
            handleNextImage();
            break;
          case 'Escape':
            setViewerImage(null);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewerImage]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* 顶部控制栏 */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <GalleryFilters 
          filters={filters}
          onFilterChange={updateFilters}
        />
        
        <div className="flex gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat">
                布局: {viewMode === 'grid' ? '网格' : '瀑布流'}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Layout options"
              onAction={(key) => setViewMode(key as 'grid' | 'masonry')}
            >
              <DropdownItem key="grid">网格布局</DropdownItem>
              <DropdownItem key="masonry">瀑布流布局</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat">
                列数: {columns}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Column options"
              onAction={(key) => setColumns(Number(key))}
            >
              {[2, 3, 4, 5].map(n => (
                <DropdownItem key={n}>{n} 列</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* 图片网格 */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-64 bg-default-100 rounded-lg animate-pulse"
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === 'grid'
                ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`
                : 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6'
            }
          >
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={viewMode === 'masonry' ? 'mb-6 break-inside-avoid' : ''}
              >
                <ImageCard
                  image={image}
                  onShowDetails={() => setDetailsImage(image)}
                  onImageClick={() => setViewerImage(image)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 无结果提示 */}
      {!isLoading && images.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <p className="text-xl text-default-500 mb-4">没有找到匹配的图片</p>
          <Button
            color="primary"
            variant="flat"
            onPress={() => updateFilters({})}
          >
            清除所有筛选
          </Button>
        </motion.div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            total={totalPages}
            initialPage={1}
            page={currentPage}
            onChange={setCurrentPage}
            showControls
            color="primary"
            size="lg"
            className="gap-2"
            radius="lg"
          />
        </div>
      )}

      {/* 查看器和详情模态框 */}
      <ImageViewer
        image={viewerImage}
        isOpen={!!viewerImage}
        onClose={() => setViewerImage(null)}
        onPrev={handlePrevImage}
        onNext={handleNextImage}
      />

      <ImageDetails
        image={detailsImage}
        isOpen={!!detailsImage}
        onClose={() => setDetailsImage(null)}
      />
    </div>
  );
};

export default ImageGallery;
