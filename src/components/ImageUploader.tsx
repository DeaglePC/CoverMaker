import React, { useRef, useEffect } from 'react';

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

  // 处理剪切板粘贴事件
  const handlePaste = (e: ClipboardEvent) => {
    if (!e.clipboardData) return;

    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // 检查是否是图片类型
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          // 创建一个新的 File 对象，确保有正确的名称
          const newFile = new File([file], `剪切板图片_${Date.now()}.${file.type.split('/')[1]}`, {
            type: file.type,
            lastModified: Date.now()
          });
          
          onImageUpload(newFile);
          e.preventDefault(); // 阻止默认的粘贴行为
          break;
        }
      }
    }
  };

  // 添加和清理全局粘贴事件监听
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [onImageUpload]);

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
        <button onClick={handleUploadClick} className="control-button upload-button" title="点击上传图片或按 Ctrl+V 粘贴剪切板图片">
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