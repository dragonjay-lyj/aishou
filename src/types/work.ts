// src/types/work.ts
export type Platform = 'Fanbox' | 'Patreon' | 'Pixiv' | 'Twitter' | 'ArtStation';

export interface WorkImage {
  url: string;
  caption?: string;
  isNSFW?: boolean;
  resolutions?: {
    original?: string;
    high?: string;
    medium?: string;
    low?: string;
  };
}

export interface WorkContent {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  images: WorkImage[];
  platform: Platform;
  publishDate: string;
  updateDate?: string;
  isNSFW?: boolean;
  nsfwWarning?: string;
  tier?: string;
  likes?: number;
  views?: number;
  downloadCount?: number;
  originalSize?: string;
  artistId: string;
  content?: string; // 可选的 Markdown 内容
}
