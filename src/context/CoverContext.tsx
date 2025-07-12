import React, { createContext, useState, useRef, useContext, useCallback, ReactNode } from 'react';
import { Area } from 'react-easy-crop';
// 导入新的类型
import { getFinalImage, DrawOptions, FinalImage } from '../utils/cropImage';

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
    previewContainerRef: React.RefObject<HTMLDivElement | null>;
    onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
    handleImageUpload: (file: File) => void;
    handleDownload: () => void;
    handleApplyCrop: () => void;
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
    const [aspect, setAspect] = useState<number>(16 / 9);
    const [borderRadius, setBorderRadius] = useState<number>(0);
    const [textColor, setTextColor] = useState<string>('#ffffff');
    const [textVAlign, setTextVAlign] = useState<VAlign>('center'); // Corrected 'middle' to 'center'
    // 添加文字大小状态
    const [titleSize, setTitleSize] = useState<number>(32);
    const [contentSize, setContentSize] = useState<number>(18);
    // 添加文字位置状态
    const [textHAlign, setTextHAlign] = useState<'left' | 'center' | 'right'>('center');
    const [textOffsetX, setTextOffsetX] = useState<number>(0);
    const [textOffsetY, setTextOffsetY] = useState<number>(0);
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [completedCrop, setCompletedCrop] = useState<Area | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    // 定义新的 state
    const [croppedImageDimensions, setCroppedImageDimensions] = useState<{ width: number; height: number } | null>(null);
    const [isCropping, setIsCropping] = useState<boolean>(true);
    const previewContainerRef = useRef<HTMLDivElement>(null);

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        // Only set the crop if the values are valid numbers
        if (croppedAreaPixels && croppedAreaPixels.width && croppedAreaPixels.height) {
            setCompletedCrop(croppedAreaPixels);
        }
    }, []);

    const handleImageUpload = (file: File) => {
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result?.toString() ?? null);
                setCroppedImage(null);
                setCroppedImageDimensions(null); // 上传新图片时重置尺寸
                setIsCropping(true);
                setZoom(1);
            });
            reader.readAsDataURL(file);
        }
    };

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
                textOffsetY
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
                borderRadius: 0 
            });

            if (croppedImgResult) {
                setCroppedImage(croppedImgResult.url);
                setCroppedImageDimensions({ width: croppedImgResult.width, height: croppedImgResult.height });
            }
            setIsCropping(false);
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
        crop,
        setCrop,
        zoom,
        setZoom,
        completedCrop,
        isCropping,
        setIsCropping,
        croppedImage,
        croppedImageDimensions, // 传递新的 state
        previewContainerRef,
        onCropComplete,
        handleImageUpload,
        handleDownload,
        handleApplyCrop,
    };

    return (
        <CoverContext.Provider value={value}>
            {children}
        </CoverContext.Provider>
    );
}; 