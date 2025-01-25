// src/components/common/ModeSwitch.tsx
import React, { useState } from 'react';
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { motion, AnimatePresence } from "framer-motion";

interface ModeSwitchProps {
  currentMode: 'artists' | 'gallery' | 'novels';
}

export const ModeSwitch: React.FC<ModeSwitchProps> = ({ currentMode }) => {
  const [isHovered, setIsHovered] = useState(false);

  const modes = [
    {
      id: 'artists',
      label: '画师模式',
      path: '/',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'gallery',
      label: 'AI画廊模式',
      path: '/gallery',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'novels',
      label: '小说模式',
      path: '/novels',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];

  const navigate = (path: string) => {
    // 添加页面过渡动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      window.location.href = path;
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="relative">
        {/* 主按钮 */}
        <Tooltip
          content="切换模式"
          placement="left"
          delay={0}
          closeDelay={0}
          className="text-sm"
        >
          <Button
            isIconOnly
            size="lg"
            className={`
              bg-background/80 backdrop-blur-lg shadow-lg
              hover:shadow-xl hover:scale-110
              transition-all duration-300
              dark:bg-default-100/50
              ${isHovered ? 'scale-110' : 'scale-100'}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              animate={{ rotate: isHovered ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {modes.find(mode => mode.id === currentMode)?.icon}
            </motion.div>
          </Button>
        </Tooltip>

        {/* 模式选择菜单 */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute bottom-full right-0 mb-2 space-y-2"
            >
              {modes
                .filter(mode => mode.id !== currentMode)
                .map((mode) => (
                  <motion.div
                    key={mode.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="w-full bg-background/80 backdrop-blur-lg shadow-lg
                               hover:shadow-xl hover:bg-primary/20
                               transition-all duration-300
                               dark:bg-default-100/50"
                      onPress={() => navigate(mode.path)}
                      startContent={mode.icon}
                    >
                      <span className="hidden md:inline">{mode.label}</span>
                    </Button>
                  </motion.div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 移动端底部导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background/80 backdrop-blur-lg border-t border-divider">
        <nav className="flex justify-around p-2">
          {modes.map((mode) => (
            <Button
              key={mode.id}
              isIconOnly
              variant="light"
              className={`
                transition-all duration-300
                ${currentMode === mode.id ? 'text-primary scale-110' : 'text-default-500'}
              `}
              onPress={() => navigate(mode.path)}
            >
              {mode.icon}
            </Button>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};