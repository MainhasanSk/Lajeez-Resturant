'use client';

export default function Newsletter() {
    return (
        <div className="flex flex-col gap-4">
            <p className="text-white/60 text-xs mb-2 leading-relaxed">
                Subscribe to receive spiritual updates, access to exclusive collection drops, and more.
            </p>
            <div className="relative group">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cj-gold transition-colors font-sans"
                />
                <button className="absolute right-0 bottom-3 text-cj-gold/70 hover:text-cj-gold transition-colors text-xs uppercase tracking-widest font-bold">
                    Join
                </button>
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-cj-gold transition-all duration-300 group-hover:w-full" />
            </div>
        </div>
    );
}
