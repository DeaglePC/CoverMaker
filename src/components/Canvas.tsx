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
              <img 
                src={(croppedImage || imageSrc) ?? undefined} 
                alt="Preview" 
                className="preview-image"
                style={{ borderRadius: `${borderRadius}px` }}
              />
            )}
            <div className="text-overlay" style={textStyle}>
              <h1 className="title-text">{title}</h1>
              <p className="content-text">{content}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default Canvas; 