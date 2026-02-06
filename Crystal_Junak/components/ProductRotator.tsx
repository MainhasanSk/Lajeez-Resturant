'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Crystal } from '@/data/products';
import { RotateCw } from 'lucide-react';

interface Props {
    crystal: Crystal;
}

const FRAME_COUNT = 120; // Assuming same frame count

export default function ProductRotator({ crystal }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [lastX, setLastX] = useState(0);

    // Preload Images
    useEffect(() => {
        let loadedCount = 0;
        const imgs: HTMLImageElement[] = [];
        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            img.src = `/crystal-images/${crystal.folderName}/${i}.jpg`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === FRAME_COUNT) setLoaded(true);
            };
            // Fallback
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === FRAME_COUNT) setLoaded(true);
            };
            imgs.push(img);
        }
        setImages(imgs);
    }, [crystal]);

    // Draw Frame
    const drawFrame = useCallback((frameIndex: number) => {
        const canvas = canvasRef.current;
        if (!canvas || !images[frameIndex]) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = images[frameIndex];

        // Clear & Draw
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        // Fit image contain
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.min(hRatio, vRatio) * 0.9; // 90% size to breathe

        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;

        // Safety check: Don't draw if image is broken or not loaded
        if (!img.complete || img.naturalWidth === 0) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        try {
            ctx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        } catch (e) {
            console.warn('Failed to draw frame:', frameIndex, e);
        }
    }, [images]);

    useEffect(() => {
        if (loaded) {
            drawFrame(currentFrame);
        }
    }, [loaded, currentFrame, images, drawFrame]);

    // Interaction Handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setLastX(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        const delta = e.clientX - lastX;
        setLastX(e.clientX);

        // Sensitivity
        if (Math.abs(delta) > 0) {
            let nextFrame = currentFrame - Math.sign(delta); // Invert direction for natural feel
            if (nextFrame < 0) nextFrame = FRAME_COUNT - 1;
            if (nextFrame >= FRAME_COUNT) nextFrame = 0;
            setCurrentFrame(nextFrame);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Touch support
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setLastX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const delta = e.touches[0].clientX - lastX;
        setLastX(e.touches[0].clientX);

        if (Math.abs(delta) > 0) {
            let nextFrame = currentFrame - Math.floor(delta / 2);
            if (nextFrame < 0) nextFrame = FRAME_COUNT + nextFrame;
            if (nextFrame >= FRAME_COUNT) nextFrame = nextFrame % FRAME_COUNT;
            setCurrentFrame(nextFrame);
        }
    };


    return (
        <div
            className="w-full h-full relative cursor-grab active:cursor-grabbing bg-cj-charcoal/50 rounded-2xl border border-white/5 overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
        >
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center text-white/20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            )}

            <canvas ref={canvasRef} className="w-full h-full object-contain pointer-events-none" />

            {/* Overlay hint */}
            <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-xs text-white/50 pointer-events-none transition-opacity duration-500 ${isDragging ? 'opacity-0' : 'opacity-100'}`}>
                <RotateCw className="w-3 h-3" />
                <span>Drag to Rotate</span>
            </div>
            <div className={`absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-cj-gold text-black rounded-full text-[10px] font-bold uppercase tracking-wider pointer-events-none`}>
                360° View
            </div>
        </div>
    );
}
