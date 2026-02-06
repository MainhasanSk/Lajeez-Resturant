'use client';

import { useState, useEffect } from 'react';
import ProductBottleScroll from '@/components/ProductBottleScroll';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Crystal } from '@/data/products'; // Keep using the interface

import { FeaturedCollections, Benefits, Testimonials, BestSellers, WhyCrystalJunak, SevenChakraTree } from '@/components/LandingSections';
import ConsultationSection from '@/components/ConsultationSection';

interface HomeClientProps {
    products: Crystal[];
}

const DEFAULT_CRYSTAL: Crystal = {
    id: 'default-preview',
    name: 'Amethyst',
    subTitle: 'The Stone of Spiritual Clarity',
    description: 'A powerful and protective stone that helps to relieve stress and strain, soothe irritability, balance mood swings, dispel anger, rage, fear and anxiety.',
    energy: 'Tranquility • Protection • Insight',
    folderName: 'amethyst', // We need to ensure this folder exists in public/crystal-images/
    color: '#9b4dca',
    bgGradient: 'from-purple-900 via-black to-black',
    price: 0,
    formattedPrice: 'Coming Soon',
    details: {
        origin: 'Unknown',
        chakra: 'All',
        zodiac: 'All'
    },
    stock: 0
};

export default function HomeClient({ products }: HomeClientProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Scroll reset on change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [currentIndex]);

    const next = () => setCurrentIndex((prev) => (prev + 1) % products.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);

    const hasProducts = products && products.length > 0;
    const displayProduct = hasProducts ? products[currentIndex] : DEFAULT_CRYSTAL;

    return (
        <main className="bg-cj-background min-h-screen text-gray-900 selection:bg-cj-primary selection:text-white">
            <Navbar />

            {/* 1. Scrollytelling Section */}
            <ProductBottleScroll key={hasProducts ? displayProduct.id : 'default-hero'} crystal={displayProduct} />

            {/* 2. Landing Layout Sections */}
            <div className="relative z-30">
                <FeaturedCollections />
                <BestSellers products={products} />
                <WhyCrystalJunak />
                <SevenChakraTree />
                <ConsultationSection />
                <Testimonials />
                <Benefits />
                <Footer />
            </div>

            {/* Navigation Controls - Only show if we have REAL products */}
            {hasProducts && (
                <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-center gap-4 items-center pointer-events-none">
                    <div className="pointer-events-auto bg-white/80 backdrop-blur-xl rounded-full px-6 py-3 flex items-center gap-8 border border-black/5 shadow-2xl">
                        <button onClick={prev} className="text-black/50 hover:text-black transition-colors text-xl">
                            &larr;
                        </button>
                        <div className="flex gap-3">
                            {products.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? 'bg-cj-secondary w-8' : 'bg-black/20 w-1.5 hover:bg-black/50'}`}
                                />
                            ))}
                        </div>
                        <button onClick={next} className="text-white/50 hover:text-white transition-colors text-xl">
                            &rarr;
                        </button>
                    </div>
                </div>
            )}

        </main>
    );
}
