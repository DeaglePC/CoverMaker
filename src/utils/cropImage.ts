import { Area } from 'react-easy-crop';

// Helper function to create an image element from a URL
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

// Helper function to create a checkered pattern canvas
const createCheckeredCanvas = (size: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    return canvas;
  }
  
  canvas.width = size * 2;
  canvas.height = size * 2;
  
  // 绘制棋盘格图案
  ctx.fillStyle = '#f0f0f0'; // 浅灰色
  ctx.fillRect(0, 0, size * 2, size * 2);
  
  ctx.fillStyle = '#d0d0d0'; // 深灰色
  ctx.fillRect(0, 0, size, size);
  ctx.fillRect(size, size, size, size);
  
  return canvas;
};

// Interface for all the options we need to draw the final image
export interface DrawOptions {
  imageSrc: string;
  pixelCrop: Area;
  title: string;
  content: string;
  textColor: string;
  textVAlign: 'top' | 'center' | 'bottom';
  borderRadius: number;
  // 添加文字大小和位置控制
  titleSize?: number;
  contentSize?: number;
  textHAlign?: 'left' | 'center' | 'right';
  textOffsetX?: number;
  textOffsetY?: number;
  // 添加字体控制
  fontFamily?: string;
  // 添加标题和内容间距控制
  titleContentSpacing?: number;
  // 添加文字背景控制
  textBackgroundEnabled?: boolean;
  textBackgroundColor?: string;
  textBackgroundOpacity?: number;
  // 添加魔法色控制
  isMagicColorMode?: boolean;
  magicColor?: string;
  // 添加边框控制
  borderEnabled?: boolean;
  borderWidth?: number;
  borderColor?: string;
  isBorderMagicColorMode?: boolean;
  isBorderTransparent?: boolean;
  // 添加预览模式标志
  isPreview?: boolean;
}

/**
 * 测量多行文字的尺寸（不实际绘制）
 * @param {CanvasRenderingContext2D} ctx - Canvas渲染上下文
 * @param {string} text - 要测量的文本
 * @param {number} maxWidth - 最大宽度
 * @param {number} lineHeight - 行高
 * @returns {Object} 包含实际高度、行数和最大宽度的对象
 */
function measureMultilineText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeight: number
): { height: number; lines: number; maxLineWidth: number } {
  if (!text.trim()) {
    return { height: 0, lines: 0, maxLineWidth: 0 };
  }
  
  // 首先处理显式换行符
  const paragraphs = text.split('\n');
  let totalLines = 0;
  let maxLineWidth = 0;
  
  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      // 空行
      totalLines++;
      continue;
    }
    
    // 自动换行处理
    const words = paragraph.split(' ');
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        // 当前行超宽，记录当前行宽度
        maxLineWidth = Math.max(maxLineWidth, ctx.measureText(currentLine).width);
        currentLine = word;
        totalLines++;
      } else {
        currentLine = testLine;
      }
    }
    
    // 记录最后一行宽度
    if (currentLine) {
      maxLineWidth = Math.max(maxLineWidth, ctx.measureText(currentLine).width);
      totalLines++;
    }
  }
  
  return {
    height: totalLines * lineHeight,
    lines: totalLines,
    maxLineWidth: maxLineWidth
  };
}

/**
 * 支持换行的文字渲染函数
 * @param {CanvasRenderingContext2D} ctx - Canvas渲染上下文
 * @param {string} text - 要渲染的文本
 * @param {number} x - X坐标
 * @param {number} y - Y坐标（第一行文字的基线）
 * @param {number} maxWidth - 最大宽度
 * @param {number} lineHeight - 行高
 * @param {string} textAlign - 文字对齐方式
 * @returns {Object} 包含实际渲染高度和行数的对象
 */
function drawMultilineText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  textAlign: 'left' | 'center' | 'right' = 'center'
): { height: number; lines: number } {
  if (!text.trim()) {
    return { height: 0, lines: 0 };
  }
  
  const originalTextAlign = ctx.textAlign;
  ctx.textAlign = textAlign;
  
  // 首先处理显式换行符
  const paragraphs = text.split('\n');
  let currentY = y;
  let totalLines = 0;
  
  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      // 空行
      currentY += lineHeight;
      totalLines++;
      continue;
    }
    
    // 自动换行处理
    const words = paragraph.split(' ');
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        // 当前行超宽，先绘制当前行
        ctx.fillText(currentLine, x, currentY);
        currentLine = word;
        currentY += lineHeight;
        totalLines++;
      } else {
        currentLine = testLine;
      }
    }
    
    // 绘制最后一行
    if (currentLine) {
      ctx.fillText(currentLine, x, currentY);
      currentY += lineHeight;
      totalLines++;
    }
  }
  
  ctx.textAlign = originalTextAlign;
  
  return {
    height: totalLines * lineHeight,
    lines: totalLines
  };
}

