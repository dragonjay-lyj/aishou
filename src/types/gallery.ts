// src/types/gallery.ts
export interface GalleryImage {
  id: string;
  title: string;
  src: string;
  alt: string;
  artist: string;
  source: string;
  createdAt: string;
  likes?: number;
  views?: number;
}

export interface FilterOptions {
  style?: string;
  sortBy?: 'newest' | 'oldest' | 'popular';
  searchQuery?: string;
}
