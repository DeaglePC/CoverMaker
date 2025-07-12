import './Controls.css';
import { useCover } from '../context/CoverContext';
import ImageUploader from './ImageUploader';

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
    isCropping,
    handleApplyCrop,
    handleDownload,
    setIsCropping,
  } = useCover();

  return (
    <div className="controls-section">
      <ImageUploader 
        onImageUpload={handleImageUpload}
        isCropping={isCropping}
        onApplyCrop={handleApplyCrop}
        setIsCropping={setIsCropping}
      />

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
        <label>文字位置</label>
        <div className="align-buttons">
          <button onClick={() => setTextVAlign('top')} className={textVAlign === 'top' ? 'active' : ''}>顶部</button>
          <button onClick={() => setTextVAlign('center')} className={textVAlign === 'center' ? 'active' : ''}>居中</button>
          <button onClick={() => setTextVAlign('bottom')} className={textVAlign === 'bottom' ? 'active' : ''}>底部</button>
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
        <label>宽高比</label>
        <div className="aspect-ratio-buttons">
          <button onClick={() => setAspect(16 / 9)} className={aspect === 16 / 9 ? 'active' : ''}>16:9</button>
          <button onClick={() => setAspect(9 / 16)} className={aspect === 9 / 16 ? 'active' : ''}>9:16</button>
          <button onClick={() => setAspect(4 / 3)} className={aspect === 4 / 3 ? 'active' : ''}>4:3</button>
          <button onClick={() => setAspect(1)} className={aspect === 1 ? 'active' : ''}>1:1</button>
        </div>
      </div>
      
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

      <button onClick={handleDownload} className="control-button download-button">
        下载封面
      </button>
    </div>
  );
}

export default Controls; 