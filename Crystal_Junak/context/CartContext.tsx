'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Crystal } from '@/data/products';

export interface CartItem extends Crystal {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Crystal, qty?: number) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, qty: number) => void;
    cartTotal: number;
    cartCount: number;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        // Load from local storage
        const saved = localStorage.getItem('cj-cart');
        // eslint-disable-next-line
        if (saved) setItems(JSON.parse(saved));
    }, []);

    useEffect(() => {
        // Save to local storage
        localStorage.setItem('cj-cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Crystal, qty: number = 1) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
                );
            }
            return [...prev, { ...product, quantity: qty }];
        });
    };

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, qty: number) => {
        if (qty < 1) return;
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: qty } : item
        ));
    };

    const clearCart = () => setItems([]);

    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
