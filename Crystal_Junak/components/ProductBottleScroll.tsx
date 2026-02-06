'use client';

import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useScroll } from 'framer-motion';
import { Crystal } from '@/data/products';
import ProductTextOverlays from './ProductTextOverlays';

interface Props {
    crystal: Crystal;
}

const FRAME_COUNT = 120;

export default function ProductBottleScroll({ crystal }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Scroll logic: target the container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Preload images
    useEffect(() => {
        let loadedCount = 0;
        const imgs: HTMLImageElement[] = [];
        const needed = FRAME_COUNT;

        for (let i = 1; i <= needed; i++) {
            const img = new Image();
            // Ensure path format matches public structure
            img.src = `/crystal-images/${crystal.folderName}/${i}.jpg`;
            img.onload = () => {
                loadedCount++;
                setLoadProgress(Math.round((loadedCount / needed) * 100));
                if (loadedCount === needed) {
                    setImagesLoaded(true);
                }
            };
            // Optional: handle error if image missing
            img.onerror = () => {
                console.warn(`Failed to load frame ${i} for ${crystal.name}`);
                loadedCount++; // Count anyway to avoid stall
                setLoadProgress(Math.round((loadedCount / needed) * 100));
                if (loadedCount === needed) {
                    setImagesLoaded(true);
                }
            };
            imgs.push(img);
        }
        setImages(imgs);

        // Cleanup? images are in memory.
    }, [crystal.folderName, crystal.name]);

    // Block scroll while loading
    useEffect(() => {
        if (!imagesLoaded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto'; // or 'unset'
        }
    }, [imagesLoaded]);

    // Canvas drawing loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !imagesLoaded || images.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Use scrollYProgress to determine frame
        // We subscribe to the MotionValue changes
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            // Finish animation at 85% of the scroll container
            const BUFFER_THRESHOLD = 0.85;
            const animProgress = Math.min(1, latest / BUFFER_THRESHOLD);

            const frameIndex = Math.min(
                FRAME_COUNT - 1,
                Math.floor(animProgress * FRAME_COUNT)
            );

            const img = images[frameIndex];
            if (img) {
                // Clear and draw
                // High DPI handling
                // const dpr = window.devicePixelRatio || 1;

                // Simple approach: clear rect
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw image "cover" (or full width)
                const hRatio = canvas.width / img.width;
                const vRatio = canvas.height / img.height;
                const ratio = Math.max(hRatio, vRatio);

                const centerShift_x = (canvas.width - img.width * ratio) / 2;
                const centerShift_y = (canvas.height - img.height * ratio) / 2;

                ctx.drawImage(
                    img,
                    0, 0, img.width, img.height,
                    centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
                );
            }
        });

        // Initial draw (frame 0)
        scrollYProgress.set(0);
        if (images[0]) {
            const img = images[0];
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);
            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
                img,
                0, 0, img.width, img.height,
                centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
            );
        }

        return () => unsubscribe();
    }, [scrollYProgress, images, imagesLoaded]);

    // Handle Resize using ResizeObserver for exact element match
    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        const resizeCanvas = () => {
            if (canvasRef.current && containerRef.current) {
                // Match the sticky viewports size exactly
                const width = window.innerWidth;
                const height = window.innerHeight;

                canvasRef.current.width = width;
                canvasRef.current.height = height;
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    // Portal for the loading screen to ensure it stays fixed relative to the viewport
    // and isn't affected by parent transforms or stacking contexts.
    if (!imagesLoaded) {
        return (
            <div ref={containerRef} className="relative w-full h-[500vh] bg-black">
                {/* Placeholder for layout while loading - keeps the space correct */}
                <div className="fixed top-0 left-0 w-full h-[100dvh] overflow-hidden bg-black" />

                {mounted && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050507] text-white overflow-hidden"
                        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-cj-primary/30 border-t-cj-primary rounded-full animate-spin mb-6" />
                            <h2 className="text-xl font-light tracking-[0.2em] mb-2 animate-pulse text-cj-secondary">
                                SUMMONING {crystal.name.toUpperCase()}
                            </h2>
                            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-cj-primary transition-all duration-300"
                                    style={{ width: `${loadProgress}%` }}
                                />
                            </div>
                            <span className="text-xs text-white/30 mt-2">{loadProgress}%</span>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative w-full h-[500vh] bg-black">
            {/* Fixed Viewport so it doesn't scroll away */}
            <div className="fixed top-0 left-0 w-full h-[100dvh] overflow-hidden">

                {/* Background Gradient Spot */}
                <div className={`absolute inset-0 opacity-30 bg-gradient-to-b ${crystal.bgGradient}`} />
                <div className="absolute w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                {/* Canvas - Absolute Inset to guarantee fixed position feel */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlays */}
                <ProductTextOverlays crystal={crystal} scrollYProgress={scrollYProgress} />

            </div>
        </div>
    );
}
