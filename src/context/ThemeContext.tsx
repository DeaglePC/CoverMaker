import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 从本地存储加载主题设置，默认为自动模式
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    return savedTheme || 'auto';
  });

  // 计算当前是否应该使用暗色主题
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    
    // 自动模式：根据当前时间判断
    const now = new Date();
    const hour = now.getHours();
    return hour >= 18 || hour < 6; // 晚上6点到早上6点使用暗色主题
  });

  // 保存主题设置到本地存储
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 处理自动模式的时间切换
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (theme === 'auto') {
      const updateTheme = () => {
        const now = new Date();
        const hour = now.getHours();
        const shouldBeDark = hour >= 18 || hour < 6;
        setIsDark(shouldBeDark);
      };

      // 立即更新一次
      updateTheme();

      // 每分钟检查一次时间变化
      interval = setInterval(updateTheme, 60000);
    } else {
      // 手动模式直接设置
      setIsDark(theme === 'dark');
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [theme]);

  // 应用主题到HTML根元素
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
  }, [isDark]);

  const value = {
    theme,
    setTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 