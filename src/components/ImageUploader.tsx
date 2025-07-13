import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isCropping: boolean;
  onApplyCrop: () => void;
  setIsCropping: (isCropping: boolean) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isCropping, onApplyCrop, setIsCropping }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageUpload(e.target.files[0]);
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      <div className="control-group-grid">
        <button onClick={handleUploadClick} className="control-button upload-button">
          📁 上传图片
        </button>

        {isCropping ? (
          <button onClick={onApplyCrop} className="control-button apply-button">
            ✂️ 应用剪裁
          </button>
        ) : (
          <button onClick={() => setIsCropping(true)} className="control-button recrop-button">
            🔄 重新剪裁
          </button>
        )}
      </div>
    </>
  );
};

export default ImageUploader; 