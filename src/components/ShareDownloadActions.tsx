// src/components/works/ShareDownloadActions.tsx
import React, { useState } from 'react';
import { Button } from "@nextui-org/button";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { Tooltip } from "@nextui-org/tooltip";
import { Input } from "@nextui-org/input";
import type { WorkContent } from '../types/work';

interface ShareDownloadActionsProps {
  work: WorkContent & { artistName?: string }; // 添加可选的 artistName
  onDownloadCount?: () => void;
}

export const ShareDownloadActions: React.FC<ShareDownloadActionsProps> = ({ 
  work,
  onDownloadCount 
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // 生成分享链接
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  // 分享平台配置
  const TwitterIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  );

  const FacebookIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  const LineIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
    </svg>
  );

  const LinkIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );

  // 分享平台配置
  const sharePlatforms = [
    {
      name: 'Twitter',
      icon: <TwitterIcon />,
      action: () => {
        const text = `Check out "${work.title}"${work.artistName ? ` by ${work.artistName}` : ''}\n${shareUrl}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
      }
    },
    {
      name: 'Facebook',
      icon: <FacebookIcon />,
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
      }
    },
    {
      name: 'Line',
      icon: <LineIcon />,
      action: () => {
        window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`);
      }
    },
    {
      name: 'Copy Link',
      icon: <LinkIcon />,
      action: async () => {
        try {
          await navigator.clipboard.writeText(shareUrl);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      }
    }
  ];

  return (
    <div className="flex gap-2">
      {/* 分享按钮 */}
      <Button
        variant="flat"
        color="primary"
        onPress={() => setShowShareModal(true)}
        startContent={<ShareIcon />}
      >
        分享
      </Button>

      {/* 分享模态框 */}
      <Modal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)}
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>分享作品</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  {/* 分享链接 */}
                  <div className="flex gap-2">
                    <Input
                      value={shareUrl}
                      readOnly
                      className="flex-grow"
                    />
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={sharePlatforms[3].action}
                    >
                      {copySuccess ? '已复制!' : '复制'}
                    </Button>
                  </div>

                  {/* 分享平台 */}
                  <div className="flex justify-center gap-4">
                    {sharePlatforms.slice(0, 3).map((platform) => (
                      <Tooltip key={platform.name} content={platform.name}>
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={platform.action}
                        >
                          {platform.icon}
                        </Button>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  );
};

// 图标组件
const ShareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

// 其他社交平台图标...
