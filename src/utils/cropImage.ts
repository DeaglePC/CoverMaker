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
  // 添加标题和内容间距控制
  titleContentSpacing?: number;
  // 添加文字背景控制
  textBackgroundEnabled?: boolean;
  textBackgroundColor?: string;
  textBackgroundOpacity?: number;
  textBackgroundBlur?: number;
  // 添加魔法色控制
  isMagicColorMode?: boolean;
  magicColor?: string;
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
    titleContentSpacing = 66,
    textBackgroundEnabled = false,
    textBackgroundColor = '#000000',
    textBackgroundOpacity = 50,
    textBackgroundBlur = 10,
    isMagicColorMode = false,
    magicColor = '#333333',
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
  ctx.font = `bold ${titleFontSize}px "Microsoft YaHei", sans-serif`;
  ctx.textAlign = textHAlign;

  // Content styles - 使用动态字体大小
  const contentFontSize = contentSize;
  const contentFont = `${contentFontSize}px "Microsoft YaHei", sans-serif`;

  // Calculate text positions using dynamic spacing
  let titleY, contentY;

  if (textVAlign === 'top') {
    titleY = padding + titleFontSize;
    contentY = titleY + titleContentSpacing;
  } else if (textVAlign === 'bottom') {
    // This is a rough estimation, can be improved
    contentY = canvas.height - padding - contentFontSize;
    titleY = contentY - titleContentSpacing - titleFontSize;
  } else { // center
    const totalTextHeight = titleFontSize + titleContentSpacing + contentFontSize;
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
    ctx.font = `bold ${titleFontSize}px "Microsoft YaHei", sans-serif`;
    const titleMetrics = ctx.measureText(title);
    
    ctx.font = contentFont;
    const contentMetrics = ctx.measureText(content);
    
    // Calculate background dimensions - 延伸到整个画布宽度
    const backgroundPadding = 20;
    const backgroundWidth = canvas.width; // 使用整个画布宽度
    const backgroundHeight = titleFontSize + titleContentSpacing + contentFontSize + backgroundPadding * 2;
    
    // Calculate background position - 从画布左边开始
    const backgroundX = 0; // 从画布左边开始
    const backgroundY = titleY - titleFontSize - backgroundPadding;
    
    // Draw background with opacity and blur effect
    const opacity = textBackgroundOpacity / 100;
    const hexColor = isMagicColorMode ? magicColor : textBackgroundColor;
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    
    // Apply blur effect if specified
    if (textBackgroundBlur > 0) {
      ctx.filter = `blur(${textBackgroundBlur}px)`;
    }
    
    // Draw rounded rectangle background
    ctx.beginPath();
    const bgRadius = 8;
    roundRect(ctx, backgroundX, backgroundY, backgroundWidth, backgroundHeight, bgRadius);
    ctx.fill();
    
    ctx.restore(); // Reset filter and other styles
  }
  
  // To make text more readable, add a subtle shadow/outline
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Draw title and content
  ctx.fillStyle = textColor;
  ctx.font = `bold ${titleFontSize}px "Microsoft YaHei", sans-serif`;
  ctx.fillText(title, titleX, titleY, maxWidth);
  
  ctx.font = contentFont;
  ctx.fillText(content, contentX, contentY, maxWidth);

  // --- Export ---
  return new Promise((resolve, reject) => {
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
