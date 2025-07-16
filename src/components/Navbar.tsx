import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { theme, setTheme, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const getThemeIcon = (themeType: string) => {
    if (themeType === 'auto') {
      return '🌓'; // 自动模式图标
    }
    return themeType === 'dark' ? '🌙' : '☀️';
  };

  const getDisplayText = (themeType: string) => {
    if (themeType === 'auto') {
      return `自动 (${isDark ? '夜晚' : '白天'})`;
    }
    return themeType === 'dark' ? '夜晚' : '白天';
  };

  // 点击外部关闭下拉列表
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const themeOptions = [
    { value: 'light', label: '白天', icon: '☀️' },
    { value: 'dark', label: '夜晚', icon: '🌙' },
    { value: 'auto', label: '自动', icon: '🌓' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>封面制作器</h1>
        </div>
        
        <div className="navbar-actions">
          <div className="theme-selector" ref={dropdownRef}>
            <div 
              className={`theme-selector-button ${isOpen ? 'open' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              title="选择主题模式"
            >
              <span className="theme-icon">{getThemeIcon(theme)}</span>
              <span className="theme-text">{getDisplayText(theme)}</span>
              <span className="theme-arrow">▼</span>
            </div>
            
            {isOpen && (
              <div className="theme-dropdown">
                {themeOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`theme-option ${theme === option.value ? 'selected' : ''}`}
                    onClick={() => handleThemeChange(option.value as 'light' | 'dark' | 'auto')}
                  >
                    <span className="option-icon">{option.icon}</span>
                    <span className="option-label">
                      {option.value === 'auto' ? `自动 (${isDark ? '夜晚' : '白天'})` : option.label}
                    </span>
                    {theme === option.value && <span className="option-check">✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 