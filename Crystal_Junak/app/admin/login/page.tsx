'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Note: Magic Links are easier, but let's stick to email/pass if enabled, or magic link
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Try signing in with email/password
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            // Fallback to Magic Link if password fails or is preferred (User implementation dependent)
            // For now, let's just show error.
            setMessage(error.message);
            setLoading(false);
        } else {
            router.push('/admin');
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen bg-cj-charcoal flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif text-white mb-2">Admin Access</h1>
                    <p className="text-white/40 text-sm">Sign in to manage your store</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-cj-gold transition-colors"
                            placeholder="admin@crystaljunak.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-cj-gold transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {message && (
                        <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-cj-gold transition-colors disabled:opacity-50 flex justify-center uppercase tracking-widest text-xs"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
