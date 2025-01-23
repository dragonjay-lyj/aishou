// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const platforms = ['Fanbox', 'Patreon', 'Pixiv', 'Twitter', 'ArtStation'] as const;

// AI画廊集合
const galleryCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    src: z.string(),
    alt: z.string(),
    artist: z.string(),
    source: z.string(),
    createdAt: z.string().optional(),
    likes: z.number().optional(),
    views: z.number().optional(),
  }),
});

// 画师集合
const artistsCollection = defineCollection({
  schema: z.object({
    name: z.string(),
    avatar: z.string(),
    background: z.string(),
    description: z.string(),
    socialLinks: z.array(z.object({
      platform: z.enum(platforms),
      url: z.string().url(),
      username: z.string(),
    })),
    featured: z.boolean().default(false),
    joinDate: z.string(),
  }),
});

// 作品集合
const worksCollection = defineCollection({
  schema: z.object({
    artistId: z.string(),
    title: z.string(),
    description: z.string().optional(),
    thumbnail: z.string(),
    images: z.array(z.object({
      url: z.string(),
      caption: z.string().optional(),
      isNSFW: z.boolean().optional(),
      resolutions: z.object({
        original: z.string().optional(),
        high: z.string().optional(),
        medium: z.string().optional(),
        low: z.string().optional(),
      }).optional(),
    })),
    platform: z.enum(platforms),
    publishDate: z.string(),
    updateDate: z.string().optional(),
    isNSFW: z.boolean().default(false),
    nsfwWarning: z.string().optional(),
    tier: z.string().optional(),
    likes: z.number().optional(),
    views: z.number().optional(),
    downloadCount: z.number().optional(),
    originalSize: z.string().optional(),
  }),
});

export const collections = {
  gallery: galleryCollection,
  artists: artistsCollection,
  works: worksCollection,
};
