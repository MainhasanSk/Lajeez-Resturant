'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    price: number;
    formatted_price?: string;
    stock: number;
    image_url?: string;
    category?: string;
    [key: string]: any;
}

export default function ProductListClient({ initialProducts }: { initialProducts: Product[] }) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const supabase = createClient();
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        setLoadingId(id);
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Update UI optimistically
            setProducts(products.filter(p => p.id !== id));
            router.refresh(); // Sync server state
        } catch (error: any) {
            console.error('Error deleting product:', error);
            alert(`Failed to delete product: ${error.message || JSON.stringify(error)}`);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products?.map((product) => (
                    <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="aspect-square relative bg-gray-50 flex items-center justify-center overflow-hidden">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="text-gray-300 flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <span className="text-xl">📷</span>
                                    </div>
                                    <span className="text-xs uppercase tracking-wide font-medium">No Image</span>
                                </div>
                            )}
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1 mr-2">
                                    <h3 className="font-serif font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                                    <p className="text-xs text-gray-500 truncate mt-1">{product.category || 'Uncategorized'}</p>
                                </div>
                                <span className="text-sm font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-md">
                                    {product.formatted_price || `$${product.price}`}
                                </span>
                            </div>

                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                <span className="text-xs text-gray-400 font-medium tracking-wide">Stock: {product.stock}</span>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/products/${product.id}/edit`}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        disabled={loadingId === product.id}
                                        className={`p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ${loadingId === product.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {(!products || products.length === 0) && (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No products found. Start by adding one!</p>
                </div>
            )}
        </div>
    );
}
