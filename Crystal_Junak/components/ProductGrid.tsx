'use client';

import { products } from '@/data/products';
import { motion } from 'framer-motion';
import { useState } from 'react';

const CATEGORIES = ["All Crystals", "Healing Sets", "Raw Clusters", "Accessories"];

export default function ProductGrid() {
    const [activeCategory, setActiveCategory] = useState("All Crystals");

    return (
        <section className="py-32 bg-[#050507] relative z-10 border-t border-white/5">
            <div className="container mx-auto px-6">

                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-violet-400 text-sm font-bold tracking-widest uppercase mb-2">Curated Energies</h4>
                        <h2 className="text-4xl md:text-5xl font-bold text-white">The Collection</h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex gap-6 border-b border-white/10 pb-4 overflow-x-auto w-full md:w-auto"
                    >
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`text-sm tracking-wide whitespace-nowrap transition-colors ${activeCategory === cat ? 'text-white font-medium' : 'text-white/40 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
                    {products.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group"
                        >
                            {/* Unified Card Box */}
                            <div className="h-full bg-[#0a0a0c] border border-white/5 rounded-2xl overflow-hidden hover:border-violet-500/30 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.1)] relative">

                                {/* Image Area */}
                                <div className="relative aspect-[4/5] bg-[#0f0f13] overflow-hidden">

                                    {/* Badge */}
                                    {idx === 3 && (
                                        <span className="absolute top-4 left-4 z-20 bg-white/10 backdrop-blur-md text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-sm">
                                            New Arrival
                                        </span>
                                    )}

                                    {/* Wishlist Button */}
                                    <button className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white hover:bg-violet-500 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 delay-75">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                        </svg>
                                    </button>

                                    {/* Background Gradient Spot */}
                                    <div className={`absolute inset-0 bg-gradient-to-tr ${product.bgGradient} opacity-0 group-hover:opacity-30 transition-opacity duration-700`} />

                                    <div className="absolute inset-0 flex items-center justify-center p-8">
                                        <img
                                            src={`/crystal-images/${product.folderName}/1.jpg`}
                                            alt={product.name}
                                            className="object-contain w-full h-full drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>

                                    {/* Quick Actions Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-2 z-20">
                                        <button className="w-full bg-white text-black py-3 rounded-lg font-bold text-xs tracking-widest hover:bg-violet-100 transition-colors shadow-lg flex items-center justify-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 5c.07.286.074.58.012.863l-.567 2.688c-.147.697-.768 1.192-1.48 1.192H5.632c-.712 0-1.332-.495-1.479-1.192l-.567-2.688a1.99 1.99 0 0 1 .012-.863l1.263-5C4.98 8.441 5.378 8.017 5.86 8.017H18.14c.482 0 .88.423 1.002.906Z" />
                                            </svg>
                                            ADD TO CART
                                        </button>
                                        <button className="w-full bg-white/10 backdrop-blur-md text-white py-2 rounded-lg font-medium text-xs tracking-widest hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                            QUICK VIEW
                                        </button>
                                    </div>
                                </div>

                                {/* Info Area - Now inside the box */}
                                <div className="p-6 relative bg-[#0a0a0c]">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg text-white font-medium group-hover:text-violet-300 transition-colors">{product.name}</h3>
                                        <p className="text-white font-medium">{product.formattedPrice}</p>
                                    </div>
                                    <p className="text-white/40 text-xs mb-4 line-clamp-1">{product.subTitle}</p>

                                    {/* Rating */}
                                    <div className="flex gap-1 text-yellow-500/80 text-xs items-center">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                            </svg>
                                        ))}
                                        <span className="text-white/20 ml-2 text-[10px] tracking-wide">24 REVIEWS</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Load More */}
                <div className="mt-24 text-center">
                    <button className="px-8 py-3 border border-white/20 text-white text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300">
                        View All Products
                    </button>
                </div>

            </div>
        </section>
    );
}
