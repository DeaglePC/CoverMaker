import React, { createContext, useState, useRef, useContext, useCallback, ReactNode } from 'react';
import { Area } from 'react-easy-crop';
// 导入新的类型
import { getFinalImage, DrawOptions } from '../utils/cropImage';
// 导入魔法色工具函数
import { getMagicBackgroundColor } from '../utils/colorExtractor';

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
    textOffsetX: number;
    setTextOffsetX: (offset: number) => void;
    textOffsetY: number;
    setTextOffsetY: (offset: number) => void;
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
    textBackgroundBlur: number;
    setTextBackgroundBlur: (blur: number) => void;
    // 添加魔法色控制
    isMagicColorMode: boolean;
    setIsMagicColorMode: (isMagic: boolean) => void;
    magicColor: string;
    setMagicColor: (color: string) => void;
    updateMagicColor: () => Promise<void>;
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
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [title, setTitle] = useState<string>('这里是标题');
    const [content, setContent] = useState<string>('这里是正文内容，可以根据需要修改。');
    const [aspect, setAspect] = useState<number>(3 / 4);
    const [borderRadius, setBorderRadius] = useState<number>(50);
    const [textColor, setTextColor] = useState<string>('#ffffff');
    const [textVAlign, setTextVAlign] = useState<VAlign>('bottom');
    // 添加文字大小状态
    const [titleSize, setTitleSize] = useState<number>(80);
    const [contentSize, setContentSize] = useState<number>(38);
    // 添加文字位置状态
    const [textHAlign, setTextHAlign] = useState<'left' | 'center' | 'right'>('center');
    const [textOffsetX, setTextOffsetX] = useState<number>(0);
    const [textOffsetY, setTextOffsetY] = useState<number>(0);
    // 添加标题和内容间距状态
    const [titleContentSpacing, setTitleContentSpacing] = useState<number>(66);
    // 添加文字背景状态
    const [textBackgroundEnabled, setTextBackgroundEnabled] = useState<boolean>(true);
    const [textBackgroundColor, setTextBackgroundColor] = useState<string>('#000000');
    const [textBackgroundOpacity, setTextBackgroundOpacity] = useState<number>(50);
    const [textBackgroundBlur, setTextBackgroundBlur] = useState<number>(10);
    // 添加魔法色状态
    const [isMagicColorMode, setIsMagicColorMode] = useState<boolean>(true);
    const [magicColor, setMagicColor] = useState<string>('#333333');
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [completedCrop, setCompletedCrop] = useState<Area | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    // 定义新的 state
    const [croppedImageDimensions, setCroppedImageDimensions] = useState<{ width: number; height: number } | null>(null);
    const [isCropping, setIsCropping] = useState<boolean>(true);
    // 添加预览相关状态
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isGeneratingPreview, setIsGeneratingPreview] = useState<boolean>(false);
    const previewContainerRef = useRef<HTMLDivElement>(null);

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
                setPreviewImage(null); // 清除预览图片
                setIsCropping(true);
                setZoom(1);
                
                // 异步更新魔法色
                if (imageSrcUrl) {
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
                titleContentSpacing,
                textBackgroundEnabled,
                textBackgroundColor,
                textBackgroundOpacity,
                textBackgroundBlur,
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
        titleContentSpacing,
        textBackgroundEnabled,
        textBackgroundColor,
        textBackgroundOpacity,
        textBackgroundBlur,
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
    const resetToDefaults = useCallback(() => {
        setTitle('这里是标题');
        setContent('这里是正文内容，可以根据需要修改。');
        setAspect(3 / 4);
        setBorderRadius(50);
        setTextColor('#ffffff');
        setTextVAlign('bottom');
        setTitleSize(80);
        setContentSize(38);
        setTextHAlign('center');
        setTextOffsetX(0);
        setTextOffsetY(0);
        setTitleContentSpacing(66);
        setTextBackgroundEnabled(true);
        setTextBackgroundColor('#000000');
        setTextBackgroundOpacity(50);
        setTextBackgroundBlur(10);
        setIsMagicColorMode(true);
        setMagicColor('#333333');
        setZoom(1);
    }, []);

    const handleDownload = async () => {
        if (!completedCrop || !imageSrc) {
            alert('请先上传图片并完成裁剪。');
            console.error("Cannot download, crop details or image source not set.");
            return;
        }

        try {
            const options: DrawOptions = {
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
                titleContentSpacing,
                textBackgroundEnabled,
                textBackgroundColor,
                textBackgroundOpacity,
                textBackgroundBlur,
                isMagicColorMode,
                magicColor,
            };
            
            const imageBlobUrl = await getFinalImage(options);

            if (imageBlobUrl) {
                const link = document.createElement('a');
                link.download = 'cover.png';
                link.href = imageBlobUrl.url; // 使用 .url 属性
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(imageBlobUrl.url); // 清理 blob URL
            }
        } catch (e) {
            console.error('下载图片时出错:', e);
            alert('生成图片失败，请查看控制台获取更多信息。');
        }
    };

    const handleApplyCrop = async () => {
        if (!completedCrop || !imageSrc) {
            console.error("Crop details or image source not set.");
            return;
        }
        try {
            // 修复: 在生成预览图时，传递真实的圆角值，而不是0。
            // 这样生成的预览图本身就是带圆角的。
            // 文字部分仍然留空，因为它们是通过DOM在预览图上层实时叠加的。
            const croppedImgResult = await getFinalImage({ 
                imageSrc, 
                pixelCrop: completedCrop, 
                title: '', 
                content: '', 
                textColor: '', 
                textVAlign: 'center', 
                // 为预览图强制使用0圆角，因为圆角效果将由CSS在前端处理
                borderRadius: 0,
                titleContentSpacing: 0,
                textBackgroundEnabled: false,
                textBackgroundColor: '#000000',
                textBackgroundOpacity: 0,
                textBackgroundBlur: 0,
            });

            if (croppedImgResult) {
                setCroppedImage(croppedImgResult.url);
                setCroppedImageDimensions({ width: croppedImgResult.width, height: croppedImgResult.height });
            }
            setIsCropping(false);
            
            // 应用裁剪后自动生成预览
            handleGeneratePreview();
        } catch (e) {
            console.error("handleApplyCrop 出错:", e);
        }
    };
    
    const value = {
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
        // 添加文字大小和位置控制
        titleSize,
        setTitleSize,
        contentSize,
        setContentSize,
        textHAlign,
        setTextHAlign,
        textOffsetX,
        setTextOffsetX,
        textOffsetY,
        setTextOffsetY,
        // 添加标题和内容间距控制
        titleContentSpacing,
        setTitleContentSpacing,
        // 添加文字背景控制
        textBackgroundEnabled,
        setTextBackgroundEnabled,
        textBackgroundColor,
        setTextBackgroundColor,
        textBackgroundOpacity,
        setTextBackgroundOpacity,
        textBackgroundBlur,
        setTextBackgroundBlur,
        // 添加魔法色控制
        isMagicColorMode,
        setIsMagicColorMode,
        magicColor,
        setMagicColor,
        updateMagicColor,
        crop,
        setCrop,
        zoom,
        setZoom,
        completedCrop,
        isCropping,
        setIsCropping,
        croppedImage,
        croppedImageDimensions, // 传递新的 state
        // 添加预览相关状态和函数
        previewImage,
        isGeneratingPreview,
        previewContainerRef,
        onCropComplete,
        handleImageUpload,
        handleDownload,
        handleApplyCrop,
        handleGeneratePreview,
        handleClearPreview,
        resetToDefaults, // 添加恢复默认值函数
    };

    return (
        <CoverContext.Provider value={value}>
            {children}
        </CoverContext.Provider>
    );
}; 