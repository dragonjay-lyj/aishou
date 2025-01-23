// src/components/WorkDetail.tsx
import React, { useState } from 'react';
import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Divider } from "@nextui-org/divider";
import { motion, AnimatePresence } from "framer-motion";
import { ShareDownloadActions } from './ShareDownloadActions';
import type { WorkContent, WorkImage } from '../types/work';

interface WorkDetailProps {
  work: WorkContent;
  children?: React.ReactNode;
}

export const WorkDetail: React.FC<WorkDetailProps> = ({ work, children }) => {
  const [selectedImage, setSelectedImage] = useState<WorkImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full overflow-visible">
        <CardBody className="p-6 space-y-8">
          {/* 标题和操作栏 */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-2"
              >
                {work.title}
              </motion.h1>
            </div>
            <ShareDownloadActions work={work} />
          </div>

          <Divider />

          {/* NSFW警告 */}
          <AnimatePresence>
            {work.isNSFW && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-danger-50 border border-danger-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-danger-100 rounded-lg">
                    </div>
                    <div>
                      <h3 className="text-danger font-bold text-lg mb-2">
                        内容警告
                      </h3>
                      <p className="text-danger-600">
                        {work.nsfwWarning || '此内容包含成人内容，请确认您已年满18岁。'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 图片网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {work.images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <Card
                  isPressable
                  onPress={() => setSelectedImage(image)}
                  className="overflow-hidden"
                >
                  <Image
                    src={image.url}
                    alt={image.caption || `Image ${index + 1}`}
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                    onLoad={() => setIsLoading(false)}
                  />
                  {image.caption && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <p className="text-white text-center">
                        {image.caption}
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Markdown 内容 */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {children}
          </div>

          {/* 统计信息 */}
          <div className="flex flex-wrap gap-6 justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2 text-default-500"
            >
              <span>{work.views || 0} 次浏览</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2 text-default-500"
            >
              <span>{work.likes || 0} 次点赞</span>
            </motion.div>
            {work.downloadCount !== undefined && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 text-default-500"
              >
                <span>{work.downloadCount} 次下载</span>
              </motion.div>
            )}
          </div>
        </CardBody>
      </Card>

    </div>
  );
};
