// src/components/ImageModal.tsx
import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Image } from "@nextui-org/image";
import { Card } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryImage } from '../types/gallery';

interface ImageModalProps {
  image: GalleryImage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, isOpen, onClose }) => {
  const [selectedTab, setSelectedTab] = useState("analysis");
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  if (!image) return null;

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
            y: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: { duration: 0.2, ease: "easeIn" },
          },
        }
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{image.title}</h2>
                <div className="flex items-center gap-2">
                  <Chip size="sm" variant="flat">
                    👁️ {image.views || 0}
                  </Chip>
                  <Chip size="sm" variant="flat" color="danger">
                    ❤️ {image.likes || 0}
                  </Chip>
                </div>
              </div>
              <p className="text-small text-default-500">
                by {image.artist} • {new Date(image.createdAt || '').toLocaleDateString()}
              </p>
            </ModalHeader>

            <ModalBody>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 图片区域 */}
                <Card className="p-2 bg-black/5">
                  <div className="relative aspect-square">
                    {!isImageLoaded && (
                      <div className="absolute inset-0 bg-default-200 animate-pulse rounded-lg" />
                    )}
                    <Image
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover rounded-lg"
                      onLoad={() => setIsImageLoaded(true)}
                    />
                  </div>
                </Card>

                {/* 内容区域 */}
                <div className="space-y-4">
                  <Tabs 
                    selectedKey={selectedTab}
                    onSelectionChange={(key) => setSelectedTab(key as string)}
                    variant="bordered"
                    aria-label="Image details"
                  >
                    <Tab key="analysis" title="图片分析">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={selectedTab}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-6 p-4"
                        >
                          <Card className="p-4 space-y-4">
                            <div>
                              <h3 className="text-lg font-bold mb-2">人物</h3>
                              <p className="text-default-600 leading-relaxed">
                                {image.content.character}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold mb-2">背景</h3>
                              <p className="text-default-600 leading-relaxed">
                                {image.content.background}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold mb-2">动作</h3>
                              <p className="text-default-600 leading-relaxed">
                                {image.content.aas}
                              </p>
                            </div>
                          </Card>
                        </motion.div>
                      </AnimatePresence>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                color="primary"
                variant="ghost"
                onPress={() => window.open(image.src, '_blank')}
              >
                查看原图
              </Button>
              <Button color="danger" variant="light" onPress={onClose}>
                关闭
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
