import React, { createContext, useState, useRef, useContext, useCallback, ReactNode, useEffect } from 'react';
import { Area } from 'react-easy-crop';
// 导入新的类型
import { getFinalImage } from '../utils/cropImage';
// 导入魔法色工具函数
import { getMagicBackgroundColor } from '../utils/colorExtractor';
// 导入字体工具函数
import { getAvailableFonts } from '../utils/fontUtils';
// 导入本地存储工具函数
import { loadSettings, saveSettings, clearSettings, SavedSettings } from '../utils/localStorageUtils';

type VAlign = 'top' | 'center' | 'bottom';

interface CoverContextType {
    imageSrc: string | null;
    setImageSrc: (src: string | null) => void;
    title: string;
    setTitle: (title: string) => void;
    content: string;
    setContent: (content: string) => void;
    aspect: number;
    setAspect: (aspect: number) => void;
    borderRadius: number;
    setBorderRadius: (radius: number) => void;
    textColor: string;
    setTextColor: (color: string) => void;
    textVAlign: VAlign;
    setTextVAlign: (align: VAlign) => void;
    // 添加文字大小控制
    titleSize: number;
    setTitleSize: (size: number) => void;
    contentSize: number;
    setContentSize: (size: number) => void;
    // 添加文字位置控制
    textHAlign: 'left' | 'center' | 'right';
    setTextHAlign: (align: 'left' | 'center' | 'right') => void;
    // 添加字体控制
    fontFamily: string;
    setFontFamily: (font: string) => void;
    availableFonts: Array<{ name: string; value: string }>;
    // 添加标题和内容间距控制
    titleContentSpacing: number;
    setTitleContentSpacing: (spacing: number) => void;
    // 添加文字背景控制
    textBackgroundEnabled: boolean;
    setTextBackgroundEnabled: (enabled: boolean) => void;
    textBackgroundColor: string;
    setTextBackgroundColor: (color: string) => void;
    textBackgroundOpacity: number;
    setTextBackgroundOpacity: (opacity: number) => void;
    // 添加魔法色控制
    isMagicColorMode: boolean;
    setIsMagicColorMode: (isMagic: boolean) => void;
    magicColor: string;
    setMagicColor: (color: string) => void;
    updateMagicColor: () => Promise<void>;
    // 添加文字位置偏移控制
    textOffsetX: number;
    setTextOffsetX: (offsetX: number) => void;
    textOffsetY: number;
    setTextOffsetY: (offsetY: number) => void;
    crop: { x: number; y: number };
    setCrop: (crop: { x: number; y: number }) => void;
    zoom: number;
    setZoom: (zoom: number) => void;
    completedCrop: Area | null;
    isCropping: boolean;
    setIsCropping: (isCropping: boolean) => void;
    croppedImage: string | null;
    // 添加新的 state 类型
    croppedImageDimensions: { width: number; height: number } | null;
    // 添加原始图片尺寸
    originalImageDimensions: { width: number; height: number } | null;
    // 添加预览相关状态
    previewImage: string | null;
    isGeneratingPreview: boolean;
    previewContainerRef: React.RefObject<HTMLDivElement | null>;
    onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
    handleImageUpload: (file: File) => void;
    handleDownload: () => void;
    handleApplyCrop: () => void;
    // 添加预览相关函数
    handleGeneratePreview: () => void;
    handleClearPreview: () => void;
    // 添加恢复默认值函数
    resetToDefaults: () => void;
}

const CoverContext = createContext<CoverContextType | undefined>(undefined);

export const useCover = () => {
    const context = useContext(CoverContext);
    if (!context) {
        throw new Error('useCover must be used within a CoverProvider');
    }
    return context;
};

interface CoverProviderProps {
    children: ReactNode;
}

