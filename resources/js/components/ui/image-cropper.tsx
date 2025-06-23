import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Crop as CropIcon } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
    isOpen: boolean;
    onClose: () => void;
    onCropComplete: (croppedImageFile: File) => void;
    originalFile: File | null;
}

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    );
}

export function ImageCropper({ isOpen, onClose, onCropComplete, originalFile }: ImageCropperProps) {
    const [imgSrc, setImgSrc] = useState<string>('');
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const imgRef = useRef<HTMLImageElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    React.useEffect(() => {
        if (originalFile) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImgSrc(reader.result?.toString() || '');
            });
            reader.readAsDataURL(originalFile);
        }
    }, [originalFile]);

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, 1)); // 1:1 aspect ratio
    }, []);

    const getCroppedImg = useCallback(async (
        image: HTMLImageElement,
        crop: PixelCrop,
    ): Promise<File> => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        // Set canvas size to crop size
        canvas.width = crop.width;
        canvas.height = crop.height;

        // Draw the cropped image
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height,
        );

        // Convert to WebP
        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        throw new Error('Canvas is empty');
                    }
                    const file = new File([blob], `cropped-${Date.now()}.webp`, {
                        type: 'image/webp',
                        lastModified: Date.now(),
                    });
                    resolve(file);
                },
                'image/webp',
                0.9 // Quality
            );
        });
    }, []);

    const handleCropComplete = useCallback(async () => {
        if (!completedCrop || !imgRef.current) return;

        setIsProcessing(true);
        try {
            const croppedImageFile = await getCroppedImg(imgRef.current, completedCrop);
            onCropComplete(croppedImageFile);
            onClose();
        } catch (error) {
            console.error('Error cropping image:', error);
        } finally {
            setIsProcessing(false);
        }
    }, [completedCrop, getCroppedImg, onCropComplete, onClose]);

    const handleClose = () => {
        setImgSrc('');
        setCrop(undefined);
        setCompletedCrop(undefined);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white">
                        <CropIcon className="h-5 w-5 text-white" />
                        Crop Image (1:1 Ratio)
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {imgSrc && (
                        <div className="flex justify-center">
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={1}
                                minWidth={100}
                                minHeight={100}
                                keepSelection
                            >
                                <img
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={imgSrc}
                                    style={{ maxHeight: '60vh', maxWidth: '100%' }}
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>
                        </div>
                    )}

                    <div className="text-sm text-white text-center">
                        <p>Drag to adjust the crop area. The image will be converted to WebP format.</p>
                        <p>Recommended: Square images work best for product photos.</p>
                    </div>
                </div>

                <DialogFooter style={{
                    color: 'var(--light-text)'
                 }}>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCropComplete}
                        disabled={!completedCrop || isProcessing}
                        style={{
                            color: 'var(--light-text)'
                         }}
                    >
                        {isProcessing ? 'Processing...' : 'Crop & Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
