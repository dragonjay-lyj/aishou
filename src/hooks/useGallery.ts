// src/hooks/useGallery.ts
import { useState, useCallback, useMemo } from 'react';
import { type GalleryImage, type FilterOptions } from '../types/gallery';

export const useGallery = (initialImages: GalleryImage[]) => {
  const [images, setImages] = useState(initialImages);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredImages = useMemo(() => {
    let result = [...images];

    if (filters.searchQuery) {
      result = result.filter(image => 
        image.title.toLowerCase().includes(filters.searchQuery!.toLowerCase()) ||
        image.artist.toLowerCase().includes(filters.searchQuery!.toLowerCase())
      );
    }

    if (filters.sortBy) {
      result.sort((a, b) => {
        switch (filters.sortBy) {
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'popular':
            return (b.likes || 0) - (a.likes || 0);
          default:
            return 0;
        }
      });
    }

    return result;
  }, [images, filters]);

  const paginatedImages = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredImages.slice(start, start + itemsPerPage);
  }, [filteredImages, currentPage]);

  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);

  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  return {
    images: paginatedImages,
    totalPages,
    currentPage,
    setCurrentPage,
    updateFilters,
    filters
  };
};
