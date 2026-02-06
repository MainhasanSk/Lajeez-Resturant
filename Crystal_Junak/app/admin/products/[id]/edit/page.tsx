'use client';

import { useState, useEffect, use } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader2, Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Next.js 15: params is a Promise
export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use()
    const { id } = use(params);

    const supabase = createClient();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        category: 'Health',
        description: '',
        price: '',
        stock: '',
        image_url: ''
    });

    const categories = ["Health", "Money", "Relationship", "Study", "Protection"];

    useEffect(() => {
        const fetchProduct = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching product:', error);
                alert('Product not found');
                router.push('/admin/products');
                return;
            }

            if (data) {
                setFormData({
                    name: data.name,
                    category: data.category || 'Health',
                    description: data.description || '',
                    price: data.price.toString(),
                    stock: data.stock?.toString() || '0',
                    image_url: data.image_url || ''
                });
                if (data.image_url) {
                    setImagePreview(data.image_url);
                }
            }
            setLoading(false);
        };

        fetchProduct();
    }, [id, router, supabase]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImage = async (file: File) => {
        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            let imageUrl = formData.image_url;

            if (imageFile) {
                const uploadedUrl = await uploadImage(imageFile);
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                } else {
                    throw new Error("Image upload failed");
                }
            }

            const { error } = await supabase
                .from('products')
                .update({
                    name: formData.name,
                    category: formData.category,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    formatted_price: `₹${parseFloat(formData.price).toLocaleString()}`,
                    stock: parseInt(formData.stock),
                    image_url: imageUrl
                })
                .eq('id', id);

            if (error) throw error;

            router.push('/admin/products');
            router.refresh();

        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error updating product');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto pb-32">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <h1 className="text-2xl font-serif font-bold">Edit Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">

                {/* Image Upload */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Product Image</label>
                    <div className="flex items-center gap-6">
                        <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 relative group">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-400 text-xs">No Image</span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                {imagePreview ? 'Change Image' : 'Upload Image'}
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                            {/* Hidden Note */}
                            <p className="text-xs text-gray-500">Replaces existing image</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <div className="relative">
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none bg-white"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                {/* Energy Removed from layout */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            value={formData.stock}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Fixed Bottom Action Bar */}
                <div className="fixed bottom-0 right-0 left-0 md:left-72 bg-white border-t border-gray-200 p-4 z-50 flex justify-end shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                    <button
                        type="submit"
                        disabled={saving || uploading}
                        className="w-full md:w-auto px-12 py-3 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-800 transition-all uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                    >
                        {(saving || uploading) ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {uploading ? 'Uploading...' : 'Saving...'}
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
