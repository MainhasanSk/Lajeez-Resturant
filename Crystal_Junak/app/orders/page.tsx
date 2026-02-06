import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
    id: string;
    product_id: string;
    quantity: number;
    price: number;
}

export default async function OrdersPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?message=Please login to view your orders');
    }

    const { data: orders } = await supabase
        .from('orders')
        .select(`
            *,
            items: order_items (
                id,
                product_id,
                quantity,
                price
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-[#1f4d42]">Your Orders</h1>
                    <Link href="/shop" className="text-sm font-bold uppercase tracking-wider text-[#1f4d42] hover:text-[#163830]">
                        Continue Shopping
                    </Link>
                </div>

                <div className="space-y-6">
                    {orders?.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                            {/* ... header ... */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center">
                                {/* ... (keep header content unchanged or assume its cleaner to just replace the problematic part if simpler, but context makes it safer to replace block) */}
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order Placed</p>
                                    <p className="text-sm font-medium text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total</p>
                                    <p className="text-sm font-medium text-gray-900">₹{order.total.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                        ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex-grow text-right">
                                    <p className="text-xs text-gray-400 font-mono">ID: {order.id.slice(0, 8)}...</p>
                                </div>
                            </div>
                            <div className="px-6 py-6">
                                <h4 className="text-sm font-bold text-gray-900 mb-4">Items</h4>
                                {/* ... existing code ... */}

                                <ul className="divide-y divide-gray-100">
                                    {(order.items as unknown as OrderItem[])?.map((item) => (
                                        <li key={item.id} className="py-2 flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                {/* Ideally fetch product details to get name/image, for now using ID/Price */}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Product ID: {item.product_id}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">₹{item.price.toLocaleString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}

                    {(!orders || orders.length === 0) && (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                            <p className="mt-2 text-gray-500">Start your journey with Crystal Junak today.</p>
                            <div className="mt-6">
                                <Link href="/shop" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1f4d42] hover:bg-[#163830]">
                                    Shop Now
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
