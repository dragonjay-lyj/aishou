// src/components/artists/WorksList.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from '@nextui-org/button'
import { Image } from "@nextui-org/image";
import { Pagination } from "@nextui-org/pagination";
import { Chip } from "@nextui-org/chip";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { motion, AnimatePresence } from "framer-motion";
import type { ArtistWork } from '../types/artist';

interface WorksListProps {
  works: ArtistWork[];
}

export const WorksList: React.FC<WorksListProps> = ({ works }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'popular'>('date');
  const [isLoading, setIsLoading] = useState(true);
  
  const itemsPerPage = 12;

  // 过滤和排序作品
  const filteredWorks = works
    .filter(work => {
      const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlatform = selectedPlatform === 'all' || work.platform === selectedPlatform;
      return matchesSearch && matchesPlatform;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popular':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage);
  const currentWorks = filteredWorks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 模拟加载效果
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedPlatform, sortBy, currentPage]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* 过滤器 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="搜索作品..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full"
        />
        <Select
          placeholder="排序方式"
          selectedKeys={[sortBy]}
          onChange={(e) => {
            setSortBy(e.target.value as 'date' | 'title' | 'popular');
            setCurrentPage(1);
          }}
        >
          <SelectItem key="date">最新发布</SelectItem>
          <SelectItem key="title">标题排序</SelectItem>
          <SelectItem key="popular">最受欢迎</SelectItem>
        </Select>
      </div>

      {/* 作品网格 */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <div
                key={index}
                className="w-full aspect-[3/4] bg-default-100 rounded-lg animate-pulse"
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {currentWorks.map((work, index) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <WorkCard work={work} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 无结果提示 */}
      {!isLoading && currentWorks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-xl text-default-500 mb-4">没有找到匹配的作品</p>
          <Button
            color="primary"
            variant="flat"
            onPress={() => {
              setSearchQuery('');
              setSelectedPlatform('all');
              setSortBy('date');
            }}
          >
            清除筛选
          </Button>
        </motion.div>
      )}

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
            showControls
            color="primary"
            size="lg"
            className="gap-2"
            radius="lg"
          />
        </div>
      )}
    </div>
  );
};

// WorkCard 组件保持不变...

// 作品卡片组件
const WorkCard: React.FC<{ work: ArtistWork }> = ({ work }) => {

  // 处理作品路径
  const getWorkPath = (work: ArtistWork) => {
    const artistId = work.artistId.replace(/\.(mdx|md)$/, '');
    // 移除artistId前缀和扩展名
    const workId = work.id.replace(`${artistId}/`, '').replace(/\.(mdx|md)$/, '');
    return `/artists/${artistId}/works/${workId}`;
  };

  return (
    <Card isPressable className="group" onPress={() => window.location.href = getWorkPath(work)}>
      <CardBody className="p-0">
        <div className="relative">
          <Image
            src={work.thumbnail}
            alt={work.title}
            className="w-full aspect-[3/4] object-cover"
            classNames={{
              wrapper: "overflow-hidden",
              img: "group-hover:scale-110 transition-transform duration-300"
            }}
          />
          {work.isNSFW && (
            <Chip
              size="sm"
              color="danger"
              variant="flat"
              className="absolute top-2 right-2"
            >
              NSFW
            </Chip>
          )}
          {work.tier && (
            <Chip
              size="sm"
              color="primary"
              variant="flat"
              className="absolute top-2 left-2"
            >
              {work.tier}
            </Chip>
          )}
        </div>
      </CardBody>
      <CardFooter className="flex flex-col items-start gap-2">
        <h3 className="font-semibold line-clamp-2">{work.title}</h3>
        <div className="flex justify-between items-center w-full mt-2">
          <span className="text-small text-default-500">
            {new Date(work.publishDate).toLocaleDateString()}
          </span>
          <Chip size="sm" variant="flat" color="secondary">
            {work.platform}
          </Chip>
        </div>
      </CardFooter>
    </Card>
  );
};
