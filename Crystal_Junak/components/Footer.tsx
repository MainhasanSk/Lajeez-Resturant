import Newsletter from './Newsletter';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-cj-primary text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cj-supporting/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">

                    {/* Brand - Large */}
                    <div className="lg:col-span-4">
                        <img
                            src="/assets/logo.svg"
                            alt="Crystal Junak"
                            className="h-16 w-auto mb-6 brightness-0 invert opacity-90"
                        />
                        <p className="text-white/60 text-sm leading-7 font-sans max-w-xs mb-8">
                            Timeless energy for the modern sanctuary. <br />
                            Ethically sourced, spiritually cleansed. <br />
                            Based in India, shipping worldwide.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-cj-secondary hover:text-white transition-all duration-300">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div className="lg:col-span-2 lg:col-start-7">
                        <h4 className="font-sans text-xs uppercase tracking-widest text-cj-secondary mb-8">Shop</h4>
                        <ul className="space-y-4">
                            {['New Arrivals', 'Best Sellers', 'Home Decor', 'Jewelry', 'Collections'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-sm text-white/60 hover:text-white transition-colors hover:translate-x-1 inline-block duration-200">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div className="lg:col-span-2">
                        <h4 className="font-sans text-xs uppercase tracking-widest text-cj-secondary mb-8">About</h4>
                        <ul className="space-y-4">
                            {['Our Story', 'Sourcing', 'Journal', 'Contact Us', 'FAQ'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-sm text-white/60 hover:text-white transition-colors hover:translate-x-1 inline-block duration-200">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter - Minimal */}
                    <div className="lg:col-span-2">
                        <h4 className="font-sans text-xs uppercase tracking-widest text-cj-secondary mb-8">Newsletter</h4>
                        <Newsletter />
                    </div>
                </div>

                {/* Subfooter */}
                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-white/30 border-t border-white/5 pt-8 font-sans">
                    <div className="flex gap-6 mb-4 md:mb-0">
                        <a href="#" className="hover:text-cj-secondary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-cj-secondary transition-colors">Terms of Service</a>
                    </div>
                    <p>&copy; 2026 Crystal Junak. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
