// src/components/ImageActions.tsx
import React, { useEffect, useState } from 'react';
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import type { GalleryImage } from '../types/gallery';
import type { ButtonProps } from "@nextui-org/button";

type PressEvent = Parameters<NonNullable<ButtonProps['onPress']>>[0];

interface ImageActionsProps {
  image: GalleryImage;
}

export const ImageActions: React.FC<ImageActionsProps> = ({ image }) => {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  const handleDownload = async () => {
    try {
      const response = await fetch(image.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${image.title}.avif`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({
          title: image.title,
          text: `Check out this image: ${image.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex gap-1" onClick={stopPropagation}>
      <Tooltip content="下载图片">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={handleDownload}
          as="div"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </Button>
      </Tooltip>
      {canShare && (
        <Tooltip content="分享">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={handleShare}
            as="div"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          </Button>
        </Tooltip>
      )}
    </div>
  );
};
