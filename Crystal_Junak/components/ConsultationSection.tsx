'use client';

import { useState } from 'react';
import { Phone } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ConsultationModal from './ConsultationModal';

export default function ConsultationSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState('Astrologers');

    const openModal = (type: string) => {
        setSelectedType(type);
        setIsModalOpen(true);
    };
    return (
        <section className="bg-white py-16 relative overflow-hidden">
            {/* Background Pattern - simple diamond/grid hint */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />

            <div className="container mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1f4d42] uppercase tracking-wide">
                        Consult With Our Panel of Experts
                    </h2>
                    <h3 className="text-xl md:text-2xl font-bold text-[#dc2626] uppercase tracking-wider">
                        Astrologers | Numerologists | Tarot Readers | Vastu Experts
                    </h3>
                    <p className="text-lg md:text-xl text-[#276f5f] max-w-4xl mx-auto font-medium">
                        Whatever your problem — love, career, health, finance, or energy imbalance — we’ve got a trusted expert ready to guide you.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {/* Astrologers Card */}
                    <div className="bg-black text-white p-6 rounded-3xl flex flex-col items-center text-center justify-between min-h-[300px] shadow-xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                        {/* Starry Effect */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black opacity-80" />

                        <div className="relative z-10 flex-grow flex items-center justify-center px-2">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="text-lg font-serif italic text-gray-200"
                            >
                                Your stars hold the answers — let astrology guide your destiny.
                            </motion.p>
                        </div>

                        <div className="relative z-10 w-full space-y-4">
                            <h4 className="text-2xl font-bold bg-[#8b5cf6] py-2 w-full uppercase">
                                Astrologers
                            </h4>
                            <button
                                onClick={() => openModal('Astrologers')}
                                className="text-xs font-bold uppercase tracking-widest hover:text-[#8b5cf6] transition-colors"
                            >
                                Book Your Consultations Now
                            </button>
                        </div>
                    </div>

                    {/* Numerologists Card */}
                    <div className="bg-[#3d1c02] text-white p-6 rounded-3xl flex flex-col items-center text-center justify-between min-h-[300px] shadow-xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                        {/* Texture Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#5d2e08] to-[#2a1201]" />

                        <div className="relative z-10 flex-grow flex items-center justify-center px-2">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                                className="text-lg font-serif italic text-amber-100"
                            >
                                Numbers never lie — unlock success with your perfect numerology code.
                            </motion.p>
                        </div>

                        <div className="relative z-10 w-full space-y-4">
                            <h4 className="text-2xl font-bold bg-[#8b5cf6] py-2 w-full uppercase">
                                Numerologists
                            </h4>
                            <button
                                onClick={() => openModal('Numerologists')}
                                className="text-xs font-bold uppercase tracking-widest hover:text-[#8b5cf6] transition-colors"
                            >
                                Book Your Consultations Now
                            </button>
                        </div>
                    </div>

                    {/* Tarot Readers Card */}
                    <div className="bg-[#0f4c4c] text-white p-6 rounded-3xl flex flex-col items-center text-center justify-between min-h-[300px] shadow-xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                        {/* Teal Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#136161] to-[#082f2f]" />

                        <div className="relative z-10 flex-grow flex items-center justify-center px-2">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                                className="text-lg font-serif italic text-teal-100"
                            >
                                One shuffle, endless insights — discover your path with tarot.
                            </motion.p>
                        </div>

                        <div className="relative z-10 w-full space-y-4">
                            <h4 className="text-xl font-bold bg-[#8b5cf6] py-2 w-full uppercase">
                                Tarot Readers
                            </h4>
                            <button
                                onClick={() => openModal('Tarot Readers')}
                                className="text-xs font-bold uppercase tracking-widest hover:text-[#8b5cf6] transition-colors"
                            >
                                Book Your Consultations Now
                            </button>
                        </div>
                    </div>

                    {/* Vastu Experts Card */}
                    <div className="bg-[#0f172a] text-white p-6 rounded-3xl flex flex-col items-center text-center justify-between min-h-[300px] shadow-xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                        {/* Network/Constellation Effect */}
                        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] to-[#020617]" />

                        <div className="relative z-10 flex-grow flex items-center justify-center px-2">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                                className="text-lg font-serif italic text-indigo-100"
                            >
                                Balance your space, balance your life — with powerful Vastu harmony.
                            </motion.p>
                        </div>

                        <div className="relative z-10 w-full space-y-4">
                            <h4 className="text-2xl font-bold bg-[#8b5cf6] py-2 w-full uppercase">
                                Vastu Experts
                            </h4>
                            <button
                                onClick={() => openModal('Vastu Experts')}
                                className="text-xs font-bold uppercase tracking-widest hover:text-[#8b5cf6] transition-colors"
                            >
                                Book Your Consultations Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA Bar */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                    <Link href="/shop" className="hidden md:flex items-center gap-3 bg-[#1f4d42] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-[#163830] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        ORDER NOW
                        <div className="bg-white text-[#1f4d42] rounded-full w-6 h-6 flex items-center justify-center text-xs">🛒</div>
                    </Link>

                    <div onClick={() => openModal('General')} className="bg-[#ef4444] text-white py-4 px-8 md:px-12 rounded-full shadow-lg flex items-center gap-4 transform hover:scale-105 transition-transform cursor-pointer">
                        <Phone className="w-8 h-8 md:w-10 md:h-10 fill-current" />
                        <div className="flex flex-col leading-tight">
                            <span className="text-lg md:text-xl font-bold uppercase tracking-wide">Book Your Consultations Now</span>
                            <span className="text-sm md:text-lg font-bold">CALL/WHATSAPP : +91 7086866544</span>
                        </div>
                    </div>

                    <Link href="/shop" className="hidden md:flex items-center gap-3 bg-[#1f4d42] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-[#163830] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        ORDER NOW
                        <div className="bg-white text-[#1f4d42] rounded-full w-6 h-6 flex items-center justify-center text-xs">🛒</div>
                    </Link>
                </div>
            </div>

            <ConsultationModal
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                defaultType={selectedType}
            />
        </section>
    );
}

