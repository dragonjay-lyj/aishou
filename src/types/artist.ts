// src/types/artist.ts
export type Platform = 'Fanbox' | 'Patreon' | 'Pixiv' | 'Twitter' | 'ArtStation';

export interface SocialLink {
  platform: Platform;
  url: string;
  username: string;
}

export interface ArtistWork {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  images: {
    url: string;
    caption?: string;
    isNSFW?: boolean;
    resolutions?: {
      original?: string;
      high?: string;
      medium?: string;
      low?: string;
    };
  }[];
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
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  background: string;
  description: string;
  socialLinks: SocialLink[];
  works: ArtistWork[];
  featured: boolean;
  joinDate: string;
}
