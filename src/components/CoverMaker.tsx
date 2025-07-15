import Canvas from './Canvas';
import Controls from './Controls';
import './CoverMaker.css';
import { useCover } from '../context/CoverContext';
import { useState, useEffect } from 'react';

function CoverMaker() {
  const { imageSrc, croppedImage } = useCover();
  const [showControls, setShowControls] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // 检测是否为移动端
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // 如果有原始图片或裁剪后的图片，就显示 Canvas
  const shouldShowCanvas = imageSrc || croppedImage;

  return (
    <div className="cover-maker">
      {/* 移动端切换按钮 */}
      {isMobile && (
        <button 
          className="mobile-toggle-button"
          onClick={() => setShowControls(!showControls)}
        >
          {showControls ? '📷 专注预览' : '⚙️ 显示控件'}
        </button>
      )}
      
      <div className="canvas-container">
        {shouldShowCanvas ? <Canvas /> : (
          <div className="placeholder" onClick={() => document.querySelector<HTMLElement>('.upload-button')?.click()}>
            <p>从{isMobile ? '下方' : '左侧'}"上传图片"开始</p>
          </div>
        )}
      </div>
      
      <div className={`controls-container ${isMobile && !showControls ? 'hidden' : ''}`}>
        <Controls />
      </div>
    </div>
  );
}

export default CoverMaker; 