export const CoverProvider: React.FC<CoverProviderProps> = ({ children }) => {
    // 加载保存的设置
    const savedSettings = loadSettings();
    
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [title, setTitle] = useState<string>(savedSettings.title);
    const [content, setContent] = useState<string>(savedSettings.content);
    const [aspect, setAspect] = useState<number>(savedSettings.aspect);
    const [borderRadius, setBorderRadius] = useState<number>(savedSettings.borderRadius);
    const [textColor, setTextColor] = useState<string>(savedSettings.textColor);
    const [textVAlign, setTextVAlign] = useState<VAlign>(savedSettings.textVAlign);
    // 添加文字大小状态
    const [titleSize, setTitleSize] = useState<number>(savedSettings.titleSize);
    const [contentSize, setContentSize] = useState<number>(savedSettings.contentSize);
    // 添加文字位置状态
    const [textHAlign, setTextHAlign] = useState<'left' | 'center' | 'right'>(savedSettings.textHAlign);
    // 添加字体状态
    const [fontFamily, setFontFamily] = useState<string>(savedSettings.fontFamily);
    const [availableFonts] = useState(getAvailableFonts());
    // 添加标题和内容间距状态
    const [titleContentSpacing, setTitleContentSpacing] = useState<number>(savedSettings.titleContentSpacing);
    // 添加文字背景状态
    const [textBackgroundEnabled, setTextBackgroundEnabled] = useState<boolean>(savedSettings.textBackgroundEnabled);
    const [textBackgroundColor, setTextBackgroundColor] = useState<string>(savedSettings.textBackgroundColor);
    const [textBackgroundOpacity, setTextBackgroundOpacity] = useState<number>(savedSettings.textBackgroundOpacity);
    // 添加魔法色状态
    const [isMagicColorMode, setIsMagicColorMode] = useState<boolean>(savedSettings.isMagicColorMode);
    const [magicColor, setMagicColor] = useState<string>('#333333');
    // 添加文字位置偏移状态
    const [textOffsetX, setTextOffsetX] = useState<number>(savedSettings.textOffsetX);
    const [textOffsetY, setTextOffsetY] = useState<number>(savedSettings.textOffsetY);
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(savedSettings.zoom);
    const [completedCrop, setCompletedCrop] = useState<Area | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    // 定义新的 state
    const [croppedImageDimensions, setCroppedImageDimensions] = useState<{ width: number; height: number } | null>(null);
    // 原始图片尺寸状态
    const [originalImageDimensions, setOriginalImageDimensions] = useState<{ width: number; height: number } | null>(null);
    const [isCropping, setIsCropping] = useState<boolean>(true);
    // 添加预览相关状态
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isGeneratingPreview, setIsGeneratingPreview] = useState<boolean>(false);
    const previewContainerRef = useRef<HTMLDivElement>(null);
    // 防止初始化时自动保存的标志
    const isInitializedRef = useRef<boolean>(false);

    // 收集当前设置的函数
    const getCurrentSettings = useCallback((): SavedSettings => {
        return {
            title,
            content,
            textColor,
            textVAlign,
            textHAlign,
            titleSize,
            contentSize,
            fontFamily,
            titleContentSpacing,
            textOffsetX,
            textOffsetY,
            textBackgroundEnabled,
            textBackgroundColor,
            textBackgroundOpacity,
            isMagicColorMode,
            aspect,
            borderRadius,
            zoom,
        };
    }, [
        title,
        content,
        textColor,
        textVAlign,
        textHAlign,
        titleSize,
        contentSize,
        fontFamily,
        titleContentSpacing,
        textOffsetX,
        textOffsetY,
        textBackgroundEnabled,
        textBackgroundColor,
        textBackgroundOpacity,
        isMagicColorMode,
        aspect,
        borderRadius,
        zoom,
    ]);

    // 自动保存设置到本地存储
    useEffect(() => {
        // 首次渲染时设置初始化标志
        if (!isInitializedRef.current) {
            isInitializedRef.current = true;
            return;
        }

        const timeoutId = setTimeout(() => {
            const currentSettings = getCurrentSettings();
            saveSettings(currentSettings);
        }, 500); // 500ms 延迟，避免过于频繁的保存

        return () => clearTimeout(timeoutId);
    }, [getCurrentSettings]);

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        // Only set the crop if the values are valid numbers
        if (croppedAreaPixels && croppedAreaPixels.width && croppedAreaPixels.height) {
            setCompletedCrop(croppedAreaPixels);
        }
    }, []);

    // 更新魔法色
    const updateMagicColor = useCallback(async () => {
        if (!imageSrc) return;
        
        try {
            const color = await getMagicBackgroundColor(imageSrc);
            setMagicColor(color);
        } catch (error) {
            console.error('更新魔法色失败:', error);
            setMagicColor('#333333');
        }
    }, [imageSrc]);

    const handleImageUpload = (file: File) => {
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                const imageSrcUrl = reader.result?.toString() ?? null;
                setImageSrc(imageSrcUrl);
                setCroppedImage(null);
                setCroppedImageDimensions(null); // 上传新图片时重置尺寸
                setOriginalImageDimensions(null); // 上传新图片时重置原始尺寸
                setPreviewImage(null); // 清除预览图片
                setIsCropping(true);
                setZoom(1);
                
                // 获取原始图片尺寸
                if (imageSrcUrl) {
                    const img = new Image();
                    img.onload = () => {
                        setOriginalImageDimensions({
                            width: img.naturalWidth,
                            height: img.naturalHeight
                        });
                    };
                    img.src = imageSrcUrl;
                    
                    // 异步更新魔法色
                    getMagicBackgroundColor(imageSrcUrl).then(color => {
                        setMagicColor(color);
                    }).catch(error => {
                        console.error('更新魔法色失败:', error);
                        setMagicColor('#333333');
                    });
                }
            });
            reader.readAsDataURL(file);
        }
    };

    // 生成预览图片的函数
    const handleGeneratePreview = useCallback(async () => {
        if (!imageSrc || !completedCrop) {
            alert('请先上传图片并完成裁剪');
            return;
        }

        setIsGeneratingPreview(true);
        try {
            const finalImage = await getFinalImage({
                imageSrc,
                pixelCrop: completedCrop,
                title,
                content,
                textColor,
                textVAlign,
                borderRadius,
                titleSize,
                contentSize,
                textHAlign,
                textOffsetX,
                textOffsetY,
                fontFamily,
                titleContentSpacing,
                textBackgroundEnabled,
                textBackgroundColor,
                textBackgroundOpacity,
                isMagicColorMode,
                magicColor,
            });
            
            if (finalImage) {
                // 清理之前的预览图片URL
                if (previewImage) {
                    URL.revokeObjectURL(previewImage);
                }
                setPreviewImage(finalImage.url);
            }
        } catch (error) {
            console.error('生成预览图片失败:', error);
            alert('生成预览失败，请重试');
        } finally {
            setIsGeneratingPreview(false);
        }
    }, [
        imageSrc,
        completedCrop,
        title,
        content,
        textColor,
        textVAlign,
        borderRadius,
        titleSize,
        contentSize,
        textHAlign,
        textOffsetX,
        textOffsetY,
        fontFamily,
        titleContentSpacing,
        textBackgroundEnabled,
        textBackgroundColor,
        textBackgroundOpacity,
        isMagicColorMode,
        magicColor,
        previewImage,
    ]);

    // 清理预览图片的函数
    const handleClearPreview = useCallback(() => {
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
            setPreviewImage(null);
        }
    }, [previewImage]);

    // 恢复默认值函数
    const resetToDefaults = useCallback(async () => {
        // 清除本地存储
        clearSettings();
        
        // 加载默认设置
        const defaults = loadSettings(); // 这会返回默认设置，因为本地存储已被清除
        
        setTitle(defaults.title);
        setContent(defaults.content);
        setTextColor(defaults.textColor);
        setTextVAlign(defaults.textVAlign);
        setTextHAlign(defaults.textHAlign);
        setFontFamily(defaults.fontFamily);
        setBorderRadius(defaults.borderRadius);
        setTextBackgroundEnabled(defaults.textBackgroundEnabled);
        setTextBackgroundColor(defaults.textBackgroundColor);
        setTextBackgroundOpacity(defaults.textBackgroundOpacity);
        setIsMagicColorMode(defaults.isMagicColorMode);
        setMagicColor('#333333');
        setTextOffsetX(defaults.textOffsetX);
        setTextOffsetY(defaults.textOffsetY);
        setZoom(defaults.zoom);
        
        // 智能字体大小和圆角：如果有裁剪后的图片尺寸，使用智能计算；否则使用固定默认值
        if (croppedImageDimensions) {
            const smartTitleSize = Math.round(croppedImageDimensions.width * 0.1);
            const smartContentSize = Math.round(croppedImageDimensions.width * 0.07);
            
            // 设置合理的字体大小范围（根据图片宽度动态计算最大值）
            const minTitleSize = 12;
            const maxTitleSize = Math.round(croppedImageDimensions.width * 0.3);
            const minContentSize = 8;
            const maxContentSize = Math.round(croppedImageDimensions.width * 0.3);
            
            // 应用智能字体大小，但限制在合理范围内
            const finalTitleSize = Math.max(minTitleSize, Math.min(maxTitleSize, smartTitleSize));
            setTitleSize(finalTitleSize);
            setContentSize(Math.max(minContentSize, Math.min(maxContentSize, smartContentSize)));
            
            // 间距大小与标题大小保持一致
            setTitleContentSpacing(finalTitleSize);
            
            // 根据裁剪后的图片宽度智能调整圆角
            const smartBorderRadius = Math.round(croppedImageDimensions.width * 0.1);
            const maxBorderRadius = Math.round(croppedImageDimensions.width * 0.25);
            const finalBorderRadius = Math.min(smartBorderRadius, maxBorderRadius);
            setBorderRadius(finalBorderRadius);
        } else {
            // 如果没有裁剪后的图片尺寸，使用固定默认值
            setTitleSize(defaults.titleSize);
            setContentSize(defaults.contentSize);
            // 间距大小与标题大小保持一致
            setTitleContentSpacing(defaults.titleContentSpacing);
            setBorderRadius(defaults.borderRadius);
        }
        
        // 清理预览图片
        handleClearPreview();
        
        // 如果有图片，重新触发魔法色更新
        if (imageSrc) {
            await updateMagicColor();
        }
        
        // 重新生成预览
        handleGeneratePreview();
    }, [handleClearPreview, imageSrc, updateMagicColor, croppedImageDimensions, handleGeneratePreview]);

    const handleDownload = async () => {
        if (!imageSrc || !completedCrop) {
            alert('请先上传图片并完成裁剪');
            return;
        }

        try {
            const finalImage = await getFinalImage({
                imageSrc,
                pixelCrop: completedCrop,
                title,
                content,
                textColor,
                textVAlign,
                borderRadius,
                titleSize,
                contentSize,
                textHAlign,
                textOffsetX,
                textOffsetY,
                fontFamily,
                titleContentSpacing,
                textBackgroundEnabled,
                textBackgroundColor,
                textBackgroundOpacity,
                isMagicColorMode,
                magicColor,
            });
            
            if (finalImage) {
                const link = document.createElement('a');
                link.download = `cover_${new Date().toISOString().slice(0, 10)}.png`;
                link.href = finalImage.url;
                link.click();
            }
        } catch (error) {
            console.error('下载图片失败:', error);
            alert('下载失败，请重试');
        }
    };

    const handleApplyCrop = async () => {
        if (!imageSrc || !completedCrop) {
            alert('请先上传图片并完成裁剪');
            return;
        }

        try {
            const finalImage = await getFinalImage({
                imageSrc,
                pixelCrop: completedCrop,
                title: '',
                content: '',
                textColor,
                textVAlign,
                borderRadius,
                titleSize,
                contentSize,
                textHAlign,
                textOffsetX,
                textOffsetY,
                fontFamily,
                titleContentSpacing,
                textBackgroundEnabled,
                textBackgroundColor,
                textBackgroundOpacity,
                isMagicColorMode,
                magicColor,
            });
            
            if (finalImage) {
                setCroppedImage(finalImage.url);
                setCroppedImageDimensions({ width: finalImage.width, height: finalImage.height });
                setIsCropping(false);
                
                // 根据裁剪后的图片宽度智能调整字体大小
                const smartTitleSize = Math.round(finalImage.width * 0.1);
                const smartContentSize = Math.round(finalImage.width * 0.07);
                
                // 设置合理的字体大小范围（根据图片宽度动态计算最大值）
                const minTitleSize = 12;
                const maxTitleSize = Math.round(finalImage.width * 0.3);
                const minContentSize = 8;
                const maxContentSize = Math.round(finalImage.width * 0.3);
                
                // 应用智能字体大小，但限制在合理范围内
                const finalTitleSize = Math.max(minTitleSize, Math.min(maxTitleSize, smartTitleSize));
                const finalContentSize = Math.max(minContentSize, Math.min(maxContentSize, smartContentSize));
                
                setTitleSize(finalTitleSize);
                setContentSize(finalContentSize);
                
                // 间距大小与标题大小保持一致
                setTitleContentSpacing(finalTitleSize);
                
                // 根据裁剪后的图片宽度智能调整圆角
                const smartBorderRadius = Math.round(finalImage.width * 0.1);
                const maxBorderRadius = Math.round(finalImage.width * 0.25);
                const finalBorderRadius = Math.min(smartBorderRadius, maxBorderRadius);
                setBorderRadius(finalBorderRadius);
                
                // 应用裁剪后自动生成预览，使用新计算的字体大小
                try {
                    setIsGeneratingPreview(true);
                    const newPreviewImage = await getFinalImage({
                        imageSrc,
                        pixelCrop: completedCrop,
                        title,
                        content,
                        textColor,
                        textVAlign,
                        borderRadius,
                        titleSize: finalTitleSize,
                        contentSize: finalContentSize,
                        textHAlign,
                        textOffsetX,
                        textOffsetY,
                        fontFamily,
                        titleContentSpacing: finalTitleSize,
                        textBackgroundEnabled,
                        textBackgroundColor,
                        textBackgroundOpacity,
                        isMagicColorMode,
                        magicColor,
                    });
                    
                    if (newPreviewImage) {
                        // 清理之前的预览图片URL
                        if (previewImage) {
                            URL.revokeObjectURL(previewImage);
                        }
                        setPreviewImage(newPreviewImage.url);
                    }
                } catch (previewError) {
                    console.error('生成预览图片失败:', previewError);
                } finally {
                    setIsGeneratingPreview(false);
                }
            }
        } catch (error) {
            console.error('应用裁剪失败:', error);
            alert('应用裁剪失败，请重试');
        }
    };

    return (
        <CoverContext.Provider
            value={{
                imageSrc,
                setImageSrc,
                title,
                setTitle,
                content,
                setContent,
                aspect,
                setAspect,
                borderRadius,
                setBorderRadius,
                textColor,
                setTextColor,
                textVAlign,
                setTextVAlign,
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
                magicColor,
                setMagicColor,
                updateMagicColor,
                textOffsetX,
                setTextOffsetX,
                textOffsetY,
                setTextOffsetY,
                crop,
                setCrop,
                zoom,
                setZoom,
                completedCrop,
                isCropping,
                setIsCropping,
                croppedImage,
                croppedImageDimensions,
                originalImageDimensions,
                previewImage,
                isGeneratingPreview,
                previewContainerRef,
                onCropComplete,
                handleImageUpload,
                handleDownload,
                handleApplyCrop,
                handleGeneratePreview,
                handleClearPreview,
                resetToDefaults,
            }}
        >
            {children}
        </CoverContext.Provider>
    );
}; 