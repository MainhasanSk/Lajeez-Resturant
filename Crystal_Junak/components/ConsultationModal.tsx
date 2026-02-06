'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

interface ConsultationModalProps {
    isOpen: boolean;
    closeModal: () => void;
    defaultType?: string;
}

export default function ConsultationModal({ isOpen, closeModal, defaultType = 'Astrologers' }: ConsultationModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        gender: 'Male',
        age: '',
        profession: '',
        type: defaultType,
        problem: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const message = `*New Consultation Request* %0A%0A` +
            `*Name:* ${formData.name}%0A` +
            `*Gender:* ${formData.gender}%0A` +
            `*Age:* ${formData.age}%0A` +
            `*Profession:* ${formData.profession}%0A` +
            `*Consultation Type:* ${formData.type}%0A` +
            `*Problem Description:* ${formData.problem || 'N/A'}`;

        const whatsappUrl = `https://wa.me/917086866544?text=${message}`;
        window.open(whatsappUrl, '_blank');
        closeModal();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border-2 border-[#1f4d42]">
                                <div className="flex justify-between items-center mb-6">
                                    <Dialog.Title as="h3" className="text-xl font-serif font-bold text-[#1f4d42] uppercase">
                                        Book Consultation
                                    </Dialog.Title>
                                    <button onClick={closeModal} className="text-gray-500 hover:text-red-500 transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4 font-sans text-gray-700">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-[#1f4d42] outline-none"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-1">Gender</label>
                                            <select
                                                name="gender"
                                                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-[#1f4d42] outline-none"
                                                value={formData.gender}
                                                onChange={handleChange}
                                            >
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-1">Age</label>
                                            <input
                                                type="number"
                                                name="age"
                                                required
                                                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-[#1f4d42] outline-none"
                                                value={formData.age}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-1">Profession</label>
                                        <input
                                            type="text"
                                            name="profession"
                                            required
                                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-[#1f4d42] outline-none"
                                            value={formData.profession}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-1">Consultation Type</label>
                                        <select
                                            name="type"
                                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-[#1f4d42] outline-none"
                                            value={formData.type}
                                            onChange={handleChange}
                                        >
                                            <option>Astrologers</option>
                                            <option>Numerologists</option>
                                            <option>Tarot Readers</option>
                                            <option>Vastu Experts</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-1">Problem Description (Optional)</label>
                                        <textarea
                                            name="problem"
                                            rows={3}
                                            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-[#1f4d42] outline-none resize-none"
                                            value={formData.problem}
                                            onChange={handleChange}
                                            placeholder="Briefly describe your concern..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-[#25D366] text-white font-bold py-3 rounded-lg hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 mt-4"
                                    >
                                        Book via WhatsApp
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-5 h-5 invert brightness-0" />
                                    </button>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
