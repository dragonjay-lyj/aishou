// src/components/ImageGallery.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Button } from "@nextui-org/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { GalleryFilters } from './GalleryFilters';
import { ImageCard } from './ImageCard';
import { ImageViewer } from './ImageViewer';
import { ImageDetails } from './ImageDetails';
import { Pagination } from "@nextui-org/pagination";
import { useGallery } from '../hooks/useGallery';
import { useInView } from 'react-intersection-observer';
import type { GalleryImage } from '../types/gallery';

interface ImageGalleryProps {
  initialImages: GalleryImage[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ initialImages }) => {
  // 状态管理
  const {
    images,
    totalPages,
    currentPage,
    setCurrentPage,
    updateFilters,
    filters,
  } = useGallery(initialImages);

  const [viewerImage, setViewerImage] = useState<GalleryImage | null>(null);
  const [detailsImage, setDetailsImage] = useState<GalleryImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry' | 'carousel'>('grid');
  const [columns, setColumns] = useState(4);
  const [scrollPosition, setScrollPosition] = useState(0);

  // 无限滚动
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // 处理滚动位置
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 加载效果
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [filters, currentPage]);

  // 图片导航
  const handlePrevImage = useCallback(() => {
    const currentIndex = initialImages.findIndex(img => img.id === viewerImage?.id);
    if (currentIndex > 0) {
      setViewerImage(initialImages[currentIndex - 1]);
    }
  }, [viewerImage, initialImages]);

  const handleNextImage = useCallback(() => {
    const currentIndex = initialImages.findIndex(img => img.id === viewerImage?.id);
    if (currentIndex < initialImages.length - 1) {
      setViewerImage(initialImages[currentIndex + 1]);
    }
  }, [viewerImage, initialImages]);

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
  }, [viewerImage, handlePrevImage, handleNextImage]);

  // 布局配置
  const layoutConfig = {
    grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`,
    masonry: 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6',
    carousel: 'flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6'
  };

  return (
    <ScrollShadow className="h-full">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* 固定顶部控制栏 */}
        <motion.div
          className={`
            sticky top-0 z-50 bg-background/80 backdrop-blur-lg
            rounded-xl shadow-lg p-4 transition-all duration-300
            ${scrollPosition > 100 ? 'shadow-xl' : ''}
          `}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <GalleryFilters 
              filters={filters}
              onFilterChange={updateFilters}
            />
            
            <div className="flex gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button 
                    variant="flat"
                    startContent={
                      viewMode === 'grid' ? <GridIcon /> :
                      viewMode === 'masonry' ? <MasonryIcon /> :
                      <CarouselIcon />
                    }
                  >
                    {viewMode === 'grid' ? '网格' : 
                     viewMode === 'masonry' ? '瀑布流' : '轮播'}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Layout options"
                  onAction={(key) => setViewMode(key as typeof viewMode)}
                >
                  <DropdownItem key="grid" startContent={<GridIcon />}>
                    网格布局
                  </DropdownItem>
                  <DropdownItem key="masonry" startContent={<MasonryIcon />}>
                    瀑布流布局
                  </DropdownItem>
                  <DropdownItem key="carousel" startContent={<CarouselIcon />}>
                    轮播布局
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              {viewMode === 'grid' && (
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="flat">
                      {columns} 列
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
              )}
            </div>
          </div>
        </motion.div>

        {/* 图片展示区域 */}
        <LayoutGroup>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingSkeleton viewMode={viewMode} columns={columns} />
            ) : (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={layoutConfig[viewMode]}
              >
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.05,
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                    className={`
                      ${viewMode === 'masonry' ? 'mb-6 break-inside-avoid' : ''}
                      ${viewMode === 'carousel' ? 'snap-center min-w-[300px]' : ''}
                    `}
                  >
                    <ImageCard
                      image={image}
                      onShowDetails={() => setDetailsImage(image)}
                      onImageClick={() => setViewerImage(image)}
                      index={index}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>

        {/* 无结果提示 */}
        <AnimatePresence>
          {!isLoading && images.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <p className="text-xl text-default-500 mb-4">没有找到匹配的图片</p>
              <Button
                color="primary"
                variant="shadow"
                className="font-semibold"
              >
                清除所有筛选
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 分页或加载更多 */}
        {totalPages > 1 && (
          <motion.div 
            className="flex justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
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
              classNames={{
                wrapper: "gap-2",
                item: "w-10 h-10",
                cursor: "bg-gradient-to-r from-primary to-secondary"
              }}
            />
          </motion.div>
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
    </ScrollShadow>
  );
};

// 加载骨架屏组件
const LoadingSkeleton: React.FC<{ viewMode: string; columns: number }> = ({ viewMode, columns }) => (
  <div className={
    viewMode === 'grid'
      ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`
      : viewMode === 'masonry'
      ? 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6'
      : 'flex overflow-x-auto gap-6'
  }>
    {Array.from({ length: 8 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`
          w-full h-64 bg-default-100 rounded-lg
          ${viewMode === 'carousel' ? 'min-w-[300px]' : ''}
        `}
        style={{
          animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) ${i * 0.1}s infinite`
        }}
      />
    ))}
  </div>
);

// 图标组件
const GridIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const MasonryIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const CarouselIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

export default ImageGallery;