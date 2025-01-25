// src/components/ImageModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Image } from "@nextui-org/image";
import { Card } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Progress } from "@nextui-org/progress";
import { Tooltip } from "@nextui-org/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { ImageActions } from './ImageActions';
import type { GalleryImage } from '../types/gallery';

interface ImageModalProps {
  image: GalleryImage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, isOpen, onClose }) => {
  const [selectedTab, setSelectedTab] = useState("analysis");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 重置状态
  useEffect(() => {
    if (isOpen) {
      setIsImageLoaded(false);
      setIsZoomed(false);
      setImageError(false);
    }
  }, [isOpen, image]);

  if (!image) return null;

  const analysisScores = {
    composition: 85,
    color: 92,
    lighting: 88,
    technique: 90,
    overall: 89
  };

  return (
    <Modal 
      size="4xl" 
      isOpen={isOpen} 
      onClose={onClose}
      scrollBehavior="inside"
      backdrop="blur"
      className="bg-background/95"
      motionProps={{
        variants: {
          enter: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" },
          },
          exit: {
            scale: 0.95,
            opacity: 0,
            transition: { duration: 0.2, ease: "easeIn" },
          },
        }
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <motion.div 
                className="w-full space-y-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {image.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Tooltip content="查看次数">
                      <Chip
                        size="sm"
                        variant="flat"
                        className="bg-default-100/50 backdrop-blur-md"
                        startContent={
                          <motion.span whileHover={{ scale: 1.2 }}>👁️</motion.span>
                        }
                      >
                        {image.views?.toLocaleString() || 0}
                      </Chip>
                    </Tooltip>
                    <Tooltip content={isLiked ? '取消点赞' : '点赞'}>
                      <Chip
                        size="sm"
                        variant="flat"
                        className={`
                          cursor-pointer transition-colors
                          ${isLiked ? 'bg-danger/20 text-danger' : 'bg-default-100/50'}
                        `}
                        startContent={
                          <motion.span 
                            whileHover={{ scale: 1.2 }}
                            onClick={() => setIsLiked(!isLiked)}
                          >
                            {isLiked ? '❤️' : '🤍'}
                          </motion.span>
                        }
                      >
                        {((image.likes || 0) + (isLiked ? 1 : 0)).toLocaleString()}
                      </Chip>
                    </Tooltip>
                  </div>
                </div>
                <div className="flex items-center justify-between text-small text-default-500">
                  <div className="flex items-center gap-2">
                    <span>by {image.artist}</span>
                    <span>•</span>
                    <span>{new Date(image.createdAt || '').toLocaleDateString()}</span>
                  </div>
                  <ImageActions image={image} />
                </div>
              </motion.div>
            </ModalHeader>

            <ModalBody>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 图片区域 */}
                <motion.div layout className="relative">
                  <Card className="p-2 bg-default-50/50 backdrop-blur-sm">
                    <div 
                      className={`
                        relative overflow-hidden cursor-zoom-in
                        ${isZoomed ? 'aspect-auto' : 'aspect-square'}
                      `}
                      onClick={() => setIsZoomed(!isZoomed)}
                    >
                      <AnimatePresence>
                        {!isImageLoaded && !imageError && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0"
                          >
                            <div className="w-full h-full animate-pulse bg-gradient-to-r from-default-200 via-default-100 to-default-200" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {!imageError ? (
                        <motion.div
                          animate={{
                            scale: isZoomed ? 1.5 : 1,
                            transition: { duration: 0.3 }
                          }}
                        >
                          <Image
                            src={image.src}
                            alt={image.title}
                            className="w-full h-full object-cover rounded-lg"
                            onLoad={() => setIsImageLoaded(true)}
                            onError={() => setImageError(true)}
                          />
                        </motion.div>
                      ) : (
                        <div className="flex items-center justify-center h-full bg-danger-50 rounded-lg">
                          <p className="text-danger">图片加载失败</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>

                {/* 内容区域 */}
                <motion.div 
                  layout
                  className="space-y-4"
                >
                  <Tabs 
                    selectedKey={selectedTab}
                    onSelectionChange={(key) => setSelectedTab(key as string)}
                    variant="bordered"
                    aria-label="Image details"
                    classNames={{
                      tabList: "gap-4",
                      cursor: "w-full bg-primary",
                      tab: "max-w-fit px-4 h-10",
                      tabContent: "group-data-[selected=true]:text-primary"
                    }}
                  >
                    <Tab
                      key="analysis"
                      title={
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📊</span>
                          分析
                        </div>
                      }
                    >
                      <Card className="p-4 space-y-4">
                        {Object.entries(analysisScores).map(([key, value], index) => (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ 
                              opacity: 1, 
                              x: 0,
                              transition: { delay: index * 0.1 }
                            }}
                            className="space-y-2"
                          >
                            <div className="flex justify-between items-center">
                              <span className="capitalize">{key}</span>
                              <span className="text-primary font-bold">{value}%</span>
                            </div>
                            <Progress
                              value={value}
                              color="primary"
                              className="h-2"
                              showValueLabel={false}
                            />
                          </motion.div>
                        ))}
                      </Card>
                    </Tab>
                    <Tab
                      key="details"
                      title={
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📝</span>
                          详情
                        </div>
                      }
                    >
                      <Card className="p-4">
                        <div className="space-y-4">
                          <p className="text-default-600">{image.alt}</p>
                          {/* 添加更多详细信息 */}
                        </div>
                      </Card>
                    </Tab>
                  </Tabs>
                </motion.div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                color="primary"
                variant="ghost"
                onPress={() => window.open(image.src, '_blank')}
                startContent={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                }
              >
                查看原图
              </Button>
              <Button 
                color="danger" 
                variant="light" 
                onPress={onClose}
                startContent={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
              >
                关闭
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};