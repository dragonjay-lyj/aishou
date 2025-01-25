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
  type: 'content',
  schema: z.object({
    artistId: z.string(),
    title: z.string(),
    type: z.enum(['novel', 'gallery']),
    description: z.string().optional(),
    thumbnail: z.string(),
    // 为小说类型添加特定字段
    content: z.string().optional(), // 小说内容
    status: z.enum(['ongoing', 'completed', 'hiatus']).optional(),
    chapter: z.number().optional(),
    // 图集字段
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
    })).optional(), // 使其可选，因为小说可能不需要
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
