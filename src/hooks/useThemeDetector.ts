// src/hooks/useThemeDetector.ts
import { useState, useEffect } from 'react';

export const useThemeDetector = () => {
  // 检查系统主题
  const getCurrentTheme = () => {
    if (typeof window === 'undefined') return 'light';
    
    // 检查系统主题偏好
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // 检查当前时间
    const hours = new Date().getHours();
    if (hours >= 19 || hours <= 6) {
      return 'dark';
    }
    
    return 'light';
  };

  const [theme, setTheme] = useState(getCurrentTheme());

  useEffect(() => {
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setTheme(getCurrentTheme());
    
    mediaQuery.addEventListener('change', handleChange);
    
    // 定时检查时间变化
    const timeInterval = setInterval(() => {
      setTheme(getCurrentTheme());
    }, 60000); // 每分钟检查一次

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      clearInterval(timeInterval);
    };
  }, []);

  return theme;
};
