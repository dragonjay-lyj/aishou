// src/components/common/ModeSwitch.tsx
import React from 'react';
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";

interface ModeSwitchProps {
  currentMode: 'artists' | 'gallery';
}

export const ModeSwitch: React.FC<ModeSwitchProps> = ({ currentMode }) => {
  const navigate = (mode: 'artists' | 'gallery') => {
    window.location.href = mode === 'artists' ? '/' : '/gallery';
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Tooltip
        content={currentMode === 'artists' ? '切换到AI画廊模式' : '切换到画师模式'}
        placement="left"
      >
        <Button
          isIconOnly
          size="lg"
          className="bg-background/60 backdrop-blur-md shadow-lg"
          onPress={() => navigate(currentMode === 'artists' ? 'gallery' : 'artists')}
        >
          {currentMode === 'artists' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )}
        </Button>
      </Tooltip>
    </div>
  );
};
