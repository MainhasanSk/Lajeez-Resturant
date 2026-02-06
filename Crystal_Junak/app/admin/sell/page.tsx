import { createClient } from '@/utils/supabase/server';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

export default async function SellPage() {
    const supabase = await createClient();

    // Fetch all completed orders
    const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

    if (error) {
        return <div className="p-8 text-red-500">Error loading data: {error.message}</div>;
    }

    // Process data to group by Month/Year
    // Type: { [key: string]: number } where key is "Month Year" (e.g., "February 2026")
    const revenueByMonth: { [key: string]: number } = {};
    const ordersByMonth: { [key: string]: number } = {};

    orders?.forEach(order => {
        const date = new Date(order.created_at);
        // Format: "Month Year"
        const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        if (!revenueByMonth[monthYear]) {
            revenueByMonth[monthYear] = 0;
            ordersByMonth[monthYear] = 0;
        }

        revenueByMonth[monthYear] += order.total || 0;
        ordersByMonth[monthYear] += 1;
    });

    // Convert to array for sorting and display
    // Since we iterated through sorted orders (desc), keys *might* be roughly in order of appearance if JS preserves insertion order for string keys (mostly yes),
    // but to be safe and strictly chronological (descending), we should sort.
    const monthlyStats = Object.keys(revenueByMonth).map(key => ({
        month: key,
        revenue: revenueByMonth[key],
        count: ordersByMonth[key]
    }));

    // Re-verify sorting (because Object.keys order isn't guaranteed to match date order perfectly if dates are mixed)
    // We can parse the date string or just accept it as is if we assume `upcoming` months are later.
    // Given the initial fetch order was DESC, the first keys added were the most recent.
    // So distinct keys *should* be in DESC order of discovery.
    // For specific date sorting, we'd need a real date object.

    // Sort logic: Parse "Month Year" back to date
    monthlyStats.sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateB.getTime() - dateA.getTime();
    });


    return (
        <div>
            <div className="mb-10">
                <h1 className="text-4xl font-serif font-bold text-[#2D1B4E] mb-2 flex items-center gap-3">
                    <TrendingUp className="w-10 h-10" />
                    Sell Analytics
                </h1>
                <p className="text-gray-500">Revenue breakdown by month.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Monthly Revenue</h2>
                    <span className="text-xs font-bold uppercase trackin-wider text-gray-400">Completed Orders Only</span>
                </div>

                {monthlyStats.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-5 font-bold">Month</th>
                                    <th className="p-5 font-bold text-right">Orders</th>
                                    <th className="p-5 font-bold text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {monthlyStats.map((stat, index) => (
                                    <tr key={index} className="hover:bg-purple-50/50 transition-colors group">
                                        <td className="p-5 group-hover:text-purple-700 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-4 h-4 text-gray-400 group-hover:text-purple-400" />
                                                <span className="font-bold text-gray-700 group-hover:text-purple-700">{stat.month}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-right font-mono text-gray-600">
                                            {stat.count}
                                        </td>
                                        <td className="p-5 text-right">
                                            <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                                ₹{stat.revenue.toLocaleString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-400">
                        <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No sales data available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
