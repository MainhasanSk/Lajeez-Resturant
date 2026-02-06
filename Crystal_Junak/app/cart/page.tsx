'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, cartTotal } = useCart();

    return (
        <main className="bg-white min-h-screen text-gray-900">
            <Navbar />

            <div className="container mx-auto px-6 py-32">
                <h1 className="text-4xl md:text-5xl font-serif text-[#1f4d42] mb-12">Your Sanctuary</h1>

                {items.length === 0 ? (
                    <div className="text-center py-20 border border-gray-100 bg-gray-50 rounded-2xl">
                        <p className="text-gray-500 mb-8">Your cart is empty.</p>
                        <Link href="/shop" className="inline-block px-10 py-4 bg-[#1f4d42] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#163830] transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-8">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-6 p-6 bg-white border border-gray-100 rounded-xl hover:shadow-lg transition-shadow">
                                    {/* Image */}
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg p-2 flex-shrink-0">
                                        <img
                                            src={item.image_url || `/crystal-images/${item.folderName}/1.jpg`}
                                            alt={item.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-serif text-[#1f4d42]">{item.name}</h3>
                                                <p className="text-gray-400 text-sm">{item.subTitle}</p>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-400 hover:text-gray-900">
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-400 hover:text-gray-900">
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <span className="font-serif text-lg font-bold text-[#1f4d42]">₹{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 sticky top-32">
                                <h3 className="font-serif text-xl text-[#1f4d42] mb-8 border-b border-gray-200 pb-4">Order Summary</h3>

                                <div className="space-y-4 mb-8 text-sm">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Subtotal</span>
                                        <span>₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Shipping</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                    <div className="flex justify-between text-gray-900 font-bold text-lg pt-4 border-t border-gray-200">
                                        <span>Total</span>
                                        <span>₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                <Link href="/checkout" className="w-full bg-[#1f4d42] text-white py-4 font-bold text-xs uppercase tracking-widest hover:bg-[#163830] transition-colors flex items-center justify-center gap-2 rounded-lg shadow-lg">
                                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                                </Link>

                                <p className="text-center text-gray-400 text-[10px] mt-4 uppercase tracking-wider">
                                    Secure Checkout • Free Shipping Over ₹2000
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
