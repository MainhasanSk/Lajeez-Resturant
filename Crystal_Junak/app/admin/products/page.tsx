
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import ProductListClient from './ProductListClient';

export default async function AdminProductsPage() {
    const supabase = await createClient();

    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold text-[#2D1B4E]">Products</h1>
                <Link
                    href="/admin/products/add"
                    className="bg-purple-700 text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-purple-800 transition-colors flex items-center gap-2 shadow-md"
                >
                    <Plus className="w-4 h-4" /> Add Product
                </Link>
            </div>

            <ProductListClient initialProducts={products as any[]} />
        </div>
    );
}
