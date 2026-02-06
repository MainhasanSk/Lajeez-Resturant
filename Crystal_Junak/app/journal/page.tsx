'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function JournalPage() {
    const articles = [
        {
            title: "Cleansing Your Crystals: A Beginner's Guide",
            excerpt: "Learn the essential methods to clear negative energy from your stones using sage, moonlight, and sound.",
            category: "Guides",
            date: "Feb 2, 2026",
            image: "bg-purple-900/20"
        },
        {
            title: "The 7 Chakras and Their Stones",
            excerpt: "Discover which crystals correspond to each energy center in the body and how to balance them.",
            category: "Education",
            date: "Jan 28, 2026",
            image: "bg-blue-900/20"
        },
        {
            title: "Manifesting with Citrine",
            excerpt: "How to program your Citrine crystal to attract abundance and success into your life.",
            category: "Rituals",
            date: "Jan 15, 2026",
            image: "bg-yellow-900/20"
        },
        {
            title: "Sleeping with Amethyst",
            excerpt: "Why keeping an Amethyst under your pillow might be the key to lucid dreaming and restful sleep.",
            category: "Wellness",
            date: "Jan 10, 2026",
            image: "bg-violet-900/20"
        }
    ];

    return (
        <main className="bg-cj-charcoal min-h-screen text-white">
            <Navbar />

            <div className="pt-32 pb-20 bg-black border-b border-white/5">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">The Journal</h1>
                    <p className="text-white/50 max-w-xl mx-auto font-sans">
                        Wisdom, rituals, and guides for the modern mystic.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {articles.map((article, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className={`w-full aspect-video ${article.image} mb-6 rounded-xl border border-white/5 overflow-hidden relative`}>
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-white border border-white/10">
                                    {article.category}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-white/30 mb-3 uppercase tracking-wider">
                                <span>{article.date}</span>
                                <span className="w-1 h-1 bg-white/30 rounded-full" />
                                <span>5 Min Read</span>
                            </div>
                            <h2 className="text-2xl font-serif mb-3 group-hover:text-cj-gold transition-colors">{article.title}</h2>
                            <p className="text-white/50 text-sm leading-relaxed max-w-md">{article.excerpt}</p>
                            <button className="mt-6 text-xs uppercase tracking-widest border-b border-white/20 pb-1 group-hover:border-cj-gold group-hover:text-cj-gold transition-colors">
                                Read Article
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    );
}
