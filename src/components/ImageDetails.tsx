// src/components/ImageDetails.tsx
import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Image } from "@nextui-org/image";
import { Chip } from "@nextui-org/chip";
import type { GalleryImage } from '../types/gallery';
import TwikooComment from './TwikooComments';

interface ImageDetailsProps {
  image: GalleryImage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageDetails: React.FC<ImageDetailsProps> = ({
  image,
  isOpen,
  onClose,
}) => {
  const [selectedTab, setSelectedTab] = useState("content");
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
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        }
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold">{image.title}</h2>
            </ModalHeader>

            <ModalBody>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 图片展示区 */}
                <div className="relative">
                  {!isImageLoaded && (
                    <div className="absolute inset-0 bg-default-200 animate-pulse rounded-lg" />
                  )}
                  <Image
                    src={image.src}
                    alt={image.title}
                    className="w-full rounded-lg shadow-lg"
                    onLoad={() => setIsImageLoaded(true)}
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Chip size="sm" variant="flat" className="bg-black/50 backdrop-blur-md text-white">
                      👁️ {image.views || 0}
                    </Chip>
                    <Chip size="sm" variant="flat" className="bg-black/50 backdrop-blur-md text-white">
                      ❤️ {image.likes || 0}
                    </Chip>
                  </div>
                </div>

                {/* 内容展示区 */}
                <div className="space-y-6">
                  <Tabs 
                    selectedKey={selectedTab}
                    onSelectionChange={(key) => setSelectedTab(key as string)}
                    variant="bordered"
                    className="w-full"
                  >
                    <Tab key="metadata" title="元数据">
                    <TwikooComment envId="https://twikoo.dragonjay.top" path={image.id} />
                    </Tab>
                  </Tabs>

                  <div className="flex justify-between items-center">
                    <div className="text-small text-default-500">
                      发布于 {new Date(image.createdAt || '').toLocaleDateString()}
                    </div>
                    <Button
                      color="primary"
                      variant="ghost"
                      onPress={() => window.open(image.src, '_blank')}
                    >
                      查看原图
                    </Button>
                  </div>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
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
