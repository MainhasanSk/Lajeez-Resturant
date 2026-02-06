'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null); // To store authenticated user

    // ... (skip unchanged lines if possible, but replace block for safety) 



    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        state: ''
    });

    // Check auth on load
    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login?message=Please login to checkout');
            } else {
                setUser(user);
                // Pre-fill email if available
                setFormData(prev => ({ ...prev, email: user.email || '' }));
            }
        };
        checkUser();
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        if (!user) {
            setError("You must be logged in to place an order.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const supabase = createClient();

            // 1. Create Order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    customer_details: formData,
                    total: cartTotal,
                    status: 'pending'
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create Order Items
            const orderItems = items.map(item => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Success
            clearCart();
            router.push('/shop?order_success=true');

        } catch (err: unknown) {
            console.error(err);
            const message = err instanceof Error ? err.message : 'Something went wrong processing your order.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0 && !loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Your cart is empty</h2>
                    <p className="mt-2 text-gray-600">Add some crystals to your cart to proceed.</p>
                    <div className="mt-6">
                        <Link href="/shop" className="text-[#1f4d42] font-medium hover:text-[#163830]">
                            Go to Shop &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-serif font-bold text-[#1f4d42] mb-8 text-center">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Order Summary */}
                    <div className="bg-white p-6 rounded-xl shadow-lg h-fit order-2 lg:order-1">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">Order Summary</h2>
                        <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                            {items.map(item => (
                                <li key={item.id} className="py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden relative">
                                            {/* Ideally use Next.js Image component here if we had full valid paths */}
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 border-t pt-4">
                            <div className="flex justify-between items-center text-xl font-bold text-[#1f4d42]">
                                <span>Total</span>
                                <span>₹{cartTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Form */}
                    <div className="bg-white p-6 rounded-xl shadow-lg order-1 lg:order-2">
                        <h2 className="text-xl font-bold mb-6">Shipping Details</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">{error}</div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input type="text" name="firstName" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1f4d42] focus:border-[#1f4d42]" value={formData.firstName} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input type="text" name="lastName" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1f4d42] focus:border-[#1f4d42]" value={formData.lastName} onChange={handleChange} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" name="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1f4d42] focus:border-[#1f4d42]" value={formData.email} onChange={handleChange} readOnly />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input type="tel" name="phone" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1f4d42] focus:border-[#1f4d42]" value={formData.phone} onChange={handleChange} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <textarea name="address" required rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1f4d42] focus:border-[#1f4d42]" value={formData.address} onChange={handleChange}></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <input type="text" name="city" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1f4d42] focus:border-[#1f4d42]" value={formData.city} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">State</label>
                                    <input type="text" name="state" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1f4d42] focus:border-[#1f4d42]" value={formData.state} onChange={handleChange} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                                <input type="text" name="postalCode" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1f4d42] focus:border-[#1f4d42]" value={formData.postalCode} onChange={handleChange} />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-bold text-white bg-[#1f4d42] hover:bg-[#163830] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1f4d42] disabled:opacity-50 transition-colors"
                                >
                                    {loading ? 'Processing Order...' : `Place Order ₹${cartTotal.toLocaleString()}`}
                                </button>
                                <p className="text-center text-xs text-gray-500 mt-2">Cash on Delivery (COD) / Payment Gateway Integration Pending</p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
