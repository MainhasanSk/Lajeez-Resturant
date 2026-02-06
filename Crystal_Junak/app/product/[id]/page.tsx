
import { createClient } from '@/utils/supabase/server';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { Crystal } from '@/data/products';
import { notFound } from 'next/navigation';

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch primary product
    const { data: productData, error } = await supabase
        .from('products')
        .select(`
            id,
            name,
            subTitle: sub_title,
            description,
            energy,
            folderName: folder_name,
            color,
            bgGradient: bg_gradient,
            price,
            formattedPrice: formatted_price,
            details,
            stock,
            category,
            image_url
        `)
        .eq('id', id)
        .single();

    if (error || !productData) {
        notFound();
    }

    const product = productData as unknown as Crystal;

    // Fetch related products (same category, excluding current one)
    let query = supabase
        .from('products')
        .select(`
            id,
            name,
            subTitle: sub_title,
            description,
            energy,
            folderName: folder_name,
            color,
            bgGradient: bg_gradient,
            price,
            formattedPrice: formatted_price,
            details,
            stock,
            category
        `)
        .neq('id', id);

    // If product has a category, filter by it. Otherwise just limit random ones.
    const productCrystal = productData as unknown as Crystal;
    if (productCrystal.category) {
        query = query.eq('category', productCrystal.category);
    }

    const { data: relatedData } = await query.limit(3);

    const relatedProducts = (relatedData || []) as unknown as Crystal[];

    return <ProductDetailsClient product={product} relatedProducts={relatedProducts} />;
}
