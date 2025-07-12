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
    titleSize = 32,
    contentSize = 18,
    textHAlign = 'center',
    textOffsetX = 0,
    textOffsetY = 0,
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

  // Calculate text positions
  let titleY, contentY;
  const lineHeighRatio = 1.4;

  if (textVAlign === 'top') {
    titleY = padding + titleFontSize;
    contentY = titleY + titleFontSize * lineHeighRatio;
  } else if (textVAlign === 'bottom') {
    // This is a rough estimation, can be improved
    contentY = canvas.height - padding - contentFontSize;
    titleY = contentY - contentFontSize * lineHeighRatio;
  } else { // center
    const totalTextHeight = titleFontSize + contentFontSize * lineHeighRatio;
    const startY = (canvas.height - totalTextHeight) / 2;
    titleY = startY + titleFontSize;
    contentY = titleY + titleFontSize * lineHeighRatio;
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
  
  // To make text more readable, add a subtle shadow/outline
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Draw title and content
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
