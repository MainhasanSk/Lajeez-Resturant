'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { MessageCircle, Eye, X } from 'lucide-react';

interface OrderItem {
    id: string;
    product_id: string;
    price: number;
    quantity: number;

}

interface Order {
    id: string;
    created_at: string;
    status: string;
    total: number;
    customer_details: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        address?: string;
        city?: string;
        state?: string;
        postalCode?: string;
    };
    items?: OrderItem[];
}

export default function AdminOrderList({ initialOrders }: { initialOrders: Order[] }) {
    const supabase = createClient();
    // ... (rest of component setup same as before)
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [updating, setUpdating] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // ... (useEffect and map/handlers same)

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setUpdating(orderId);
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (!error) {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            router.refresh();
        } else {
            alert('Failed to update status');
        }
        setUpdating(null);
    };

    const getWhatsAppLink = (order: Order) => {
        const phone = order.customer_details?.phone;
        const name = order.customer_details?.firstName;
        if (!phone) return null;

        const cleanPhone = phone.replace(/\D/g, '');
        const message = `Hello ${name}, your order #${order.id.slice(0, 8)} status has been updated to: *${order.status.toUpperCase()}*. Thank you for shopping with Crystal Junak!`;
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    };

    return (
        <div>
            {/* ... header ... */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold dark:text-white">Orders</h1>
            </div>

            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    {/* ... thead ... */}
                    <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-zinc-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4 font-medium">Order ID</th>
                            <th className="p-4 font-medium">Customer</th>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-right">Total</th>
                            <th className="p-4 font-medium text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                        {orders?.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <td className="p-4 text-xs font-mono text-gray-500 dark:text-zinc-500">
                                    {order.id.slice(0, 8)}...
                                </td>
                                <td className="p-4 dark:text-white">
                                    <div className="font-medium">{order.customer_details?.firstName} {order.customer_details?.lastName}</div>
                                    <div className="text-xs text-gray-500">{order.customer_details?.email}</div>
                                </td>
                                <td className="p-4 text-sm text-gray-500 dark:text-zinc-400">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right font-bold dark:text-white">
                                    ₹{order.total.toLocaleString()}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <select
                                            className="text-xs border rounded p-1 dark:bg-zinc-800 dark:text-white max-w-[100px]"
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                            disabled={updating === order.id}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>

                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="p-1.5 text-gray-500 hover:text-cj-primary hover:bg-gray-100 rounded transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>

                                        {getWhatsAppLink(order) && (
                                            <a
                                                href={getWhatsAppLink(order)!}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                                                title="Send WhatsApp Update"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-white/10">
                            <h2 className="text-xl font-bold dark:text-white">Order Details <span className="text-gray-400 text-base font-normal">#{selectedOrder.id.slice(0, 8)}</span></h2>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Customer Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer</h3>
                                    <p className="font-bold text-lg dark:text-white">{selectedOrder.customer_details?.firstName} {selectedOrder.customer_details?.lastName}</p>
                                    <p className="text-gray-600 dark:text-zinc-400">{selectedOrder.customer_details?.email}</p>
                                    <p className="text-gray-600 dark:text-zinc-400">{selectedOrder.customer_details?.phone}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shipping Address</h3>
                                    <p className="text-gray-600 dark:text-zinc-400 whitespace-pre-line">
                                        {selectedOrder.customer_details?.address}<br />
                                        {selectedOrder.customer_details?.city}, {selectedOrder.customer_details?.state} - {selectedOrder.customer_details?.postalCode}
                                    </p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Items Ordered</h3>
                                <div className="bg-gray-50 dark:bg-white/5 rounded-lg overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-100 dark:bg-white/10 text-gray-500">
                                            <tr>
                                                <th className="p-3">Product ID</th>
                                                <th className="p-3 text-right">Price</th>
                                                <th className="p-3 text-right">Qty</th>
                                                <th className="p-3 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                                            {selectedOrder.items?.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="p-3 font-mono text-xs dark:text-zinc-300">{item.product_id}</td>
                                                    <td className="p-3 text-right dark:text-zinc-300">₹{item.price.toLocaleString()}</td>
                                                    <td className="p-3 text-right dark:text-zinc-300">{item.quantity}</td>
                                                    <td className="p-3 text-right font-medium dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="flex justify-end">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 dark:text-zinc-400">Total Amount</p>
                                    <p className="text-3xl font-bold text-cj-primary dark:text-white">₹{selectedOrder.total.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                            {getWhatsAppLink(selectedOrder) && (
                                <a
                                    href={getWhatsAppLink(selectedOrder)!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Send Update on WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