/**
 * Draws a rounded rectangle path on a canvas context.
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {number} x - The x-coordinate of the rectangle's top-left corner.
 * @param {number} y - The y-coordinate of the rectangle's top-left corner.
 * @param {number} width - The width of the rectangle.
 * @param {number} height - The height of the rectangle.
 * @param {number} radius - The corner radius.
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

/**
 * Draws a rectangle with selective rounded corners.
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {number} x - The x-coordinate of the rectangle's top-left corner.
 * @param {number} y - The y-coordinate of the rectangle's top-left corner.
 * @param {number} width - The width of the rectangle.
 * @param {number} height - The height of the rectangle.
 * @param {number} radius - The corner radius.
 * @param {boolean} topLeft - Whether to round the top-left corner.
 * @param {boolean} topRight - Whether to round the top-right corner.
 * @param {boolean} bottomRight - Whether to round the bottom-right corner.
 * @param {boolean} bottomLeft - Whether to round the bottom-left corner.
 */
function selectiveRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  topLeft: boolean = true,
  topRight: boolean = true,
  bottomRight: boolean = true,
  bottomLeft: boolean = true
) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  
  ctx.beginPath();
  
  // Start from top-left corner
  ctx.moveTo(x + (topLeft ? radius : 0), y);
  
  // Top side and top-right corner
  if (topRight) {
    ctx.arcTo(x + width, y, x + width, y + height, radius);
  } else {
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + radius);
  }
  
  // Right side and bottom-right corner
  if (bottomRight) {
    ctx.arcTo(x + width, y + height, x, y + height, radius);
  } else {
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width - radius, y + height);
  }
  
  // Bottom side and bottom-left corner
  if (bottomLeft) {
    ctx.arcTo(x, y + height, x, y, radius);
  } else {
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y + height - radius);
  }
  
  // Left side and top-left corner
  if (topLeft) {
    ctx.arcTo(x, y, x + width, y, radius);
  } else {
    ctx.lineTo(x, y);
    ctx.lineTo(x + radius, y);
  }
  
  ctx.closePath();
}

// 修改返回类型，增加 width 和 height
export type FinalImage = {
  url: string;
  width: number;
  height: number;
};

