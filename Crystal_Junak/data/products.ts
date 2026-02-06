export interface Crystal {
    id: string;
    name: string;
    subTitle: string;
    description: string;
    energy: string;
    folderName: string; // Matches folder in public/crystal-images/
    color: string; // Hex for accents
    bgGradient: string; // Tailwind gradient classes
    price: number;
    formattedPrice: string;
    details: {
        origin: string;
        chakra: string;
        zodiac: string;
    };
    stock?: number;
    image_url?: string; // URL from Supabase Storage
    categories?: string[];
    category?: string;
}
