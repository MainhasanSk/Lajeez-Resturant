'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import ProductCard from '@/components/ProductCard';
import { ShoppingBag, Star, ShieldCheck, Truck, Minus, Plus } from 'lucide-react';
import { Crystal } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface ProductDetailsClientProps {
    product: Crystal;
    relatedProducts: Crystal[];
}

export default function ProductDetailsClient({ product, relatedProducts }: ProductDetailsClientProps) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product, quantity);
        // Optional: Show toast or feedback
    };

    return (
        <main className="bg-white min-h-screen text-gray-900">
            <Navbar />

            <div className="container mx-auto px-6 py-32">

                {/* Breadcrumbs */}
                <div className="flex gap-2 text-xs text-gray-400 uppercase tracking-widest mb-8">
                    <span>Shop</span> / <span>Crystals</span> / <span className="text-cj-primary font-bold">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">

                    {/* Left: Static Image */}
                    <div className="w-full aspect-square lg:aspect-[4/3] relative bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center p-8 border border-gray-100">
                        {/* Background Gradient Spot */}
                        <div className={`absolute inset-0 bg-gradient-to-tr ${product.bgGradient} opacity-10`} />

                        <img
                            src={product.image_url || `/crystal-images/${product.folderName}/1.jpg`}
                            alt={product.name}
                            className="w-full h-full object-contain drop-shadow-xl z-10 hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    {/* Right: Info */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif text-cj-primary mb-2">{product.name}</h1>
                            <p className="text-cj-violet font-medium tracking-wide">{product.subTitle}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-light text-gray-900">{product.formattedPrice}</span>
                            <div className="flex gap-1 text-cj-gold text-xs items-center pl-4 border-l border-gray-200">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                                <span className="text-gray-400 ml-1">(24 Reviews)</span>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 w-full" />

                        <div className="space-y-6">
                            <p className="text-gray-600 leading-relaxed font-sans">
                                {product.description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="pt-8">
                            <div className="flex flex-col gap-4 mb-6">
                                {/* Add to Cart - Enhanced */}
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-cj-primary text-white text-lg font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-cj-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-cj-primary/20 flex items-center justify-center gap-3"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    Add to Cart
                                </button>

                                {/* Quantity Selector - Secondary */}
                                <div className="flex items-center justify-center gap-6 py-2">
                                    <span className="text-sm text-gray-400 font-medium">Quantity</span>
                                    <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-full px-4 py-1">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-cj-primary transition-colors">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center text-base font-bold text-gray-900">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-cj-primary transition-colors">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-50">
                                <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-cj-gold" /> Free Shipping all over India</span>
                                <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-cj-gold" /> Authenticity Guaranteed</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div className="border-t border-gray-100 pt-24">
                    <h2 className="text-3xl font-serif text-cj-primary mb-12">You May Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {relatedProducts.map((p, i) => (
                            <ProductCard key={p.id} product={p} index={i} variant="light" />
                        ))}
                    </div>
                </div>

            </div>

            <Footer />
        </main>
    );
}
