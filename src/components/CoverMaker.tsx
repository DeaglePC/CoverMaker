import Canvas from './Canvas';
import Controls from './Controls';
import './CoverMaker.css';
import { useCover } from '../context/CoverContext';

function CoverMaker() {
  const { imageSrc, croppedImage } = useCover();

  // 如果有原始图片或裁剪后的图片，就显示 Canvas
  const shouldShowCanvas = imageSrc || croppedImage;

  return (
    <div className="cover-maker">
      <div className="canvas-container">
        {shouldShowCanvas ? <Canvas /> : (
          <div className="placeholder" onClick={() => document.querySelector<HTMLElement>('.upload-button')?.click()}>
            <p>从左侧"上传图片"开始</p>
          </div>
        )}
      </div>
      <div className="controls-container">
        <Controls />
      </div>
    </div>
  );
}

export default CoverMaker; 