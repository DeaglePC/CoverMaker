// 扩展的系统字体列表
export const SYSTEM_FONTS = [
  { name: '默认字体', value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  
  // 中文字体
  { name: '宋体', value: 'SimSun, serif' },
  { name: '黑体', value: 'SimHei, sans-serif' },
  { name: '微软雅黑', value: 'Microsoft YaHei, sans-serif' },
  { name: '楷体', value: 'KaiTi, serif' },
  { name: '仿宋', value: 'FangSong, serif' },
  { name: '华文细黑', value: 'STXihei, sans-serif' },
  { name: '华文黑体', value: 'STHeiti, sans-serif' },
  { name: '华文楷体', value: 'STKaiti, serif' },
  { name: '华文宋体', value: 'STSong, serif' },
  { name: '华文仿宋', value: 'STFangsong, serif' },
  { name: '华文中宋', value: 'STZhongsong, serif' },
  { name: '华文琥珀', value: 'STHupo, serif' },
  { name: '华文新魏', value: 'STXinwei, serif' },
  { name: '华文隶书', value: 'STLiti, serif' },
  { name: '华文行楷', value: 'STXingkai, serif' },
  { name: '方正舒体', value: 'FZShuTi, serif' },
  { name: '方正姚体', value: 'FZYaoti, serif' },
  { name: '幼圆', value: 'YouYuan, serif' },
  { name: '隶书', value: 'LiSu, serif' },
  { name: '苹方', value: 'PingFang SC, sans-serif' },
  { name: '思源黑体', value: 'Source Han Sans SC, sans-serif' },
  { name: '思源宋体', value: 'Source Han Serif SC, serif' },
  { name: '文泉驿微米黑', value: 'WenQuanYi Micro Hei, sans-serif' },
  { name: '文泉驿正黑', value: 'WenQuanYi Zen Hei, sans-serif' },
  { name: '冬青黑体', value: 'Hiragino Sans GB, sans-serif' },
  { name: '兰亭黑', value: 'Lantinghei SC, sans-serif' },
  { name: '翩翩体', value: 'Hanzipen SC, serif' },
  { name: '手札体', value: 'Hannotate SC, serif' },
  { name: '宋体-简', value: 'Songti SC, serif' },
  { name: '黑体-简', value: 'Heiti SC, sans-serif' },
  { name: '楷体-简', value: 'Kaiti SC, serif' },
  
  // 英文字体
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Arial Black', value: 'Arial Black, sans-serif' },
  { name: 'Arial Narrow', value: 'Arial Narrow, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Times', value: 'Times, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Helvetica Neue', value: 'Helvetica Neue, sans-serif' },
  { name: 'Tahoma', value: 'Tahoma, sans-serif' },
  { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
  { name: 'Impact', value: 'Impact, sans-serif' },
  { name: 'Comic Sans MS', value: 'Comic Sans MS, sans-serif' },
  { name: 'Palatino', value: 'Palatino, serif' },
  { name: 'Garamond', value: 'Garamond, serif' },
  { name: 'Bookman', value: 'Bookman, serif' },
  { name: 'Avant Garde', value: 'Avant Garde, sans-serif' },
  { name: 'Century Gothic', value: 'Century Gothic, sans-serif' },
  { name: 'Lucida Console', value: 'Lucida Console, monospace' },
  { name: 'Lucida Sans Unicode', value: 'Lucida Sans Unicode, sans-serif' },
  { name: 'MS Sans Serif', value: 'MS Sans Serif, sans-serif' },
  { name: 'MS Serif', value: 'MS Serif, serif' },
  { name: 'Segoe UI', value: 'Segoe UI, sans-serif' },
  { name: 'Segoe UI Light', value: 'Segoe UI Light, sans-serif' },
  { name: 'Segoe UI Semibold', value: 'Segoe UI Semibold, sans-serif' },
  { name: 'Calibri', value: 'Calibri, sans-serif' },
  { name: 'Cambria', value: 'Cambria, serif' },
  { name: 'Candara', value: 'Candara, sans-serif' },
  { name: 'Constantia', value: 'Constantia, serif' },
  { name: 'Corbel', value: 'Corbel, sans-serif' },
  { name: 'Franklin Gothic Medium', value: 'Franklin Gothic Medium, sans-serif' },
  { name: 'Gill Sans MT', value: 'Gill Sans MT, sans-serif' },
  { name: 'Rockwell', value: 'Rockwell, serif' },
  { name: 'Bahnschrift', value: 'Bahnschrift, sans-serif' },
  { name: 'Consolas', value: 'Consolas, monospace' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Monaco', value: 'Monaco, monospace' },
  { name: 'Menlo', value: 'Menlo, monospace' },
  { name: 'Source Code Pro', value: 'Source Code Pro, monospace' },
  { name: 'Fira Code', value: 'Fira Code, monospace' },
  { name: 'JetBrains Mono', value: 'JetBrains Mono, monospace' },
  
  // 装饰性字体
  { name: 'Brush Script MT', value: 'Brush Script MT, cursive' },
  { name: 'Chiller', value: 'Chiller, fantasy' },
  { name: 'Curlz MT', value: 'Curlz MT, cursive' },
  { name: 'Harrington', value: 'Harrington, fantasy' },
  { name: 'Jokerman', value: 'Jokerman, fantasy' },
  { name: 'Old English Text MT', value: 'Old English Text MT, fantasy' },
  { name: 'Papyrus', value: 'Papyrus, fantasy' },
  { name: 'Showcard Gothic', value: 'Showcard Gothic, fantasy' },
  { name: 'Snap ITC', value: 'Snap ITC, fantasy' },
  { name: 'Stencil', value: 'Stencil, fantasy' },
  { name: 'Tempus Sans ITC', value: 'Tempus Sans ITC, fantasy' },
  { name: 'Vivaldi', value: 'Vivaldi, fantasy' },
  { name: 'Vladimir Script', value: 'Vladimir Script, cursive' },
  { name: 'Wide Latin', value: 'Wide Latin, fantasy' },
  { name: 'Wingdings', value: 'Wingdings, fantasy' },
  
  // macOS 字体
  { name: 'San Francisco', value: 'San Francisco, sans-serif' },
  { name: 'Avenir', value: 'Avenir, sans-serif' },
  { name: 'Avenir Next', value: 'Avenir Next, sans-serif' },
  { name: 'Futura', value: 'Futura, sans-serif' },
  { name: 'Optima', value: 'Optima, sans-serif' },
  { name: 'Baskerville', value: 'Baskerville, serif' },
  { name: 'Didot', value: 'Didot, serif' },
  { name: 'Hoefler Text', value: 'Hoefler Text, serif' },
  { name: 'Lucida Grande', value: 'Lucida Grande, sans-serif' },
  { name: 'Marker Felt', value: 'Marker Felt, fantasy' },
  { name: 'Noteworthy', value: 'Noteworthy, fantasy' },
  { name: 'Zapfino', value: 'Zapfino, cursive' },
  
  // Google Fonts 常用字体
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Nunito', value: 'Nunito, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Merriweather', value: 'Merriweather, serif' },
  { name: 'Playfair Display', value: 'Playfair Display, serif' },
  { name: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif' },
  { name: 'Ubuntu', value: 'Ubuntu, sans-serif' },
  { name: 'Raleway', value: 'Raleway, sans-serif' },
  { name: 'Noto Sans', value: 'Noto Sans, sans-serif' },
  { name: 'Noto Serif', value: 'Noto Serif, serif' },
  { name: 'Oswald', value: 'Oswald, sans-serif' },
  { name: 'PT Sans', value: 'PT Sans, sans-serif' },
  { name: 'PT Serif', value: 'PT Serif, serif' },
  { name: 'Crimson Text', value: 'Crimson Text, serif' },
  { name: 'Libre Baskerville', value: 'Libre Baskerville, serif' },
  { name: 'Fira Sans', value: 'Fira Sans, sans-serif' },
];

// 检测字体是否可用的函数
export function detectFont(fontName: string): boolean {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) return false;
  
  // 设置测试文本，包括中文和英文
  const testTexts = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    '中文字体测试文本，包含常用汉字和标点符号！@#￥%……&*（）'
  ];
  
  // 使用两种不同的基础字体进行对比
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  
  for (const testText of testTexts) {
    for (const baseFont of baseFonts) {
      // 使用基础字体测量文本
      context.font = `16px ${baseFont}`;
      const baseWidth = context.measureText(testText).width;
      
      // 使用目标字体测量文本
      context.font = `16px "${fontName}", ${baseFont}`;
      const testWidth = context.measureText(testText).width;
      
      // 如果宽度不同，说明字体可用
      if (baseWidth !== testWidth) {
        return true;
      }
    }
  }
  
  return false;
}

// 额外的常见字体名称列表（用于扩展检测）
const ADDITIONAL_FONTS = [
  'Arial Unicode MS', 'Andale Mono', 'Book Antiqua', 'Bookman Old Style',
  'Century', 'Century Schoolbook', 'Courier', 'Garamond', 'Georgia',
  'Meiryo', 'Minion Pro', 'MS Gothic', 'MS Mincho', 'MS PGothic',
  'MS PMincho', 'NSimSun', 'PMingLiU', 'Symbol', 'Webdings',
  'Yu Gothic', 'Yu Mincho', 'Microsoft JhengHei', 'Microsoft YaHei UI',
  'Malgun Gothic', 'Gulim', 'Dotum', 'Batang', 'Gungsuh',
  'AppleGothic', 'Apple SD Gothic Neo', 'Hiragino Kaku Gothic ProN',
  'Hiragino Mincho ProN', 'Osaka', 'Menlo', 'Monaco', 'Andale Mono',
  'Liberation Sans', 'Liberation Serif', 'Liberation Mono',
  'DejaVu Sans', 'DejaVu Serif', 'DejaVu Sans Mono',
  'Droid Sans', 'Droid Serif', 'Droid Sans Mono',
  'Nimbus Sans L', 'Nimbus Roman No9 L', 'Nimbus Mono L',
  'FreeSans', 'FreeSerif', 'FreeMono'
];

// 尝试使用Font Access API获取系统字体（如果可用）
async function tryGetSystemFonts(): Promise<Array<{ name: string; value: string }>> {
  try {
    // 检查是否支持Font Access API
    if ('queryLocalFonts' in navigator) {
      const fonts = await (navigator as any).queryLocalFonts();
      return fonts.map((font: any) => ({
        name: font.family,
        value: `"${font.family}", sans-serif`
      }));
    }
  } catch (error) {
    // Font Access API不可用或被拒绝
    console.log('Font Access API不可用:', error);
  }
  
  return [];
}

// 获取可用的系统字体
export function getAvailableFonts(): Array<{ name: string; value: string }> {
  const availableFonts: Array<{ name: string; value: string }> = [];
  
  // 首先检测预定义的字体列表
  for (const font of SYSTEM_FONTS) {
    // 默认字体始终可用
    if (font.name === '默认字体') {
      availableFonts.push(font);
      continue;
    }
    
    // 对于复合字体（包含多个字体），检测第一个字体
    const firstFont = font.value.split(',')[0].trim().replace(/['"]/g, '');
    if (detectFont(firstFont)) {
      availableFonts.push(font);
    }
  }
  
  // 检测额外的字体
  for (const fontName of ADDITIONAL_FONTS) {
    // 避免重复添加已经在列表中的字体
    if (!availableFonts.some(f => f.name === fontName)) {
      if (detectFont(fontName)) {
        availableFonts.push({
          name: fontName,
          value: `"${fontName}", sans-serif`
        });
      }
    }
  }
  
  // 尝试异步获取更多字体（但不阻塞主流程）
  tryGetSystemFonts().then(systemFonts => {
    if (systemFonts.length > 0) {
      console.log(`通过Font Access API发现了${systemFonts.length}个额外字体`);
      // 这里可以考虑触发重新渲染或更新状态
    }
  }).catch(() => {
    // 静默处理错误
  });
  
  // 按字体名称排序（默认字体保持在最前面）
  const defaultFont = availableFonts.find(f => f.name === '默认字体');
  const otherFonts = availableFonts.filter(f => f.name !== '默认字体').sort((a, b) => a.name.localeCompare(b.name));
  
  return defaultFont ? [defaultFont, ...otherFonts] : otherFonts;
}

// 获取字体的显示名称
export function getFontDisplayName(fontValue: string): string {
  const font = SYSTEM_FONTS.find(f => f.value === fontValue);
  return font ? font.name : '默认字体';
} 