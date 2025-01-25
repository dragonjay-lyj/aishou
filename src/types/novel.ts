// src/types/novel.ts
// 将 ReadingSettings 改为 interface
export interface ReadingSettings {
  fontSize: number;
  isDarkMode: boolean;
  lastReadChapter?: string;
  lastReadPosition?: number;
}

export interface NovelContent {
  id: string;
  title: string;
  cover: string;
  description: string;
  artistId: string;
  publishDate: string;
  status?: 'ongoing' | 'completed' | 'hiatus';
  isNSFW?: boolean;
  type: 'novel'; // 明确指定为字面量类型
  platform?: string;
  tier?: string;
}

// src/types/novel.ts
export const calculateReadingStats = (content?: string) => {
  if (!content) {
    return {
      wordCount: 0,
      readingTime: 0,
    };
  }
  const cleanText = content.replace(/[#*`~>]/g, '').trim();
  const wordCount = cleanText.match(/[\u4e00-\u9fa5]|\b[a-zA-Z]+\b/g)?.length || 0;
  const readingTime = Math.ceil(wordCount / 300);
  
  return {
    wordCount,
    readingTime,
  };
};