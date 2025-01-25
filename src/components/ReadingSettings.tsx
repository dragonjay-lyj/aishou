// src/components/novels/ReadingSettings.tsx
import React, { useState, useEffect } from 'react';
import { Slider } from "@nextui-org/slider";
import { Switch } from "@nextui-org/switch";
import type { ReadingSettings as ReadingSettingsType } from '../types/novel';

interface ReadingSettingsProps {
  onChange: (settings: ReadingSettingsType) => void;
}

export const ReadingSettingsPanel: React.FC<ReadingSettingsProps> = ({ onChange }) => {
  const [settings, setSettings] = useState<ReadingSettingsType>(() => {
    if (typeof window === 'undefined') return { fontSize: 16, isDarkMode: false };
    const saved = localStorage.getItem('readingSettings');
    return saved ? JSON.parse(saved) : { fontSize: 16, isDarkMode: false };
  });

  useEffect(() => {
    localStorage.setItem('readingSettings', JSON.stringify(settings));
    onChange(settings);
  }, [settings, onChange]);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <span>字体大小</span>
        <Slider
          size="sm"
          step={1}
          minValue={12}
          maxValue={24}
          value={settings.fontSize}
          onChange={(value) => setSettings({ ...settings, fontSize: value as number })}
          className="w-32"
        />
      </div>
      <div className="flex items-center justify-between">
        <span>夜间模式</span>
        <Switch
          checked={settings.isDarkMode}
          onChange={(e) => setSettings({ ...settings, isDarkMode: e.target.checked })}
        />
      </div>
    </div>
  );
};