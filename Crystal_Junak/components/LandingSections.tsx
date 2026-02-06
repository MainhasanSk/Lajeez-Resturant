'use client';


import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Truck, Sparkles, Gem, Check } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

// Featured Collections
export function FeaturedCollections() {
    const collections = [
        { name: "Health", image: "/assets/health.png", shadow: "shadow-emerald-900/50" },
        { name: "Relationship", image: "/assets/Relationship.png", shadow: "shadow-rose-900/50" },
        { name: "Money", image: "/assets/money.png", shadow: "shadow-amber-900/50" },
        { name: "Study", image: "/assets/study.png", shadow: "shadow-indigo-900/50" },
        { name: "Protection", image: "/assets/prtection.png", shadow: "shadow-black/50" },
    ];

    return (
        <section className="py-24 relative z-30 bg-white overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
                style={{ backgroundImage: "url('/assets/shop-by-intention-bg.png')" }}
            />
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl text-gray-900 font-serif tracking-wide drop-shadow-lg">
                        Shop by Intention
                    </h2>
                    <p className="text-gray-600 max-w-lg mx-auto">
                        Choose the energy you wish to invite into your life.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                    {collections.map((cat, i) => (
                        <div key={i} className="group cursor-pointer flex flex-col items-center gap-6">
                            {/* Round Image Box */}
                            <div className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full ${cat.shadow} shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2 overflow-hidden border-2 border-black/10`}>
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                />

                                {/* Inner Shine/Gloss Effect */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                            </div>

                            {/* Label */}
                            <h3 className="text-xl text-gray-900 font-serif tracking-wider group-hover:text-cj-secondary transition-colors text-shadow-sm">
                                {cat.name}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Best Sellers Section
// Best Sellers Section
import { Crystal } from '@/data/products';

export function BestSellers({ products }: { products: Crystal[] }) {
    // Select top 8 products (2 rows)
    const bestSellers = products.slice(0, 8);

    return (
        <section className="py-24 bg-[#f8f8f8] relative z-30 overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
                style={{ backgroundImage: "url('/assets/background.png')" }}
            />
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl text-gray-900 font-serif tracking-wide mb-4">
                        Our Best Sellers
                    </h2>
                    <p className="text-gray-600">
                        Curated favorites loved by our community.
                    </p>
                </div>

                {/* Product Grid - Reduced gap and using 4 columns to keep sizing balanced but denser */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {bestSellers.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} variant="light" />
                    ))}
                    {bestSellers.length === 0 && (
                        <div className="col-span-full text-center text-gray-400 py-12">
                            No products found.
                        </div>
                    )}
                </div>

                {/* View All Button */}
                <div className="flex justify-center">
                    <Link href="/shop" className="px-8 py-4 border border-black/20 text-black font-sans uppercase tracking-[0.2em] text-xs hover:bg-black hover:text-white transition-all duration-300">
                        View All Products
                    </Link>
                </div>
            </div>
        </section>
    );
}

// Benefits Section
export function Benefits() {
    const benefits = [
        { icon: Gem, title: "Authentic Crystals", desc: "100% natural, hand-selected stones." },
        { icon: ShieldCheck, title: "Ethically Sourced", desc: "Mines prioritizing worker safety." },
        { icon: Sparkles, title: "Energy Cleansed", desc: "Purified with sage before shipping." },
        { icon: Truck, title: "Secure Delivery", desc: "Insured shipping worldwide." },
    ];

    return (
        <section className="bg-white text-black py-32 relative z-30">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-serif mb-6 tracking-tight text-gray-900">
                        Sanctuary Stories
                    </h2>
                    <p className="text-gray-600 font-sans leading-relaxed">
                        Voices from our community of modern mystics.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {benefits.map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-full bg-cj-supporting/10 flex items-center justify-center mb-6 group-hover:bg-cj-primary group-hover:text-white transition-colors duration-300">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-serif mb-3">{item.title}</h3>
                            <p className="text-black/50 text-sm leading-relaxed max-w-xs">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Why Crystal Junak Section
export function WhyCrystalJunak() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Title */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20">
                    <h2 className="text-4xl md:text-6xl font-serif text-gray-900 font-bold tracking-tight">WHY</h2>
                    <div className="relative h-16 md:h-24 aspect-[3/1]">
                        <img
                            src="/assets/logo.svg"
                            alt="Crystal Junak"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-serif text-gray-900 font-bold tracking-tight">?</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column - Detailed Features */}
                    {/* Left Column - Detailed Features */}
                    <div className="space-y-12 relative">
                        {/* Background Image */}
                        <img
                            src="/assets/why-crystal-junak/crystal-image.svg"
                            alt=""
                            className="absolute inset-y-0 left-0 w-full h-full object-cover opacity-10 pointer-events-none z-0"
                        />

                        <div className="relative z-10 space-y-12">
                            {[
                                {
                                    title: "READY-TO-WEAR BRACELETS",
                                    desc: "No rituals needed! Our bracelets come pre-cleansed and energized — just wear and feel the energy.",
                                },
                                {
                                    title: "CHARGED & ACTIVATED CRYSTALS",
                                    desc: "Every crystal is properly charged with intention and energy to give you maximum benefit from day one.",
                                },
                                {
                                    title: "LAB-TESTED AUTHENTICITY",
                                    desc: "All our crystals are certified genuine by trusted gemological labs — no fake or dyed stones.",
                                },
                                {
                                    title: "PREMIUM QUALITY & DURABILITY",
                                    desc: "Strong elastic, polished crystals, and attention to detail — our bracelets are made to last.",
                                },
                                {
                                    title: "TRUSTED BY THOUSANDS",
                                    desc: "Happy customers all over India wear and trust Crystal Junak for real results.",
                                }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-2 group">
                                    <h3 className="text-xl md:text-2xl font-serif font-bold text-cj-primary uppercase tracking-wide">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 font-sans leading-relaxed text-lg">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Checkmarks Box */}
                    <div className="relative pt-32 lg:pt-0">
                        {/* Overlapping Crystal Image */}
                        <div className="absolute -top-40 md:-top-[26rem] left-1/2 -translate-x-1/2 w-96 h-96 md:w-[45rem] md:h-[45rem] z-20 hidden lg:block pointer-events-none">
                            <img
                                src="/assets/why-crystal-junak/CHARGED & ACTIVATED CRYSTALS.svg"
                                alt="Charged & Activated"
                                className="w-full h-full object-contain drop-shadow-xl"
                            />
                        </div>

                        {/* Decorative background box */}
                        <div className="absolute inset-0 bg-cj-highlight/10 transform rotate-3 rounded-[3rem]" />

                        <div className="relative bg-white border border-cj-secondary/20 p-8 md:p-12 rounded-[3rem] shadow-2xl space-y-8 overflow-hidden z-10">
                            {/* Background Logo */}
                            <img
                                src="/assets/logo.svg"
                                alt=""
                                className="absolute inset-0 m-auto w-2/3 h-2/3 object-contain opacity-10 pointer-events-none z-0"
                            />
                            {[
                                "100% NATURAL CRYSTALS",
                                "HANDCRAFTED WITH LOVE & CARE",
                                "PURE, UNTREATED & HIGH-VIBRATION STONES",
                                "ENERGY-CLEANSED & BLESSED"
                            ].map((text, i) => (
                                <div key={i} className="flex items-start gap-6 group relative z-10">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300">
                                        <Check className="w-6 h-6 text-green-700 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <span className="text-xl md:text-2xl font-serif font-bold text-gray-800 pt-2 uppercasetracking-wide">
                                        {text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}

// 7 Chakra Crystal Tree Section
export function SevenChakraTree() {
    const chakraColors = [
        "bg-purple-600", // Crown
        "bg-indigo-600", // Third Eye
        "bg-blue-500",   // Throat
        "bg-green-500",  // Heart
        "bg-yellow-400", // Solar Plexus
        "bg-orange-500", // Sacral
        "bg-red-600",    // Root
        "bg-pink-500",   // Extra/High Heart
        "bg-teal-500"    // Extra
    ];

    const benefits = [
        "Attracting prosperity & wealth",
        "Balances and aligns all seven chakras",
        "Attracts positive energy and harmony",
        "Reduces stress and negative vibes",
        "Enhances focus, clarity, and creativity",
        "Supports emotional and spiritual healing",
        "Removing negative energy",
        "Brings prosperity, abundance, and good luck",
        "Adds beauty and vibrance to your space"
    ];

    return (
        <section className="relative py-20 bg-white overflow-hidden font-sans">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/7-chakra-background.png"
                    alt=""
                    className="w-full h-full object-cover opacity-10"
                />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

                    {/* Left Column: Tree Image & Ribbons */}
                    <div className="relative w-full lg:w-1/2 flex justify-center">
                        {/* Best Seller Ribbon */}
                        <div className="absolute -top-4 -left-4 z-20 overflow-hidden w-32 h-32">
                            <div className="absolute top-0 left-0 bg-[#d4af37] text-white text-xs font-bold py-1 px-10 -rotate-45 translate-y-8 -translate-x-8 shadow-md tracking-wider uppercase">
                                Best Seller
                            </div>
                        </div>

                        {/* Tree Image */}
                        <div className="relative w-full max-w-md aspect-[4/5] z-10">
                            <img
                                src="/assets/7-chakra-tree.svg"
                                alt="7 Chakra Crystal Tree"
                                className="w-full h-full object-contain drop-shadow-2xl"
                            />
                        </div>

                        {/* Price Tag */}
                        <div className="absolute bottom-20 left-0 md:-left-8 z-20">
                            <div className="bg-[#fe0000] text-white font-bold text-2xl md:text-3xl px-6 py-2 rounded-r-full shadow-lg relative">
                                <span className="absolute left-0 top-0 bottom-0 w-2 bg-[#990000] -ml-2 rounded-l-md"></span>
                                Rs: 1499/-
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        {/* Title Header */}
                        <div className="flex flex-col md:flex-row items-start md:items-stretch">
                            <div className="bg-black text-white px-6 py-2 flex items-center">
                                <h2 className="text-3xl font-bold uppercase italic tracking-tighter">WHY</h2>
                            </div>
                            <div className="bg-[#fe0000] text-white px-4 py-2 flex items-center flex-grow">
                                <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">7 CHAKRA CRYSTAL TREE?</h2>
                            </div>
                        </div>

                        <div className="text-gray-700 text-sm md:text-base leading-relaxed space-y-4 font-medium">
                            <p>
                                A 7 Chakra Crystal Tree is often considered both decorative and energetically beneficial.
                                It’s said to help balance the body’s seven major chakras while bringing harmony, positivity, and good vibes into a space.
                            </p>
                            <p>
                                Here are the main benefits people associate with keeping one:
                            </p>
                        </div>

                        {/* Benefits List with Chakra Icons */}
                        <ul className="space-y-3">
                            {benefits.map((point, i) => (
                                <li key={i} className="flex items-center gap-4">
                                    {/* Chakra Icon/Bullet */}
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${chakraColors[i] || 'bg-gray-500'} flex items-center justify-center text-white border-2 border-white shadow-sm`}>
                                        <span className="text-xs font-bold">ॐ</span>
                                    </div>
                                    <span className="text-gray-800 font-medium text-sm md:text-base">
                                        {point}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* Order Now Button (Desktop aligned right, mobile centered) */}
                        <div className="flex justify-center md:justify-end pt-4">
                            <Link href="/shop" className="bg-[#9c2929] hover:bg-[#7a2020] text-white font-bold text-lg px-8 py-2 rounded-full shadow-lg border-2 border-white ring-2 ring-[#9c2929] transition-transform hover:scale-105 active:scale-95 uppercase italic">
                                Order Now
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Banner */}
                <div className="mt-16 bg-[#fe0000] text-white py-3 px-6 transform -skew-x-12 mx-4 md:mx-12 shadow-xl border-b-4 border-[#990000]">
                    <h3 className="text-center text-xl md:text-3xl font-bold uppercase tracking-widest skew-x-12">
                        100% NATURAL <span className="font-black">7 CHAKRA CRYSTAL TREE</span>
                    </h3>
                </div>
            </div>
        </section>
    );
}

