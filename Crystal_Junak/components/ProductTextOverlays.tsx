'use client';

import { Crystal } from '@/data/products';
import { MotionValue, motion, useTransform } from 'framer-motion';

interface Props {
    crystal?: Crystal;
    scrollYProgress: MotionValue<number>;
}

export default function ProductTextOverlays({ scrollYProgress }: Props) {
    // 1. Initial Hero Text (Fades out by 40% scroll)
    const opacity1 = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.35], [0, -50]);
    const scale1 = useTransform(scrollYProgress, [0, 0.35], [1, 0.9]);

    // 2. Secondary Text (Fades in after 45%, stays until 90%)
    const opacity2 = useTransform(scrollYProgress, [0.45, 0.6, 0.8, 1], [0, 1, 1, 0]);
    const y2 = useTransform(scrollYProgress, [0.45, 0.6, 1], [50, 0, -50]);
    const scale2 = useTransform(scrollYProgress, [0.45, 0.8], [0.9, 1.1]);

    return (
        <div className="absolute inset-0 z-20 w-full h-full pointer-events-none">

            {/* --- SECTION 1: Timeless Energy --- */}
            <motion.div
                style={{ opacity: opacity1, y: y1, scale: scale1 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
            >
                <div className="flex flex-col items-center text-center px-4 max-w-7xl mx-auto space-y-8">
                    {/* Intro */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-sm md:text-base font-sans font-medium tracking-[0.4em] text-white/60 uppercase"
                    >
                        Est. 2026
                    </motion.p>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="text-5xl md:text-7xl lg:text-9xl font-serif text-white tracking-widest leading-tight"
                    >
                        Timeless Energy. <br />
                        <span className="italic text-white/50">Crafted by Nature.</span>
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="max-w-md text-white/50 font-sans leading-relaxed tracking-wide text-sm md:text-base"
                    >
                        Discover the vibrational elegance of ethically sourced crystals, curated for the modern collector.
                    </motion.p>

                    {/* Minimalist Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="pointer-events-auto mt-8 border-b border-white text-white pb-1 hover:text-white/70 hover:border-white/70 transition-all uppercase tracking-[0.2em] text-xs"
                    >
                        Explore Collection
                    </motion.button>
                </div>
            </motion.div>


            {/* --- SECTION 2: Magic Happens --- */}
            <motion.div
                style={{ opacity: opacity2, y: y2, scale: scale2 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
            >
                <div className="text-center px-6 max-w-5xl mx-auto">
                    <h2 className="text-4xl md:text-6xl lg:text-8xl font-serif leading-tight text-white drop-shadow-2xl">
                        When energy meets intention, <br />
                        <span className="italic text-cj-secondary">magic happens.</span>
                    </h2>
                </div>
            </motion.div>

        </div>
    );
}
