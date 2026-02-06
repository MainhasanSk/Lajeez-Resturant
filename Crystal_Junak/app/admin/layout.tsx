'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, LogOut, TrendingUp } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    // If on login page, render without sidebar
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Sell', href: '/admin/sell', icon: TrendingUp },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {/* Sidebar */}
            <aside className="w-72 bg-gradient-to-b from-[#2D1B4E] to-[#1A102E] text-white shadow-2xl flex flex-col relative overflow-hidden">

                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500 rounded-full blur-3xl mix-blend-screen animate-blob" />
                    <div className="absolute top-1/2 -right-24 w-64 h-64 bg-indigo-500 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-2000" />
                </div>

                <div className="p-8 border-b border-white/10 relative z-10">
                    <div className="flex items-center justify-center gap-3">
                        <img
                            src="/assets/logo.svg"
                            alt="Crystal Junak"
                            className="h-12 w-auto brightness-0 invert drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-2 relative z-10">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-medium transition-all duration-300 group ${isActive
                                    ? 'bg-white text-[#2D1B4E] shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-1'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'stroke-2' : 'stroke-1.5'}`} />
                                <span className="tracking-wide">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-white/10 relative z-10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-5 py-4 w-full rounded-xl text-sm font-medium text-pink-300 hover:bg-white/10 hover:text-pink-200 transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto h-screen">
                <div className="p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