// The main function to create the cropped, rounded, and text-added image
export async function getFinalImage(
  options: DrawOptions
): Promise<FinalImage | null> {
  const {
    imageSrc,
    pixelCrop,
    title,
    content,
    textColor,
    textVAlign,
    borderRadius,
    titleSize = 80,
    contentSize = 38,
    textHAlign = 'center',
    textOffsetX = 0,
    textOffsetY = 0,
    fontFamily = 'Microsoft YaHei, sans-serif',
    titleContentSpacing = 66,
    textBackgroundEnabled = false,
    textBackgroundColor = '#000000',
    textBackgroundOpacity = 50,
    isMagicColorMode = false,
    magicColor = '#333333',
    borderEnabled = false,
    borderWidth = 4,
    borderColor = '#ffffff',
    isBorderMagicColorMode = false,
    isBorderTransparent = false,
    isPreview = false,
  } = options;

  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const finalWidth = Math.round(pixelCrop.width);
  const finalHeight = Math.round(pixelCrop.height);

  // Set canvas size to the final cropped size
  canvas.width = finalWidth;
  canvas.height = finalHeight;

  // Apply border radius by clipping
  // The radius should not exceed half the width or height
  const maxRadius = Math.min(canvas.width, canvas.height) / 2;
  const actualRadius = Math.min(borderRadius, maxRadius);
  
  ctx.save();
  roundRect(ctx, 0, 0, canvas.width, canvas.height, actualRadius);
  ctx.clip();

  // Draw the cropped portion of the image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );
  
  ctx.restore(); // Restore context to draw text without clipping if needed (though we want it clipped)

  // --- Draw Text ---
  // A little padding from the edges
  const padding = canvas.width * 0.05; 
  const maxWidth = canvas.width - padding * 2;

  // Title styles - 使用动态字体大小
  const titleFontSize = titleSize;
  ctx.fillStyle = textColor;
  ctx.font = `bold ${titleFontSize}px ${fontFamily}`;
  ctx.textAlign = textHAlign;

  // Content styles - 使用动态字体大小
  const contentFontSize = contentSize;
  const contentFont = `${contentFontSize}px ${fontFamily}`;
  const contentLineHeight = contentFontSize * 1.2; // 行高为字体大小的1.2倍

  // 预先计算内容的实际高度
  ctx.font = contentFont;
  const contentInfo = content ? measureMultilineText(ctx, content, maxWidth, contentLineHeight) : { height: 0, lines: 0, maxLineWidth: 0 };
  const actualContentHeight = contentInfo.height;

  // Calculate text positions using dynamic spacing
  let titleY, contentY;

  if (textVAlign === 'top') {
    titleY = padding + titleFontSize;
    contentY = titleY + titleContentSpacing;
  } else if (textVAlign === 'bottom') {
    // 计算总文字高度，然后从底部向上排列
    // 底部对齐时使用更小的间距，让文字更贴近底部
    const bottomPadding = padding * 0.18; // 使用更小的底部间距
    const totalTextHeight = titleFontSize + titleContentSpacing + actualContentHeight;
    const startY = canvas.height - bottomPadding - totalTextHeight;
    titleY = startY + titleFontSize;
    contentY = titleY + titleContentSpacing;
  } else { // center
    const totalTextHeight = titleFontSize + titleContentSpacing + actualContentHeight;
    const startY = (canvas.height - totalTextHeight) / 2;
    titleY = startY + titleFontSize;
    contentY = titleY + titleContentSpacing;
  }

  // 应用偏移量
  titleY += textOffsetY;
  contentY += textOffsetY;

  // 计算 X 位置
  let titleX, contentX;
  if (textHAlign === 'left') {
    titleX = padding + textOffsetX;
    contentX = padding + textOffsetX;
  } else if (textHAlign === 'right') {
    titleX = canvas.width - padding + textOffsetX;
    contentX = canvas.width - padding + textOffsetX;
  } else { // center
    titleX = canvas.width / 2 + textOffsetX;
    contentX = canvas.width / 2 + textOffsetX;
  }

  // Draw text background if enabled
  if (textBackgroundEnabled && (title || content)) {
    ctx.save();
    
    // Calculate text dimensions for background
    ctx.font = `bold ${titleFontSize}px ${fontFamily}`;
    const titleMetrics = ctx.measureText(title);
    
    ctx.font = contentFont;
    // 使用已经计算好的最大行宽度
    const maxContentWidth = contentInfo.maxLineWidth;
    
    // Calculate background dimensions and position based on text alignment
    const backgroundPadding = 20;
    let backgroundX, backgroundY, backgroundWidth, backgroundHeight;
    
    // 背景始终与图片边缘对齐
    backgroundX = 0;
    backgroundWidth = canvas.width;
    
    if (textVAlign === 'top') {
      // 文字在顶部时，背景从图片顶部延伸到文字区域结束
      backgroundY = 0;
      const textEndY = contentY + actualContentHeight + backgroundPadding;
      backgroundHeight = textEndY;
    } else if (textVAlign === 'bottom') {
      // 文字在底部时，背景从文字开始位置延伸到图片底部
      backgroundY = titleY - titleFontSize - backgroundPadding;
      backgroundHeight = canvas.height - backgroundY;
    } else {
      // 文字在中间时，围绕文字
      backgroundX = titleX - Math.max(titleMetrics.width, maxContentWidth) / 2 - backgroundPadding;
      backgroundY = titleY - titleFontSize - backgroundPadding;
      backgroundWidth = Math.max(titleMetrics.width, maxContentWidth) + backgroundPadding * 2;
      backgroundHeight = titleFontSize + titleContentSpacing + actualContentHeight + backgroundPadding * 2;
    }
    
    // Draw background with integrated blur effect
    const opacity = textBackgroundOpacity / 100;
    const hexColor = isMagicColorMode ? magicColor : textBackgroundColor;
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    ctx.save();
    
    // 计算适当的圆角半径
    const backgroundRadius = Math.min(actualRadius, backgroundHeight / 2, backgroundWidth / 2);
    
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    
    if (textVAlign === 'center') {
      // 中心对齐时，使用完整的圆角背景
      ctx.beginPath();
      roundRect(ctx, backgroundX, backgroundY, backgroundWidth, backgroundHeight, backgroundRadius);
      ctx.fill();
      

    } else if (textVAlign === 'top') {
      // 顶部对齐时，只有顶部圆角
      ctx.beginPath();
      selectiveRoundRect(ctx, backgroundX, backgroundY, backgroundWidth, backgroundHeight, backgroundRadius, 
                        true, true, false, false);
      ctx.fill();

    } else if (textVAlign === 'bottom') {
      // 底部对齐时，只有底部圆角
      ctx.beginPath();
      selectiveRoundRect(ctx, backgroundX, backgroundY, backgroundWidth, backgroundHeight, backgroundRadius, 
                        false, false, true, true);
      ctx.fill();

    }
    
    ctx.restore();
    
    ctx.restore(); // Reset filter and other styles
  }
  
  // To make text more readable, add a subtle shadow/outline
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Draw title and content
  ctx.fillStyle = textColor;
  ctx.font = `bold ${titleFontSize}px ${fontFamily}`;
  if (title) {
    ctx.fillText(title, titleX, titleY, maxWidth);
  }
  
  ctx.font = contentFont;
  if (content) {
    drawMultilineText(ctx, content, contentX, contentY, maxWidth, contentLineHeight, textHAlign);
  }

  // --- Draw Border ---
  if (borderEnabled && borderWidth > 0) {
    ctx.save();
    
    // 清除阴影效果，避免边框有阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    if (isBorderTransparent) {
      // 透明边框处理
      if (isPreview) {
        // 预览模式：绘制棋盘格效果让用户看到透明边框位置
        const checkeredPattern = ctx.createPattern(createCheckeredCanvas(20), 'repeat');
        if (checkeredPattern) {
          const outerRadius = actualRadius;
          const innerRadius = Math.max(0, actualRadius - borderWidth);
          
          // 创建临时canvas来绘制边框
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          const tempCtx = tempCanvas.getContext('2d');
          
          if (tempCtx) {
            // 在临时canvas上绘制边框区域的棋盘格
            tempCtx.fillStyle = checkeredPattern;
            
            // 绘制外边框
            tempCtx.beginPath();
            roundRect(tempCtx, 0, 0, canvas.width, canvas.height, outerRadius);
            tempCtx.fill();
            
            // 挖掉内部区域
            tempCtx.globalCompositeOperation = 'destination-out';
            tempCtx.beginPath();
            roundRect(tempCtx, borderWidth, borderWidth, canvas.width - borderWidth * 2, canvas.height - borderWidth * 2, innerRadius);
            tempCtx.fill();
            
            // 将临时canvas绘制到主canvas上
            ctx.drawImage(tempCanvas, 0, 0);
          }
        }
      }
      // 如果不是预览模式，透明边框就不绘制任何内容，保持真正透明
    } else {
      // 绘制普通边框
      const finalBorderColor = isBorderMagicColorMode ? magicColor : borderColor;
      ctx.strokeStyle = finalBorderColor;
      ctx.lineWidth = borderWidth;
      
      // 边框应该从边框宽度的一半开始绘制，这样边框不会超出画布边界
      const borderOffset = borderWidth / 2;
      const borderX = borderOffset;
      const borderY = borderOffset;
      const borderInnerWidth = canvas.width - borderWidth;
      const borderInnerHeight = canvas.height - borderWidth;
      
      // 确保边框圆角与图片圆角一致，但要考虑边框偏移
      const borderRadius = Math.max(0, actualRadius - borderOffset);
      
      // 绘制边框路径
      ctx.beginPath();
      roundRect(ctx, borderX, borderY, borderInnerWidth, borderInnerHeight, borderRadius);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  // --- Export ---
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Canvas is empty');
        return resolve(null);
      }
      // 返回包含 url 和尺寸的对象
      resolve({
        url: URL.createObjectURL(blob),
        width: finalWidth,
        height: finalHeight,
      });
    }, 'image/png');
  });
}
