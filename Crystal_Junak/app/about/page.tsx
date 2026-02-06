'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <main className="bg-gray-50 min-h-screen text-gray-900 selection:bg-cj-secondary selection:text-white flex flex-col">
            <Navbar />

            {/* Main Content Section */}
            <section className="relative flex-grow flex items-center justify-center py-32 md:py-48 overflow-hidden min-h-[80vh]">

                {/* Background Image (Same as 7 Chakra Tree Section) */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/7-chakra-background.png"
                        alt="Background"
                        className="w-full h-full object-cover opacity-20 pointer-events-none"
                    />
                    {/* Subtle Overlay to ensure text readability */}
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Title */}
                        <h1 className="text-4xl md:text-6xl font-serif text-gray-900 mb-8 tracking-tight drop-shadow-sm">
                            Welcome to Crystal Junak
                        </h1>

                        {/* Divider */}
                        <div className="w-24 h-1 bg-cj-secondary mx-auto mb-10 rounded-full" />

                        {/* Body Text */}
                        <div className="space-y-8 text-lg md:text-xl text-gray-700 font-sans leading-relaxed">
                            <p>
                                At <span className="font-semibold text-cj-primary">Crystal Junak</span>, we believe in the power of crystals to bring balance, positivity, and transformation into your life. Each crystal in our collection is carefully sourced, cleansed, and energized to ensure it carries the purest vibrations. Whether you’re seeking healing energy, spiritual growth, or a touch of natural beauty, we’re here to guide you on your journey.
                            </p>

                            <p className="font-medium text-gray-800">
                                Our mission is simple — to connect you with crystals that inspire, heal, and empower.
                            </p>

                            <p className="text-gray-100 italic">&quot;The energy of the universe is within you&quot;</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
