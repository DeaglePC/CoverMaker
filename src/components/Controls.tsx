import './Controls.css';
import { useCover } from '../context/CoverContext';
import ImageUploader from './ImageUploader';
import { clearSettings } from '../utils/localStorageUtils';

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
    fontFamily,
    setFontFamily,
    availableFonts,
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
    textOffsetX,
    setTextOffsetX,
    textOffsetY,
    setTextOffsetY,
    magicColor,
    updateMagicColor,
    croppedImageDimensions,
    originalImageDimensions,
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
    // 边框相关状态
    borderEnabled,
    setBorderEnabled,
    borderWidth,
    setBorderWidth,
    borderColor,
    setBorderColor,
    isBorderMagicColorMode,
    setIsBorderMagicColorMode,
    isBorderTransparent,
    setIsBorderTransparent,
  } = useCover();

  // 处理宽高比变更的函数
  const handleAspectChange = (newAspect: number) => {
    setAspect(newAspect);
    // 如果已经完成剪裁，自动触发重新剪裁
    if (!isCropping) {
      setIsCropping(true);
    }
  };

  // 处理清除设置的函数
  const handleClearSettings = () => {
    if (confirm('确定要清除所有保存的设置吗？这将重置所有参数为默认值。')) {
      clearSettings();
      // 刷新页面以重新加载默认设置
      window.location.reload();
    }
  };

  // 处理边框粗细变化，确保在有效范围内
  const handleBorderWidthChange = (newWidth: number) => {
    const maxWidth = croppedImageDimensions ? Math.round(croppedImageDimensions.width * 0.05) : 20;
    const validWidth = Math.min(newWidth, maxWidth);
    setBorderWidth(validWidth);
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

        {/* 显示图片尺寸信息 */}
        {(originalImageDimensions || croppedImageDimensions) && (
          <div className="control-group">
            <label>图片尺寸信息</label>
            <div className="image-dimensions-info">
              {originalImageDimensions && (
                <div className="dimension-item">
                  <span className="dimension-label">原始:</span>
                  <span className="dimension-value">{originalImageDimensions.width} × {originalImageDimensions.height}</span>
                </div>
              )}
              {croppedImageDimensions && (
                <div className="dimension-item">
                  <span className="dimension-label">裁剪后:</span>
                  <span className="dimension-value">{croppedImageDimensions.width} × {croppedImageDimensions.height}</span>
                </div>
              )}
            </div>
          </div>
        )}

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
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="支持换行，按Enter键换行"
            rows={3}
          />
        </div>

        <div className="control-group">
          <label>文字颜色</label>
          <div className="color-picker-container">
            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="color-picker" />
            <span>{textColor}</span>
          </div>
        </div>

        <div className="control-group">
          <label>字体</label>
          <select 
            value={fontFamily} 
            onChange={(e) => setFontFamily(e.target.value)}
            className="font-selector"
          >
            {availableFonts.map((font) => (
              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>文字垂直位置</label>
          <div className="align-buttons">
            <button 
              onClick={() => setTextVAlign('top')} 
              className={textVAlign === 'top' ? 'active' : ''}
            >
              顶部
            </button>
            <button 
              onClick={() => setTextVAlign('center')} 
              className={textVAlign === 'center' ? 'active' : ''}
            >
              居中
            </button>
            <button 
              onClick={() => setTextVAlign('bottom')} 
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
              onClick={() => setTextHAlign('left')} 
              className={textHAlign === 'left' ? 'active' : ''}
            >
              左对齐
            </button>
            <button 
              onClick={() => setTextHAlign('center')} 
              className={textHAlign === 'center' ? 'active' : ''}
            >
              居中
            </button>
            <button 
              onClick={() => setTextHAlign('right')} 
              className={textHAlign === 'right' ? 'active' : ''}
            >
              右对齐
            </button>
          </div>
        </div>

        <div className="control-group">
          <label>文字水平偏移: {textOffsetX}px</label>
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
          <label>文字垂直偏移: {textOffsetY}px</label>
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
          <label>标题大小: {titleSize}px</label>
          <input
            type="range"
            min="12"
            max={croppedImageDimensions ? Math.round(croppedImageDimensions.width * 0.3) : 300}
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
            max={croppedImageDimensions ? Math.round(croppedImageDimensions.width * 0.3) : 200}
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
            max={croppedImageDimensions ? Math.round(croppedImageDimensions.width * 0.3) : 300}
            value={titleContentSpacing}
            onChange={(e) => setTitleContentSpacing(Number(e.target.value))}
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
            max={croppedImageDimensions ? Math.round(croppedImageDimensions.width * 0.25) : 150}
            value={borderRadius}
            onChange={(e) => setBorderRadius(Number(e.target.value))}
            className="slider"
          />
        </div>

        {/* 边框控制 */}
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={borderEnabled}
              onChange={(e) => setBorderEnabled(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            启用边框
          </label>
        </div>

        {borderEnabled && (
          <>
            <div className="control-group">
              <label>边框粗细: {borderWidth}px</label>
              <input
                type="range"
                min="1"
                max={croppedImageDimensions ? Math.round(croppedImageDimensions.width * 0.05) : 20}
                value={borderWidth}
                onChange={(e) => handleBorderWidthChange(Number(e.target.value))}
                className="slider"
              />
            </div>

            <div className="control-group">
              <label>边框颜色</label>
              <div className="color-control-container">
                <div className="color-mode-buttons">
                  <button 
                    className={`color-mode-btn ${!isBorderMagicColorMode && !isBorderTransparent ? 'active' : ''}`}
                    onClick={() => {
                      setIsBorderMagicColorMode(false);
                      setIsBorderTransparent(false);
                    }}
                  >
                    自定义
                  </button>
                  <button 
                    className={`color-mode-btn ${isBorderMagicColorMode ? 'active' : ''}`}
                    onClick={() => {
                      setIsBorderMagicColorMode(true);
                      setIsBorderTransparent(false);
                      updateMagicColor();
                    }}
                  >
                    ✨魔法色
                  </button>
                  <button 
                    className={`color-mode-btn ${isBorderTransparent ? 'active' : ''}`}
                    onClick={() => {
                      setIsBorderMagicColorMode(false);
                      setIsBorderTransparent(true);
                    }}
                  >
                    🌫️透明
                  </button>
                </div>
                <div className="color-picker-container">
                  <input 
                    type="color" 
                    value={isBorderMagicColorMode ? magicColor : borderColor} 
                    onChange={(e) => {
                      if (!isBorderMagicColorMode && !isBorderTransparent) {
                        setBorderColor(e.target.value);
                      }
                    }} 
                    className="color-picker" 
                    disabled={isBorderMagicColorMode || isBorderTransparent}
                  />
                  <span>
                    {isBorderTransparent ? '透明' : (isBorderMagicColorMode ? magicColor : borderColor)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 恢复默认和清除设置按钮 */}
        <div className="control-group">
          <div className="button-row">
            <button onClick={resetToDefaults} className="control-button reset-button">
              🔄 恢复默认
            </button>

            <button onClick={handleClearSettings} className="control-button clear-settings-button">
              🗑️ 清除设置
            </button>
          </div>
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
          {isGeneratingPreview ? '⏳ 生成中...' : '🖼️ 生成预览'}
        </button>

        <button onClick={handleDownload} className="control-button download-button">
          📥 下载封面
        </button>
      </div>
    </div>
  );
}

export default Controls; 