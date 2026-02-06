import { createClient } from '@/utils/supabase/server';
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default async function AdminDashboard() {
    const supabase = await createClient();

    // 1. Fetch Stats
    // Product Count
    const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

    // Order Count
    const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });

    // Revenue (Sum of 'total' in orders where status == 'completed')
    const { data: revenueData } = await supabase.from('orders').select('total').eq('status', 'completed');
    const totalRevenue = revenueData?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;

    // Customers (Approximation: Count unique emails from order_items -> orders join? Or just use order count for now as MVP)
    // For MVP, we'll use order count or a placeholder if no users table access. 
    // Let's us order count as "Transactions" or "Active Orders" for now.

    // Total Order Value (Sum of 'total' in orders where status != cancelled)
    const { data: allOrderData } = await supabase.from('orders').select('total').neq('status', 'cancelled');
    const totalOrderValue = allOrderData?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;

    // 2. Fetch Recent Orders (Limit 3)
    const { data: recentOrders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

    const stats = [
        { name: 'Total Products', value: productCount || 0, icon: Package, color: 'bg-purple-500', gradient: 'from-purple-500 to-indigo-500' },
        { name: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-emerald-500', gradient: 'from-emerald-400 to-teal-500' },
        { name: 'Total Orders', value: orderCount || 0, icon: ShoppingBag, color: 'bg-rose-500', gradient: 'from-rose-500 to-pink-500' },
        { name: 'Total Order Value', value: `₹${totalOrderValue.toLocaleString()}`, icon: DollarSign, color: 'bg-blue-500', gradient: 'from-blue-400 to-cyan-500' },
    ];

    return (
        <div>
            <div className="mb-10">
                <h1 className="text-4xl font-serif font-bold text-[#2D1B4E] mb-2">Dashboard</h1>
                <p className="text-gray-500">Welcome back to your Crystal Junak command center.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group relative overflow-hidden">

                        {/* Background Decoration */}
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110`} />

                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-md group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold px-2 py-1 bg-gray-50 text-gray-400 rounded-full uppercase tracking-wider">
                                Live
                            </span>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity / Quick Actions Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-bold text-[#2D1B4E] mb-6 font-serif">Recent Orders</h2>
                    <div className="space-y-4">
                        {recentOrders && recentOrders.length > 0 ? (
                            recentOrders.map((order) => {
                                // Safe parsing of customer details
                                const customer = typeof order.customer_details === 'string'
                                    ? JSON.parse(order.customer_details)
                                    : order.customer_details || {};

                                const customerName = customer.firstName && customer.lastName
                                    ? `${customer.firstName} ${customer.lastName}`
                                    : customer.name || 'Guest';

                                return (
                                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold uppercase">
                                                {customerName.substring(0, 2) || '??'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 group-hover:text-purple-700">{customerName}</h4>
                                                <p className="text-xs text-gray-500">
                                                    {/* Using a relative time format if possible, or fallback to date */}
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-bold text-gray-900">₹{order.total}</span>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full 
                                                ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-8 text-center text-gray-400 italic">
                                No recent orders found.
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-[#2D1B4E] text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-30 pointer-events-none" />

                    <h2 className="text-xl font-bold mb-6 font-serif relative z-10">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <Link
                            href="/admin/products/add"
                            className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-left transition-colors border border-white/5 block"
                        >
                            <Package className="w-6 h-6 mb-3 text-purple-300" />
                            <span className="block font-bold">Add Product</span>
                        </Link>
                        <Link
                            href="/admin/orders"
                            className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-left transition-colors border border-white/5 block"
                        >
                            <ShoppingBag className="w-6 h-6 mb-3 text-pink-300" />
                            <span className="block font-bold">Manage Orders</span>
                        </Link>
                    </div>

                    <div className="mt-8 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl border border-white/10">
                        <h3 className="font-bold mb-1">System Status</h3>
                        <p className="text-sm text-purple-200">All systems operational. Database connected.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
