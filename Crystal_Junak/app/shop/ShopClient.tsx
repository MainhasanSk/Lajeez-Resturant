'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Crystal } from '@/data/products';
import { ChevronDown } from 'lucide-react';

interface ShopClientProps {
    products: Crystal[];
}

export default function ShopClient({ products }: ShopClientProps) {
    const [activeFilter, setActiveFilter] = useState('All');
    const [sortBy, setSortBy] = useState('newest');

    // Categories Data
    const collections = [
        { name: "Health", image: "/assets/health.png", shadow: "shadow-emerald-900/10" },
        { name: "Relationship", image: "/assets/Relationship.png", shadow: "shadow-rose-900/10" },
        { name: "Money", image: "/assets/money.png", shadow: "shadow-amber-900/10" },
        { name: "Study", image: "/assets/study.png", shadow: "shadow-indigo-900/10" },
        { name: "Protection", image: "/assets/prtection.png", shadow: "shadow-black/10" },
    ];

    // Filter logic
    console.log('Active Filter:', activeFilter);
    console.log('Sample Product Categories:', products[0]?.categories);

    const filteredProducts = products.filter(p => {
        if (activeFilter === 'All') return true;
        return p.categories?.includes(activeFilter);
    }).sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        return 0; // newest/default
    });

    return (
        <main className="bg-gray-50 min-h-screen text-gray-900 selection:bg-cj-secondary selection:text-white">
            <Navbar />

            {/* Header / Hero */}
            <div className="pt-32 pb-12 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4 tracking-tight">Shop All Crystals</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto font-sans leading-relaxed">
                        Explore our ethically sourced collection of vibrational stones, cleared and charged for your journey.
                    </p>
                </div>
            </div>

            {/* Shop by Intention (Categories) */}
            <div className="bg-white border-b border-gray-100 py-12">
                <div className="container mx-auto px-6">
                    <h2 className="text-center text-xl font-serif text-gray-900 mb-8">Shop by Intention</h2>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                        {collections.map((cat, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveFilter(cat.name)}
                                className={`group cursor-pointer flex flex-col items-center gap-4 transition-all duration-300 ${activeFilter === cat.name ? 'opacity-100 scale-105' : 'opacity-70 hover:opacity-100'}`}
                            >
                                {/* Round Image Box */}
                                <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg transition-transform duration-500 overflow-hidden border-2 ${activeFilter === cat.name ? 'border-cj-primary ring-2 ring-cj-primary/20' : 'border-gray-100 bg-gray-50'}`}>
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover transition-opacity duration-500"
                                    />
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                                </div>
                                {/* Label */}
                                <h3 className={`text-sm font-sans font-bold uppercase tracking-wider transition-colors ${activeFilter === cat.name ? 'text-cj-primary' : 'text-gray-700 group-hover:text-cj-primary'}`}>
                                    {cat.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-16">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Product Grid */}
                    <div className="flex-1">
                        {/* Sorting */}
                        <div className="flex justify-between items-center mb-8">
                            <div className="text-sm text-gray-500 hidden lg:block">
                                Showing <span className="text-gray-900 font-bold">{filteredProducts.length}</span> Products
                            </div>
                            <div className="relative group ml-auto">
                                <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-cj-primary uppercase tracking-widest font-medium">
                                    Sort By: Newest <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product, idx) => (
                                <div key={product.id} className="h-full">
                                    <ProductCard product={product} index={idx} variant="light" />
                                </div>
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="col-span-full py-20 text-center text-gray-400">
                                    No products found.
                                </div>
                            )}
                        </div>

                        {/* Pagination / Load More */}
                        <div className="mt-20 text-center border-t border-gray-200 pt-12">
                            <button className="px-10 py-4 bg-gray-900 text-white text-xs tracking-[0.2em] uppercase hover:bg-cj-secondary transition-all duration-300 rounded shadow-lg">
                                Load More
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    );
}
