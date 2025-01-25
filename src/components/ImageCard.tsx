// src/components/ImageCard.tsx
import React, { useState } from 'react';
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Tooltip } from "@nextui-org/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryImage } from '../types/gallery';
import { ImageActions } from './ImageActions';

interface ImageCardProps {
  image: GalleryImage;
  onShowDetails: (image: GalleryImage) => void;
  onImageClick: (image: GalleryImage) => void;
  index: number; // 用于交错动画
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onShowDetails,
  onImageClick,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // 卡片入场动画
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card
        as="div"
        isPressable
        className="group relative h-full transition-all duration-500 hover:shadow-xl
                   bg-gradient-to-br from-background to-default-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardBody className="p-0 overflow-hidden">
          <div className="relative w-full aspect-[3/4] overflow-hidden">
            {/* 加载骨架屏 */}
            <AnimatePresence>
              {!isImageLoaded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-default-200"
                >
                  <div className="h-full w-full animate-pulse bg-gradient-to-r from-default-200 via-default-100 to-default-200" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* 图片 */}
            <motion.div
              animate={{
                scale: isHovered ? 1.1 : 1,
                filter: isHovered ? 'blur(2px)' : 'blur(0px)'
              }}
              transition={{ duration: 0.5 }}
              className="h-full"
              onClick={() => onImageClick(image)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                classNames={{
                  wrapper: "h-full",
                  img: "object-cover h-full w-full"
                }}
                onLoad={() => setIsImageLoaded(true)}
              />
            </motion.div>

            {/* 悬浮信息 */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm
                           flex flex-col justify-center items-center gap-4 p-4"
                >
                  <motion.h3
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    className="text-white text-xl font-bold text-center"
                  >
                    {image.title}
                  </motion.h3>
                  <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    className="flex gap-2"
                  >
                    <Button
                      size="sm"
                      color="primary"
                      variant="shadow"
                      onPress={() => onShowDetails(image)}
                      className="font-semibold"
                    >
                      查看详情
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardBody>

        <CardFooter className="flex justify-between items-center px-4 py-3 
                              bg-background/80 backdrop-blur-md border-t border-default-200">
          <div className="flex-1 min-w-0">
            <Tooltip content={image.artist}>
              <p className="text-small font-semibold truncate">
                {image.artist}
              </p>
            </Tooltip>
            <p className="text-tiny text-default-500 truncate">
              {image.source}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ImageActions image={image} />
          </div>
        </CardFooter>

        {/* 统计信息 */}
        <div className="absolute top-2 right-2 flex gap-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex gap-2"
          >
            {image.views && (
              <Chip
                size="sm"
                variant="flat"
                className="bg-black/50 backdrop-blur-md text-white"
                startContent={
                  <motion.span whileHover={{ scale: 1.2 }}>👁️</motion.span>
                }
              >
                {image.views.toLocaleString()}
              </Chip>
            )}
            {image.likes !== undefined && (
              <Chip
                size="sm"
                variant="flat"
                className={`
                  backdrop-blur-md cursor-pointer transition-colors
                  ${isLiked ? 'bg-danger/80 text-white' : 'bg-black/50 text-white'}
                `}
                startContent={
                  <motion.span 
                    whileHover={{ scale: 1.2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLiked(!isLiked);
                    }}
                  >
                    {isLiked ? '❤️' : '🤍'}
                  </motion.span>
                }
              >
                {(image.likes + (isLiked ? 1 : 0)).toLocaleString()}
              </Chip>
            )}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};