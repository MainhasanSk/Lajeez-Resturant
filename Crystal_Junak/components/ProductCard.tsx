'use client';

import { motion } from 'framer-motion';
import { Crystal } from '@/data/products';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

import Link from 'next/link';

interface Props {
    product: Crystal;
    index?: number;
    variant?: 'light' | 'dark';
}

export default function ProductCard({ product, index = 0, variant = 'dark' }: Props) {
    const { addToCart } = useCart();
    const router = useRouter();

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        router.push('/checkout');
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        // Optional: Add toast notification here
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group h-full"
        >
            <Link href={`/product/${product.id}`} className="block h-full relative">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col h-full ring-1 ring-gray-100/50">
                    {/* Image Area - Balanced Professional Ratio (4:3) */}
                    <div className="aspect-[4/3] bg-gray-50/30 p-4 relative flex items-center justify-center overflow-hidden">
                        {/* Elegant Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-tr ${product.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />

                        <img
                            src={product.image_url || `/crystal-images/${product.folderName}/1.jpg`}
                            alt={product.name}
                            className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500 ease-out z-10"
                        />

                        {/* Wishlist Button - Floating & Clean */}
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-all z-20"
                        >
                            <Heart className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-4 flex flex-col flex-grow">
                        {/* Title & Price */}
                        <div className="mb-2">
                            <h3 className="text-lg font-serif text-gray-900 leading-tight line-clamp-1 group-hover:text-cj-primary transition-colors mb-1">
                                {product.name}
                            </h3>
                            <p className="text-base font-bold text-cj-primary">
                                {product.formattedPrice}
                            </p>
                        </div>

                        {/* Description - Professional 1-liner */}
                        <p className="text-xs text-gray-500 line-clamp-1 mb-4 h-4">
                            {product.description}
                        </p>

                        {/* Action Buttons - Professional Grid */}
                        <div className="grid grid-cols-2 gap-2 mt-auto">
                            <div className="col-span-2 grid grid-cols-2 gap-2 mb-2">
                                <button
                                    onClick={handleBuyNow}
                                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-cj-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-cj-primary/90 transition-colors shadow-sm"
                                >
                                    Buy Now
                                </button>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-lg hover:border-cj-primary hover:text-cj-primary transition-colors bg-white"
                                >
                                    <ShoppingBag className="w-3 h-3" />
                                    Add
                                </button>
                            </div>

                            {/* View Details - Full Width Secondary Action */}
                            <div className="col-span-2">
                                <span className="flex items-center justify-center gap-2 w-full px-3 py-1.5 text-xs font-medium text-gray-400 group-hover:text-cj-primary transition-colors border-t border-gray-50 pt-2">
                                    <Eye className="w-3 h-3" />
                                    View Details
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
