import type { Metadata } from 'next';
import { Outfit, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Crystal Junak | Timeless Energy in Motion',
  description: 'Experience the mystical elegance of Crystal Junak.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
