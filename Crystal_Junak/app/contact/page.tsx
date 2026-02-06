'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';

export default function ContactPage() {
    return (
        <main className="bg-cj-charcoal min-h-screen text-white">
            <Navbar />

            <div className="pt-32 pb-12 bg-black border-b border-white/5">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">Get in Touch</h1>
                    <p className="text-white/50 max-w-xl mx-auto font-sans">
                        Have questions about a specific crystal? Need guidance on your selection? We are here to help.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Contact Form */}
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/40">Name</label>
                                <input type="text" className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:border-cj-gold outline-none transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/40">Email</label>
                                <input type="email" className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:border-cj-gold outline-none transition-colors" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40">Subject</label>
                            <select className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:border-cj-gold outline-none transition-colors text-white/70">
                                <option>Order Inquiry</option>
                                <option>Product Question</option>
                                <option>Wholesale</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40">Message</label>
                            <textarea rows={6} className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:border-cj-gold outline-none transition-colors"></textarea>
                        </div>
                        <button className="px-10 py-4 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-cj-gold transition-colors w-full md:w-auto">
                            Send Message
                        </button>
                    </div>

                    {/* Info Side */}
                    <div className="space-y-12">
                        <div className="bg-white/5 border border-white/5 p-8 rounded-2xl space-y-8">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-6 h-6 text-cj-gold mt-1" />
                                <div>
                                    <h3 className="font-serif text-lg mb-2">Sanctuary HQ</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        123 Mystical Lane, <br />
                                        Jaipur, Rajasthan, 302001 <br />
                                        India
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Mail className="w-6 h-6 text-cj-gold mt-1" />
                                <div>
                                    <h3 className="font-serif text-lg mb-2">Email Us</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        hello@crystaljunak.com <br />
                                        support@crystaljunak.com
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Phone className="w-6 h-6 text-cj-gold mt-1" />
                                <div>
                                    <h3 className="font-serif text-lg mb-2">Call Us</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        +91 98765 43210 <br />
                                        Mon - Fri, 10am - 6pm IST
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp Button */}
                        <a href="https://wa.me/919876543210" target="_blank" className="block w-full bg-[#25D366] text-white p-4 rounded-xl text-center font-bold flex items-center justify-center gap-3 hover:bg-[#20bd5a] transition-colors">
                            <MessageCircle className="w-6 h-6" />
                            Chat on WhatsApp
                        </a>

                        {/* Google Map Embed Placeholder */}
                        <div className="w-full h-64 bg-white/10 rounded-2xl overflow-hidden relative">
                            <div className="absolute inset-0 flex items-center justify-center text-white/30 text-xs uppercase tracking-widest">
                                Google Map Embed
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
