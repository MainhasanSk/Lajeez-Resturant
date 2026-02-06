
import { createClient } from '@/utils/supabase/server';
import ShopClient from './ShopClient';
import { Crystal } from '@/data/products';

export default async function ShopPage() {
    const supabase = await createClient();

    const { data: products } = await supabase
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
            image_url,
            categories
        `)
        .order('created_at', { ascending: true });

    const typedProducts = (products || []) as unknown as Crystal[];

    return <ShopClient products={typedProducts} />;
}
