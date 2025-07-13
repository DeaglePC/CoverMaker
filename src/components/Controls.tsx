import './Controls.css';
import { useCover } from '../context/CoverContext';
import ImageUploader from './ImageUploader';

// 定义宽高比常量
const ASPECT_RATIOS = {
  RATIO_16_9: 16 / 9,
  RATIO_9_16: 9 / 16,
  RATIO_4_3: 4 / 3,
  RATIO_3_4: 3 / 4,
  RATIO_1_1: 1,
};

function Controls() {
  const {
    handleImageUpload,
    setTitle,
    setContent,
    setAspect,
    setBorderRadius,
    setTextColor,
    setTextVAlign,
    setZoom,
    title,
    content,
    borderRadius,
    aspect,
    textColor,
    textVAlign,
    zoom,
    titleSize,
    setTitleSize,
    contentSize,
    setContentSize,
    textHAlign,
    setTextHAlign,
    textOffsetX,
    setTextOffsetX,
    textOffsetY,
    setTextOffsetY,
    titleContentSpacing,
    setTitleContentSpacing,
    textBackgroundEnabled,
    setTextBackgroundEnabled,
    textBackgroundColor,
    setTextBackgroundColor,
    textBackgroundOpacity,
    setTextBackgroundOpacity,
    isMagicColorMode,
    setIsMagicColorMode,
    magicColor,
    updateMagicColor,
    isCropping,
    handleApplyCrop,
    handleDownload,
    setIsCropping,
    // 添加预览相关状态和函数
    imageSrc,
    completedCrop,
    isGeneratingPreview,
    handleGeneratePreview,
    resetToDefaults,
  } = useCover();

  // 处理宽高比变更的函数
  const handleAspectChange = (newAspect: number) => {
    setAspect(newAspect);
    // 如果已经完成剪裁，自动触发重新剪裁
    if (!isCropping) {
      setIsCropping(true);
    }
  };

  return (
    <div className="controls-wrapper">
      <div className="controls-section">
        <ImageUploader 
          onImageUpload={handleImageUpload}
          isCropping={isCropping}
          onApplyCrop={handleApplyCrop}
          setIsCropping={setIsCropping}
        />

        <div className="control-group">
          <label>宽高比</label>
          
          <div className="aspect-ratio-group">
            <div className="aspect-ratio-label">📱竖屏</div>
            <div className="aspect-ratio-buttons">
              <button onClick={() => handleAspectChange(ASPECT_RATIOS.RATIO_9_16)} className={Math.abs(aspect - ASPECT_RATIOS.RATIO_9_16) < 0.001 ? 'active' : ''}>🎵 9:16</button>
              <button onClick={() => handleAspectChange(ASPECT_RATIOS.RATIO_3_4)} className={Math.abs(aspect - ASPECT_RATIOS.RATIO_3_4) < 0.001 ? 'active' : ''}>🍠 3:4</button>
            </div>
          </div>
          
          <div className="aspect-ratio-group">
            <div className="aspect-ratio-label">💻横屏</div>
            <div className="aspect-ratio-buttons">
              <button onClick={() => handleAspectChange(ASPECT_RATIOS.RATIO_16_9)} className={Math.abs(aspect - ASPECT_RATIOS.RATIO_16_9) < 0.001 ? 'active' : ''}>16:9</button>
              <button onClick={() => handleAspectChange(ASPECT_RATIOS.RATIO_4_3)} className={Math.abs(aspect - ASPECT_RATIOS.RATIO_4_3) < 0.001 ? 'active' : ''}>4:3</button>
            </div>
          </div>

          <div className="aspect-ratio-group">
            <div className="aspect-ratio-label">正方形</div>
            <div className="aspect-ratio-buttons">
              <button onClick={() => handleAspectChange(ASPECT_RATIOS.RATIO_1_1)} className={Math.abs(aspect - ASPECT_RATIOS.RATIO_1_1) < 0.001 ? 'active' : ''}>1:1</button>
            </div>
          </div>

          
        </div>

        <div className="control-group">
          <label>缩放: {zoom.toFixed(2)}x</label>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="slider"
            disabled={!isCropping}
          />
        </div>

        <div className="control-group">
          <label>标题</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="control-group">
          <label>内容</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        </div>

        <div className="control-group">
          <label>文字颜色</label>
          <div className="color-picker-container">
            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="color-picker" />
            <span>{textColor}</span>
          </div>
        </div>

        <div className="control-group">
          <label>文字垂直位置</label>
          <div className="align-buttons">
            <button 
              onClick={() => {
                setTextVAlign('top');
                setTextOffsetY(-50); // 顶部对齐时，设置向上偏移
              }} 
              className={textVAlign === 'top' ? 'active' : ''}
            >
              顶部
            </button>
            <button 
              onClick={() => {
                setTextVAlign('center');
                setTextOffsetY(0); // 居中对齐时，重置垂直偏移
              }} 
              className={textVAlign === 'center' ? 'active' : ''}
            >
              居中
            </button>
            <button 
              onClick={() => {
                setTextVAlign('bottom');
                setTextOffsetY(50); // 底部对齐时，设置向下偏移
              }} 
              className={textVAlign === 'bottom' ? 'active' : ''}
            >
              底部
            </button>
          </div>
        </div>

        <div className="control-group">
          <label>文字水平位置</label>
          <div className="align-buttons">
            <button 
              onClick={() => {
                setTextHAlign('left');
                setTextOffsetX(-50); // 左对齐时，设置向左偏移
              }} 
              className={textHAlign === 'left' ? 'active' : ''}
            >
              左对齐
            </button>
            <button 
              onClick={() => {
                setTextHAlign('center');
                setTextOffsetX(0); // 居中对齐时，重置水平偏移
              }} 
              className={textHAlign === 'center' ? 'active' : ''}
            >
              居中
            </button>
            <button 
              onClick={() => {
                setTextHAlign('right');
                setTextOffsetX(50); // 右对齐时，设置向右偏移
              }} 
              className={textHAlign === 'right' ? 'active' : ''}
            >
              右对齐
            </button>
          </div>
        </div>

        <div className="control-group">
          <label>标题大小: {titleSize}px</label>
          <input
            type="range"
            min="12"
            max="300"
            value={titleSize}
            onChange={(e) => setTitleSize(Number(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>内容大小: {contentSize}px</label>
          <input
            type="range"
            min="8"
            max="200"
            value={contentSize}
            onChange={(e) => setContentSize(Number(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>标题与内容间距: {titleContentSpacing}px</label>
          <input
            type="range"
            min="0"
            max="100"
            value={titleContentSpacing}
            onChange={(e) => setTitleContentSpacing(Number(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>水平偏移: {textOffsetX}px</label>
          <input
            type="range"
            min="-200"
            max="200"
            value={textOffsetX}
            onChange={(e) => setTextOffsetX(Number(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>垂直偏移: {textOffsetY}px</label>
          <input
            type="range"
            min="-200"
            max="200"
            value={textOffsetY}
            onChange={(e) => setTextOffsetY(Number(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={textBackgroundEnabled}
              onChange={(e) => setTextBackgroundEnabled(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            启用文字背景
          </label>
        </div>

        {textBackgroundEnabled && (
          <>
            <div className="control-group">
              <label>背景颜色</label>
              <div className="color-control-container">
                <div className="color-mode-buttons">
                  <button 
                    className={`color-mode-btn ${!isMagicColorMode ? 'active' : ''}`}
                    onClick={() => setIsMagicColorMode(false)}
                  >
                    自定义
                  </button>
                  <button 
                    className={`color-mode-btn ${isMagicColorMode ? 'active' : ''}`}
                    onClick={() => {
                      setIsMagicColorMode(true);
                      updateMagicColor();
                    }}
                  >
                    ✨魔法色
                  </button>
                </div>
                <div className="color-picker-container">
                  <input 
                    type="color" 
                    value={isMagicColorMode ? magicColor : textBackgroundColor} 
                    onChange={(e) => {
                      if (!isMagicColorMode) {
                        setTextBackgroundColor(e.target.value);
                      }
                    }} 
                    className="color-picker" 
                    disabled={isMagicColorMode}
                  />
                  <span>{isMagicColorMode ? magicColor : textBackgroundColor}</span>
                </div>
              </div>
            </div>

            <div className="control-group">
              <label>背景不透明度: {textBackgroundOpacity}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={textBackgroundOpacity}
                onChange={(e) => setTextBackgroundOpacity(Number(e.target.value))}
                className="slider"
              />
            </div>


          </>
        )} 

        <div className="control-group">
          <label>圆角: {borderRadius}px</label>
          <input
            type="range"
            min="0"
            max="150"
            value={borderRadius}
            onChange={(e) => setBorderRadius(Number(e.target.value))}
            className="slider"
          />
        </div>
      </div>

      {/* 固定底部按钮区域 */}
      <div className="fixed-bottom-actions">
        <button 
          onClick={handleGeneratePreview}
          disabled={isGeneratingPreview || !imageSrc || !completedCrop}
          className="control-button preview-button"
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          {isGeneratingPreview ? '生成中...' : '生成预览'}
        </button>
        
        <button onClick={resetToDefaults} className="control-button reset-button">
          恢复默认
        </button>

        <button onClick={handleDownload} className="control-button download-button">
          下载封面
        </button>
      </div>
    </div>
  );
}

export default Controls; 