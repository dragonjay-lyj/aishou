// src/components/GalleryFilters.tsx
import React, { useState } from 'react';
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { motion, AnimatePresence } from "framer-motion";
import { type FilterOptions } from '../types/gallery';

interface GalleryFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
}

export const GalleryFilters: React.FC<GalleryFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const styles = [
    "全部", "奇幻", "写实", "动漫", "科幻", "抽象", "水彩",
    "油画", "像素", "赛博朋克", "暗黑", "萌系"
  ];

  return (
    <motion.div 
      className="bg-default-50 rounded-xl p-4 space-y-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 主要过滤器 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative group">
          <Input
            className="w-full"
            placeholder="搜索图片..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            startContent={
              <svg className="w-5 h-5 text-default-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            endContent={
              filters.searchQuery && (
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onClick={() => onFilterChange({ searchQuery: '' })}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              )
            }
          />
        </div>

        <Dropdown>
          <DropdownTrigger>
            <Button 
              variant="flat" 
              className="w-full justify-between"
              endContent={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              }
            >
              画风: {filters.style || '全部'}
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            {styles.map((style) => (
              <DropdownItem
                key={style}
                className="capitalize"
                onClick={() => onFilterChange({ style })}
              >
                {style}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        <Select
          className="w-full"
          placeholder="排序方式"
          selectedKeys={filters.sortBy ? [filters.sortBy] : []}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
        >
          <SelectItem key="newest">最新发布</SelectItem>
          <SelectItem key="oldest">最早发布</SelectItem>
          <SelectItem key="popular">最受欢迎</SelectItem>
          <SelectItem key="views">最多浏览</SelectItem>
        </Select>
      </div>

      {/* 展开的高级过滤器 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-default-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 添加更多过滤选项 */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 展开/收起按钮 */}
      <div className="flex justify-center">
        <Button
          variant="light"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          endContent={
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          }
        >
          {isExpanded ? '收起高级筛选' : '展开高级筛选'}
        </Button>
      </div>

      {/* 已选择的过滤器标签 */}
      {(filters.searchQuery || filters.style !== '全部' || filters.sortBy) && (
        <motion.div 
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filters.searchQuery && (
            <Chip
              onClose={() => onFilterChange({ searchQuery: '' })}
              variant="flat"
              color="primary"
            >
              搜索: {filters.searchQuery}
            </Chip>
          )}
          {filters.style !== '全部' && (
            <Chip
              onClose={() => onFilterChange({ style: '全部' })}
              variant="flat"
              color="secondary"
            >
              画风: {filters.style}
            </Chip>
          )}
          {filters.sortBy && (
            <Chip
              onClose={() => onFilterChange({ sortBy: undefined })}
              variant="flat"
              color="warning"
            >
              排序: {
                {
                  'newest': '最新发布',
                  'oldest': '最早发布',
                  'popular': '最受欢迎',
                  'views': '最多浏览'
                }[filters.sortBy]
              }
            </Chip>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
