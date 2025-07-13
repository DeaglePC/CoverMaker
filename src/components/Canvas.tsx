import React, {  } from 'react';
import Cropper from 'react-easy-crop';
import './Canvas.css';
import { useCover } from '../context/CoverContext';

const Canvas = React.forwardRef<HTMLDivElement>((_, ref) => {
  const {
    imageSrc,
    aspect,
    isCropping,
    crop,
    setCrop,
    zoom,
    setZoom,
    onCropComplete,
    completedCrop,
    previewImage,
    isGeneratingPreview,

  } = useCover();

  return (
    <div ref={ref} className="canvas-preview">
      <div className="canvas-content-wrapper">
        {isCropping ? (
          <Cropper
            image={imageSrc!}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        ) : (
          <>
            {isGeneratingPreview && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <p>正在生成预览...</p>
              </div>
            )}
            
            {previewImage && !isGeneratingPreview && (
              <div className="image-container">
                <img 
                  src={previewImage} 
                  alt="预览图片" 
                  className="preview-image"
                />
              </div>
            )}
            
            {!previewImage && !isGeneratingPreview && imageSrc && completedCrop && (
              <div className="placeholder">
                <p>点击右侧"生成预览"按钮查看最终效果</p>
              </div>
            )}
            
            {!completedCrop && imageSrc && (
              <div className="placeholder">
                <p>请先完成图片裁剪</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default Canvas; 