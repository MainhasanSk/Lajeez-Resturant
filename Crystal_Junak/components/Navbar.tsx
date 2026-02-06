'use client';

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

import { User } from '@supabase/supabase-js';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function Navbar() {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);
    const { cartCount } = useCart();
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);

            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user ?? null);
            });

            return () => subscription.unsubscribe();
        };
        checkUser();
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.refresh();
    };

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navItems = [
        { name: "Home", link: "/" },
        { name: "Products", link: "/shop" },
        { name: "About", link: "/about" },
        { name: "Journal", link: "/journal" }
    ];

    return (

        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 pointer-events-auto
                    ${scrolled || mobileMenuOpen ? 'bg-cj-background/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-8'}
                `}
            >
                <div className="container mx-auto px-6 h-full flex items-center justify-between">

                    {/* Logo Area */}
                    <div className="flex items-center gap-2 z-50">
                        <Link href="/" className="block" onClick={() => setMobileMenuOpen(false)}>
                            <img
                                src="/assets/logo.svg"
                                alt="Crystal Junak"
                                className={`h-12 w-auto transition-all duration-300 ${scrolled || mobileMenuOpen ? '' : 'brightness-0 invert'}`}
                            />
                        </Link>
                    </div>

                    {/* Nav Links - Desktop */}
                    <div className="hidden md:flex items-center gap-12">
                        {navItems.map((item, i) => (
                            <Link
                                key={i}
                                href={item.link}
                                className={`text-sm transition-colors font-sans tracking-[0.2em] uppercase hover:text-shadow-glow
                                    ${scrolled ? 'text-cj-primary hover:text-cj-secondary' : 'text-white/80 hover:text-white'}
                                `}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Actions - Right */}
                    <div className={`flex items-center gap-6 ${scrolled || mobileMenuOpen ? 'text-cj-primary' : 'text-white/90'} z-50`}>
                        {/* User Auth Links - Desktop */}
                        <div className="hidden md:flex items-center gap-4">
                            {user ? (
                                <>
                                    <span className="text-xs uppercase">Hi, {user.user_metadata?.full_name?.split(' ')[0] || 'User'}</span>
                                    <Link href="/orders" className="text-xs font-bold uppercase tracking-widest hover:text-cj-secondary transition-colors">
                                        Orders
                                    </Link>
                                    <button onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest hover:text-cj-secondary transition-colors">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                                    <Link href="/login" className="hover:text-cj-secondary transition-colors">
                                        Login
                                    </Link>
                                    <span className="opacity-50">/</span>
                                    <Link href="/signup" className="hover:text-cj-secondary transition-colors">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 pl-0 md:pl-4 md:border-l md:border-white/20">
                            <button className="hover:text-cj-secondary transition-colors hover:scale-110 active:scale-95">
                                <Search className="w-5 h-5" />
                            </button>
                            <Link href="/cart" className="hover:text-cj-secondary transition-colors relative hover:scale-110 active:scale-95 group">
                                <span className="text-xl">🛒</span>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-cj-secondary text-white text-[10px] font-bold flex items-center justify-center rounded-full opacity-100 transition-opacity">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>

                        <button
                            className="md:hidden hover:text-cj-secondary transition-colors relative z-50 p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay - Portal or Outside Nav */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] md:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-[100dvh] w-[85%] max-w-[340px] bg-white z-[9999] md:hidden flex flex-col shadow-2xl"
                        >
                            {/* Menu Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
                                <span className="text-sm font-bold tracking-widest text-cj-primary uppercase">
                                    {user ? `Hello, ${user.user_metadata?.full_name?.split(' ')[0] || 'User'}` : 'Menu'}
                                </span>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 -mr-2 text-gray-400 hover:text-cj-primary transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>

                            {/* Menu Content - Distributed Vertically */}
                            <div className="flex flex-col px-6 py-4 flex-grow justify-evenly overflow-y-auto">
                                {/* Logo in Drawer */}
                                <div className="flex justify-center shrink-0 py-2">
                                    <img
                                        src="/assets/logo.svg"
                                        alt="Crystal Junak"
                                        className="h-16 w-auto"
                                    />
                                </div>

                                {/* Nav Items - Larger and distributed */}
                                <div className="flex flex-col gap-3 shrink-0 my-2">
                                    {navItems.map((item, i) => (
                                        <Link
                                            key={i}
                                            href={item.link}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="text-2xl font-serif font-medium text-cj-charcoal hover:text-cj-primary hover:bg-gray-50 px-4 py-3 rounded-lg transition-all flex items-center justify-between group"
                                        >
                                            {item.name}
                                            <span className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-cj-primary text-lg">→</span>
                                        </Link>
                                    ))}
                                </div>

                                <div className="h-px bg-gray-100 shrink-0" />

                                {/* Account / Action Items */}
                                <div className="flex flex-col gap-4 px-1 shrink-0">
                                    {user ? (
                                        <>
                                            <div className="text-xs uppercase text-gray-400 font-bold tracking-widest px-2">Account</div>
                                            <Link
                                                href="/orders"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="px-4 py-3 bg-cj-primary/5 text-cj-primary font-bold rounded-lg hover:bg-cj-primary/10 transition-colors flex items-center gap-3 text-lg"
                                            >
                                                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs border border-cj-primary/20">
                                                    {user.user_metadata?.full_name?.[0] || 'U'}
                                                </span>
                                                My Orders
                                            </Link>
                                            <button
                                                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                                className="px-4 py-3 text-red-500 font-medium hover:bg-red-50 rounded-lg text-left transition-colors flex items-center gap-3 text-lg"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/login"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="px-4 py-3 text-gray-600 font-bold hover:text-cj-primary hover:bg-gray-50 rounded-lg transition-colors text-center border border-gray-200 text-lg"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                href="/signup"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="px-4 py-3 bg-cj-primary text-white text-center rounded-lg font-bold shadow-md hover:bg-cj-secondary hover:shadow-lg transition-all text-lg"
                                            >
                                                Sign Up
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Footer in Drawer */}
                            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center shrink-0">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Crystal Junak © 2026</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
