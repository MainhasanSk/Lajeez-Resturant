
import { createClient } from '@/utils/supabase/server';
import AdminOrderList from './AdminOrderList';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
    const supabase = await createClient();

    const { data: orders } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .order('created_at', { ascending: false });

    return (
        <div>
            <AdminOrderList initialOrders={orders || []} />
        </div>
    );
}
