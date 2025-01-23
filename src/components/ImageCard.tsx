// src/components/ImageCard.tsx
import React, { useState } from 'react';
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryImage } from '../types/gallery';
import { ImageActions } from './ImageActions';

interface ImageCardProps {
  image: GalleryImage;
  onShowDetails: (image: GalleryImage) => void;
  onImageClick: (image: GalleryImage) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onShowDetails,
  onImageClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div> {/* 使用普通的 div 替代 motion.div */}
      <Card
        isPressable
        className="group relative transition-all duration-500 hover:shadow-xl"
        as="div"
        onPress={() => onImageClick(image)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardBody className="p-0 overflow-hidden">
          <div className="relative w-full h-64 overflow-hidden">
            {/* 加载骨架屏 */}
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-default-200 animate-pulse" />
            )}

            <Image
              src={image.src}
              alt={image.alt}
              className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110 blur-[2px]' : 'scale-100'}`}
              radius="none"
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>
        </CardBody>

        <CardFooter className="flex justify-between items-center px-4 py-3 bg-default-50/50 backdrop-blur-sm">
          <div>
            <p className="text-small font-semibold">{image.artist}</p>
            <p className="text-tiny text-default-500">{image.source}</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              color="primary"
              variant="shadow"
              onPress={(e) => {
                onShowDetails(image);
              }}
              className="font-semibold"
            >
              查看详情
            </Button>
            </div>
          <ImageActions image={image} />
        </CardFooter>

        {/* 统计信息 */}
        <div className="absolute top-2 right-2 flex gap-2">
          {image.views && (
            <Chip
              size="sm"
              variant="flat"
              className="bg-black/50 backdrop-blur-md text-white"
            >
              👁️ {image.views}
            </Chip>
          )}
          {image.likes && (
            <Chip
              size="sm"
              variant="flat"
              className="bg-black/50 backdrop-blur-md text-white"
            >
              ❤️ {image.likes}
            </Chip>
          )}
        </div>
      </Card>
    </div>
  );
};