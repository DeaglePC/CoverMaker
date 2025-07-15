// 本地存储工具函数
const STORAGE_KEY = 'cover_maker_settings';

// 定义需要保存的参数类型
export interface SavedSettings {
  // 文字相关参数
  title: string;
  content: string;
  textColor: string;
  textVAlign: 'top' | 'center' | 'bottom';
  textHAlign: 'left' | 'center' | 'right';
  titleSize: number;
  contentSize: number;
  fontFamily: string;
  titleContentSpacing: number;
  textOffsetX: number;
  textOffsetY: number;
  
  // 背景相关参数
  textBackgroundEnabled: boolean;
  textBackgroundColor: string;
  textBackgroundOpacity: number;
  isMagicColorMode: boolean;
  
  // 图片相关参数
  aspect: number;
  borderRadius: number;
  zoom: number;
  
  // 边框相关参数
  borderEnabled: boolean;
  borderWidth: number; // 固定默认值，实际使用时会基于图片宽度的1%动态计算
  borderColor: string;
  isBorderMagicColorMode: boolean;
  isBorderTransparent: boolean;
}

// 默认设置
export const defaultSettings: SavedSettings = {
  title: '这里是标题',
  content: '这里是正文内容，可以根据需要修改。',
  textColor: '#ffffff',
  textVAlign: 'bottom',
  textHAlign: 'center',
  titleSize: 100,
  contentSize: 50,
  fontFamily: 'Microsoft YaHei, sans-serif',
  titleContentSpacing: 100,
  textOffsetX: 0,
  textOffsetY: 0,
  textBackgroundEnabled: true,
  textBackgroundColor: '#000000',
  textBackgroundOpacity: 66,
  isMagicColorMode: true,
  aspect: 3 / 4,
  borderRadius: 80,
  zoom: 1,
  borderEnabled: false,
  borderWidth: 4, // 备用默认值，实际使用时为裁剪后图片宽度的1%
  borderColor: '#ffffff',
  isBorderMagicColorMode: false,
  isBorderTransparent: false,
};

// 保存设置到本地存储
export const saveSettings = (settings: SavedSettings): void => {
  try {
    const settingsJson = JSON.stringify(settings);
    localStorage.setItem(STORAGE_KEY, settingsJson);
    console.log('设置已保存到本地存储');
  } catch (error) {
    console.error('保存设置失败:', error);
  }
};

// 从本地存储读取设置
export const loadSettings = (): SavedSettings => {
  try {
    const settingsJson = localStorage.getItem(STORAGE_KEY);
    if (settingsJson) {
      const loadedSettings = JSON.parse(settingsJson);
      // 确保所有必要的字段都存在，如果有缺失则使用默认值
      const mergedSettings = { ...defaultSettings, ...loadedSettings };
      console.log('从本地存储加载设置:', mergedSettings);
      return mergedSettings;
    }
  } catch (error) {
    console.error('加载设置失败:', error);
  }
  
  console.log('使用默认设置');
  return defaultSettings;
};

// 清除本地存储的设置
export const clearSettings = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('本地存储的设置已清除');
  } catch (error) {
    console.error('清除设置失败:', error);
  }
}; 