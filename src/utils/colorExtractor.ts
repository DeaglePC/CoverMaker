import ColorThief from 'colorthief';

/**
 * 将RGB数组转换为十六进制颜色字符串
 */
export function rgbToHex(rgb: [number, number, number]): string {
  return '#' + rgb.map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * 从图片中提取主色调
 */
export async function extractDominantColor(imageSrc: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const dominantColor = colorThief.getColor(img);
        const hexColor = rgbToHex(dominantColor);
        resolve(hexColor);
      } catch (error) {
        console.error('提取主色调失败:', error);
        // 如果提取失败，返回默认颜色
        resolve('#333333');
      }
    };
    
    img.onerror = () => {
      console.error('图片加载失败');
      resolve('#333333');
    };
    
    img.src = imageSrc;
  });
}

/**
 * 从图片中提取调色板
 */
export async function extractColorPalette(imageSrc: string, colorCount: number = 5): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, colorCount);
        const hexColors = palette.map(color => rgbToHex(color));
        resolve(hexColors);
      } catch (error) {
        console.error('提取调色板失败:', error);
        // 如果提取失败，返回默认调色板
        resolve(['#333333', '#666666', '#999999', '#cccccc', '#ffffff']);
      }
    };
    
    img.onerror = () => {
      console.error('图片加载失败');
      resolve(['#333333', '#666666', '#999999', '#cccccc', '#ffffff']);
    };
    
    img.src = imageSrc;
  });
}

/**
 * 获取适合作为文字背景的颜色
 * 基于主色调计算一个更适合作为背景的颜色
 */
export async function getMagicBackgroundColor(imageSrc: string): Promise<string> {
  try {
    const dominantColor = await extractDominantColor(imageSrc);
    
    // 将十六进制颜色转换为RGB
    const hex = dominantColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // 计算亮度
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // 根据亮度调整颜色，使其更适合作为文字背景
    let adjustedR, adjustedG, adjustedB;
    
    if (brightness > 128) {
      // 如果原色较亮，使其变暗一些
      adjustedR = Math.max(0, Math.floor(r * 0.6));
      adjustedG = Math.max(0, Math.floor(g * 0.6));
      adjustedB = Math.max(0, Math.floor(b * 0.6));
    } else {
      // 如果原色较暗，使其变亮一些但不要太亮
      adjustedR = Math.min(255, Math.floor(r * 1.4));
      adjustedG = Math.min(255, Math.floor(g * 1.4));
      adjustedB = Math.min(255, Math.floor(b * 1.4));
    }
    
    // 转换回十六进制
    const adjustedHex = rgbToHex([adjustedR, adjustedG, adjustedB]);
    return adjustedHex;
  } catch (error) {
    console.error('获取魔法背景色失败:', error);
    return '#333333';
  }
} 