// Testimonials Slider
export function Testimonials() {
    const reviews = [
        { text: "The energy from this Amethyst cathedral is palpable. It has completely transformed the vibe of my meditation space.", author: "Sarah M.", location: "New York" },
        { text: "Packaging was exquisite and the crystal arrived in perfect condition. You can feel the care that went into cleansing it.", author: "Rajiv K.", location: "Mumbai" },
        { text: "Authentication certificates give me such peace of mind. Truly a premium experience from start to finish.", author: "Elena R.", location: "London" },
        { text: "I bought the 7 Chakra tree and it is absolutely stunning. The colors are vibrant and it brings so much joy.", author: "Michael T.", location: "Sydney" },
        { text: "Fast shipping and excellent customer service. They really know their crystals!", author: "Jessica L.", location: "Toronto" },
        { text: "The clear quartz cluster I received is magnificent. It's the centerpiece of my living room now.", author: "David W.", location: "Berlin" },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    // Auto-slide every 5 seconds
    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="bg-white py-32 relative z-30 border-t border-black/5 overflow-hidden">
            {/* Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cj-supporting/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-center text-3xl font-serif text-gray-900 mb-20 tracking-wide">
                    Stories from the Community
                </h2>

                <div className="max-w-4xl mx-auto relative">
                    <div className="overflow-hidden relative min-h-[400px] md:min-h-[300px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
                            >
                                <div className="bg-gray-50 border border-gray-100 p-10 hover:border-cj-secondary/30 transition-colors relative group w-full rounded-3xl shadow-sm">
                                    <div className="text-6xl text-cj-secondary/20 font-serif absolute top-4 left-6">&quot;</div>
                                    <p className="text-xl md:text-2xl text-gray-700 italic font-serif leading-relaxed mb-8 relative z-10 px-8">
                                        {reviews[currentIndex].text}
                                    </p>
                                    <div>
                                        <h4 className="text-gray-900 font-sans text-lg tracking-widest uppercase font-bold">{reviews[currentIndex].author}</h4>
                                        <span className="text-gray-400 text-sm font-medium">{reviews[currentIndex].location}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center items-center gap-8 mt-8">
                        <button onClick={prev} className="p-3 rounded-full hover:bg-gray-100/50 text-gray-400 hover:text-cj-primary transition-all">
                            <span className="text-3xl">&larr;</span>
                        </button>

                        <div className="flex gap-2">
                            {reviews.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-cj-primary' : 'w-2 bg-gray-200 hover:bg-gray-300'}`}
                                />
                            ))}
                        </div>

                        <button onClick={next} className="p-3 rounded-full hover:bg-gray-100/50 text-gray-400 hover:text-cj-primary transition-all">
                            <span className="text-3xl">&rarr;</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
