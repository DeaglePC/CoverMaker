import React from 'react';
import Cropper from 'react-easy-crop';
import './Canvas.css';
import { useCover } from '../context/CoverContext';

const Canvas = React.forwardRef<HTMLDivElement>((_, ref) => {
  const {
    imageSrc,
    croppedImage,
    title,
    content,
    aspect,
    borderRadius,
    textColor,
    textVAlign,
    titleSize,
    contentSize,
    textHAlign,
    textOffsetX,
    textOffsetY,
    isCropping,
    crop,
    setCrop,
    zoom,
    setZoom,
    onCropComplete,
  } = useCover();

  const textStyle: React.CSSProperties = {
    color: textColor,
    justifyContent: textVAlign === 'top' ? 'flex-start' : textVAlign === 'bottom' ? 'flex-end' : 'center',
    alignItems: textHAlign === 'left' ? 'flex-start' : textHAlign === 'right' ? 'flex-end' : 'center',
    transform: `translate(${textOffsetX}px, ${textOffsetY}px)`,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: `${titleSize}px`,
  };

  const contentStyle: React.CSSProperties = {
    fontSize: `${contentSize}px`,
  };

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
            {(croppedImage || imageSrc) && (
              <div className="image-container">
                <img 
                  src={(croppedImage || imageSrc) ?? undefined} 
                  alt="Preview" 
                  className="preview-image"
                  style={{ borderRadius: `${borderRadius}px` }}
                />
                <div className="text-overlay" style={textStyle}>
                  <h1 className="title-text" style={titleStyle}>{title}</h1>
                  <p className="content-text" style={contentStyle}>{content}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default Canvas; 