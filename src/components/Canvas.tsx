import React, { useState, useRef, useEffect } from 'react';
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
    title,
    content,
    textColor,
    textVAlign,
    textHAlign,
    titleSize,
    contentSize,
    textOffsetX,
    setTextOffsetX,
    textOffsetY,
    setTextOffsetY,
    titleContentSpacing,
    textBackgroundEnabled,
    textBackgroundColor,
    textBackgroundOpacity,
    textBackgroundBlur,
    isMagicColorMode,
    magicColor,
    borderRadius,
  } = useCover();

  // 文字拖拽相关状态
  const [isDragging, setIsDragging] = useState(false);
  const [showTextPreview, setShowTextPreview] = useState(false);
  const dragContainerRef = useRef<HTMLDivElement>(null);

  // 组件挂载时清理任何残留状态
  useEffect(() => {
    document.body.classList.remove('dragging-text');
    clearTextSelection();
  }, []);

  // 组件卸载时确保清理拖拽状态
  useEffect(() => {
    return () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.classList.remove('dragging-text');
        clearTextSelection();
      }
    };
  }, [isDragging]);

  // 监听窗口焦点变化，确保重置拖拽状态
  useEffect(() => {
    const handleWindowBlur = () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.classList.remove('dragging-text');
        clearTextSelection();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // 按 Escape 键取消拖拽
      if (e.key === 'Escape' && isDragging) {
        setIsDragging(false);
        document.body.classList.remove('dragging-text');
        clearTextSelection();
      }
    };

    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDragging]);

  // 强制清除文字选中状态
  const clearTextSelection = () => {
    try {
      if (window.getSelection) {
        const selection = window.getSelection();
        if (selection && selection.removeAllRanges) {
          selection.removeAllRanges();
        }
      }
      if ((document as any).selection && (document as any).selection.empty) {
        (document as any).selection.empty();
      }
    } catch (error) {
      // 忽略清除选中状态时的任何错误
      console.debug('清除文字选中状态时出错:', error);
    }
  };

  // 超强阻止所有选中相关的事件
  const preventSelection = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    clearTextSelection();
    return false;
  };

  // 阻止键盘选中（如Ctrl+A）
  const preventKeyboardSelection = (e: KeyboardEvent) => {
    if (isDragging && (e.ctrlKey || e.metaKey)) {
      if (e.key === 'a' || e.key === 'A' || e.keyCode === 65) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        clearTextSelection();
        return false;
      }
    }
  };

  // 添加全局事件监听器来阻止选中，但只在拖拽区域内
  useEffect(() => {
    if (isDragging) {
      // 只阻止选中相关的事件，不阻止点击事件
      const events = [
        'selectstart',
        'dragstart',
        'drag',
        'dragend',
        'contextmenu'
      ];
      
      const preventSelectionHandler = (e: Event) => {
        // 只在拖拽预览区域内阻止事件
        const dragContainer = dragContainerRef.current;
        if (dragContainer && dragContainer.contains(e.target as Node)) {
          e.preventDefault();
          e.stopPropagation();
          clearTextSelection();
        }
      };
      
      events.forEach(event => {
        document.addEventListener(event, preventSelectionHandler, { capture: true, passive: false });
      });
      
      // 阻止键盘选中
      document.addEventListener('keydown', preventKeyboardSelection, { capture: true, passive: false });
      
      // 持续清除选中状态
      const intervalId = setInterval(() => {
        clearTextSelection();
        // 强制重置CSS样式
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        (document.body.style as any).msUserSelect = 'none';
        (document.body.style as any).mozUserSelect = 'none';
      }, 10);
      
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, preventSelectionHandler, { capture: true } as any);
        });
        document.removeEventListener('keydown', preventKeyboardSelection, { capture: true } as any);
        clearInterval(intervalId);
        
        // 恢复CSS样式
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        (document.body.style as any).msUserSelect = '';
        (document.body.style as any).mozUserSelect = '';
      };
    }
  }, [isDragging]);

  // 开始拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 立即清除任何文字选中
    clearTextSelection();
    
    // 添加拖拽中的CSS类
    document.body.classList.add('dragging-text');
    
    // 强制设置CSS样式
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    (document.body.style as any).msUserSelect = 'none';
    (document.body.style as any).mozUserSelect = 'none';
    
    setIsDragging(true);
    
    const container = dragContainerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      moveEvent.stopPropagation();
      moveEvent.stopImmediatePropagation();
      
      // 在拖拽过程中持续清除选中
      clearTextSelection();
      
      const newX = moveEvent.clientX - rect.left - centerX;
      const newY = moveEvent.clientY - rect.top - centerY;
      
      // 限制拖拽范围
      const maxOffsetX = rect.width / 2 - 50;
      const maxOffsetY = rect.height / 2 - 50;
      
      const clampedX = Math.max(-maxOffsetX, Math.min(maxOffsetX, newX));
      const clampedY = Math.max(-maxOffsetY, Math.min(maxOffsetY, newY));
      
      setTextOffsetX(Math.round(clampedX));
      setTextOffsetY(Math.round(clampedY));
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      
      // 移除拖拽中的CSS类
      document.body.classList.remove('dragging-text');
      
      // 最后清除一次选中
      clearTextSelection();
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // 处理上下文菜单（右键菜单）
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 处理所有可能的选中事件
  const handleAllSelectionEvents = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearTextSelection();
    return false;
  };

  // 计算文字在拖拽区域中的位置
  const getTextPosition = () => {
    const container = dragContainerRef.current;
    if (!container) return { left: '50%', top: '50%' };
    
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    let baseX = centerX;
    let baseY = centerY;
    
    // 根据对齐方式调整基础位置
    if (textHAlign === 'left') {
      baseX = rect.width * 0.1;
    } else if (textHAlign === 'right') {
      baseX = rect.width * 0.9;
    }
    
    if (textVAlign === 'top') {
      baseY = rect.height * 0.2;
    } else if (textVAlign === 'bottom') {
      baseY = rect.height * 0.8;
    }
    
    return {
      left: `${baseX + textOffsetX}px`,
      top: `${baseY + textOffsetY}px`,
    };
  };

  // 阻止默认的拖拽行为
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
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
                  draggable="false"
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                />
              </div>
            )}
            
            {!previewImage && !isGeneratingPreview && imageSrc && completedCrop && (
              <div className="interactive-preview-container">
                <div className="placeholder">
                  <p>点击右侧"生成预览"按钮查看最终效果</p>
                  <p style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
                    或启用文字拖拽预览调整文字位置
                  </p>
                  <button 
                    className="text-preview-button"
                    onClick={() => setShowTextPreview(!showTextPreview)}
                  >
                    {showTextPreview ? '关闭' : '启用'}文字拖拽预览
                  </button>
                </div>
                
                {showTextPreview && (
                  <div 
                    className="text-drag-preview" 
                    ref={dragContainerRef}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onContextMenu={handleContextMenu}
                    onMouseDown={handleAllSelectionEvents}
                    onMouseUp={handleAllSelectionEvents}
                    onMouseMove={handleAllSelectionEvents}
                    onClick={handleAllSelectionEvents}
                    onDoubleClick={handleAllSelectionEvents}
                  >
                    {/* 背景区域 */}
                    <div 
                      className="drag-background"
                      draggable="false"
                      onDragStart={handleDragStart}
                      onContextMenu={handleContextMenu}
                      onMouseDown={handleAllSelectionEvents}
                      onMouseUp={handleAllSelectionEvents}
                      onMouseMove={handleAllSelectionEvents}
                      onClick={handleAllSelectionEvents}
                      onDoubleClick={handleAllSelectionEvents}
                    ></div>
                    
                    {/* 可拖拽的文字控件 */}
                    <div 
                      className="draggable-text-control"
                      style={{
                        position: 'absolute',
                        ...getTextPosition(),
                        transform: 'translate(-50%, -50%)',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        zIndex: 10000,
                        // 移除背景样式，让内部的背景div处理
                        backgroundColor: 'transparent',
                        backdropFilter: 'none',
                      }}
                      onMouseDown={handleMouseDown}
                      onContextMenu={handleContextMenu}
                      draggable="false"
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onClick={handleAllSelectionEvents}
                      onDoubleClick={handleAllSelectionEvents}
                    >
                      <div className="text-control-content" style={{ position: 'relative' }}>
                        {/* 文字背景层 */}
                        {textBackgroundEnabled && (
                          <div 
                            className="text-background"
                            style={{
                              position: 'absolute',
                              top: -10,
                              left: '-50vw',
                              right: '-50vw',
                              height: `${titleSize + titleContentSpacing + contentSize + 20}px`,
                              backgroundColor: `${isMagicColorMode ? magicColor : textBackgroundColor}${Math.round(textBackgroundOpacity * 2.55).toString(16).padStart(2, '0')}`,
                              backdropFilter: `blur(${textBackgroundBlur}px)`,
                              borderRadius: '0px',
                              zIndex: -1,
                            }}
                          />
                        )}
                        
                        <div 
                          className="text-title"
                          style={{ 
                            fontSize: `${titleSize}px`, 
                            fontWeight: 'bold', 
                            marginBottom: `${titleContentSpacing}px`,
                            color: textColor,
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                            fontFamily: '"Microsoft YaHei", sans-serif',
                            textAlign: textHAlign,
                            whiteSpace: 'nowrap',
                          }}
                          onContextMenu={handleContextMenu}
                          onMouseDown={handleAllSelectionEvents}
                          onMouseUp={handleAllSelectionEvents}
                          onMouseMove={handleAllSelectionEvents}
                          onClick={handleAllSelectionEvents}
                          onDoubleClick={handleAllSelectionEvents}
                        >
                          {title}
                        </div>
                        <div 
                          className="text-content"
                          style={{ 
                            fontSize: `${contentSize}px`,
                            color: textColor,
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                            fontFamily: '"Microsoft YaHei", sans-serif',
                            textAlign: textHAlign,
                            whiteSpace: 'nowrap',
                          }}
                          onContextMenu={handleContextMenu}
                          onMouseDown={handleAllSelectionEvents}
                          onMouseUp={handleAllSelectionEvents}
                          onMouseMove={handleAllSelectionEvents}
                          onClick={handleAllSelectionEvents}
                          onDoubleClick={handleAllSelectionEvents}
                        >
                          {content}
                        </div>
                      </div>
                      
                      {/* 拖拽指示器 */}
                      <div className="drag-indicator">
                        <div className="drag-handle"></div>
                      </div>
                    </div>
                    
                    <div className="drag-instructions">
                      <p>拖拽文字调整位置 • 偏移: X={textOffsetX}px, Y={textOffsetY}px</p>
                    </div>
                  </div>
                )}
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