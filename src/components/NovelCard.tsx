import React from 'react';
import { Card, CardBody } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Chip } from "@nextui-org/chip";
import { Link } from "@nextui-org/link";
import type { NovelContent } from '../types/novel';
import { motion } from "framer-motion";

interface NovelCardProps {
  novel: NovelContent;
  artist: {
    name: string;
    avatar: string;
  };
  stats: {
    wordCount: number;
    readingTime: number;
  };
}

export const NovelCard: React.FC<NovelCardProps> = ({ novel, artist, stats }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card 
        isPressable
        className="w-full bg-gradient-to-r from-background/60 to-background/30 backdrop-blur-md 
                   border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300
                   dark:bg-gradient-to-r dark:from-background/80 dark:to-background/60"
        as={Link}
        href={`/artists/${novel.artistId}/novels/${novel.id}`}
      >
        <CardBody className="p-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cover Image */}
            <div className="relative aspect-[3/4] md:aspect-[2/3] overflow-hidden">
              <img
                src={novel.cover}
                alt={novel.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {novel.isNSFW && (
                <Chip
                  size="sm"
                  color="danger"
                  variant="shadow"
                  className="absolute top-2 right-2 animate-pulse"
                >
                  NSFW
                </Chip>
              )}
            </div>

            {/* Novel Info */}
            <div className="col-span-1 md:col-span-2 p-4 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-bold mb-2 line-clamp-2 
                             bg-clip-text text-transparent bg-gradient-to-r 
                             from-primary to-secondary">
                  {novel.title}
                </h3>
                <div className="flex items-center gap-2 group">
                  <Avatar
                    src={artist.avatar}
                    size="sm"
                    className="ring-2 ring-primary group-hover:ring-secondary transition-all duration-300"
                  />
                  <span className="text-default-600 group-hover:text-primary transition-colors duration-300">
                    {artist.name}
                  </span>
                </div>
              </div>

              <p className="text-default-600 line-clamp-3 text-sm md:text-base
                          hover:line-clamp-none transition-all duration-300">
                {novel.description}
              </p>

              <div className="flex flex-col md:flex-row justify-between gap-2 md:items-center 
                            text-small text-default-500">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    {stats.wordCount.toLocaleString()} 字
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    约 {stats.readingTime} 分钟
                  </span>
                </div>
                <Chip
                  size="sm"
                  variant="shadow"
                  className="transition-colors duration-300"
                  color={
                    novel.status === 'completed' ? 'success' :
                    novel.status === 'ongoing' ? 'primary' : 'default'
                  }
                >
                  {novel.status === 'completed' ? '已完结' :
                   novel.status === 'ongoing' ? '连载中' : '暂停'}
                </Chip>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
