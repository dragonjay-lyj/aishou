// src/components/ArtistGrid.tsx
import React, { useState, useEffect } from 'react';
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { motion, AnimatePresence } from "framer-motion";
import { ArtistCard } from './ArtistCard';
import type { Artist, Platform } from '../types/artist';

interface ArtistGridProps {
  artists: Artist[];
}

export const ArtistGrid: React.FC<ArtistGridProps> = ({ artists }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'popular'>('date');
  const [isLoading, setIsLoading] = useState(true);

  // 过滤和排序画师
  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || 
      artist.socialLinks.some(link => link.platform === selectedPlatform);

    return matchesSearch && matchesPlatform;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      case 'popular':
        return (b.works?.length || 0) - (a.works?.length || 0);
      default:
        return 0;
    }
  });

  // 模拟加载效果
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedPlatform, selectedTags, sortBy]);

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8">
      {/* 过滤器和搜索栏 */}
      <div className="bg-default-50 rounded-xl p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="搜索画师..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={
              <svg className="w-5 h-5 text-default-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            className="w-full"
          />

          <Select
            placeholder="排序方式"
            selectedKeys={[sortBy]}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'popular')}
          >
            <SelectItem key="date">最新加入</SelectItem>
            <SelectItem key="name">名称</SelectItem>
            <SelectItem key="popular">作品数量</SelectItem>
          </Select>
        </div>

        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Chip
                key={tag}
                onClose={() => setSelectedTags(tags => tags.filter(t => t !== tag))}
                variant="flat"
                className="bg-primary/20"
              >
                {tag}
              </Chip>
            ))}
            <Button
              size="sm"
              variant="light"
              onClick={() => setSelectedTags([])}
            >
              清除全部
            </Button>
          </div>
        )}
      </div>

      {/* 画师网格 */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-[300px] bg-default-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredArtists.map((artist) => (
              <motion.div
                key={artist.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ArtistCard artist={artist} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 无结果提示 */}
      {!isLoading && filteredArtists.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-xl text-default-500">没有找到匹配的画师</p>
          <Button
            color="primary"
            variant="light"
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setSelectedPlatform('all');
              setSelectedTags([]);
            }}
          >
            清除所有筛选
          </Button>
        </motion.div>
      )}
    </div>
  );
};
