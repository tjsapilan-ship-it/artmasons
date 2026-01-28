'use client';

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Playfair_Display } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

type QuoteRequestModalProps = {
    open: boolean;
    onClose: () => void;
    artworkTitle?: string;
    artworkArtist?: string;
    artworkImage?: string;
};

export default function QuoteRequestModal({
    open,
    onClose,
    artworkTitle,
    artworkArtist,
}: QuoteRequestModalProps) {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        phone: '',
        customWidth: '',
        customHeight: '',
        framePreference: '',
        quantity: '1',
        additionalNotes: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                customerName: formData.customerName,
                email: formData.email,
                phone: formData.phone,
                artworkTitle,
                artworkArtist,
                customWidth: formData.customWidth || undefined,
                customHeight: formData.customHeight || undefined,
                framePreference: formData.framePreference || undefined,
                quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
                additionalNotes: formData.additionalNotes || undefined,
            };

            const res = await fetch('/api/request-quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || 'Failed to send quote request');
            }

            addToast(data.message || 'Quote request sent successfully!', 'success');

            // Reset form
            setFormData({
                customerName: '',
                email: '',
                phone: '',
                customWidth: '',
                customHeight: '',
                framePreference: '',
                quantity: '1',
                additionalNotes: '',
            });

            onClose();
        } catch (err: unknown) {
            console.error('Quote request error:', err);
            const message = err instanceof Error ? err.message : 'Failed to send quote request';
            addToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Prevent background scroll when modal is open
    React.useEffect(() => {
        if (open) {
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.documentElement.style.overflow = 'hidden';
        } else {
            const top = document.body.style.top;
            if (top) {
                const restoredY = -parseInt(top || '0', 10) || 0;
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.left = '';
                document.body.style.right = '';
                document.documentElement.style.overflow = '';
                window.scrollTo(0, restoredY);
            } else {
                document.documentElement.style.overflow = '';
            }
        }

        return () => {
            const top = document.body.style.top;
            if (top) {
                const restoredY = -parseInt(top || '0', 10) || 0;
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.left = '';
                document.body.style.right = '';
                document.documentElement.style.overflow = '';
                window.scrollTo(0, restoredY);
            } else {
                document.documentElement.style.overflow = '';
            }
        };
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <div className={`${playfair.variable} fixed inset-0 z-[9999] flex items-center justify-center p-4`}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                        aria-hidden="true"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                            duration: 0.3
                        }}
                        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Header */}
                        <div className="relative bg-art-texture border-b border-[#800000]/10 p-6 md:p-8 flex items-start justify-between z-10">
                            <div>
                                <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#800000] tracking-tight">Request Custom Quote</h2>
                                {artworkTitle && (
                                    <p className="font-serif text-base text-gray-700 mt-2 italic">
                                        Inquiry for: <span className="font-semibold not-italic text-black">{artworkTitle}</span>
                                        {artworkArtist && <span className="text-gray-600"> by {artworkArtist}</span>}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 -mt-2 hover:bg-[#800000]/5 rounded-full transition-colors cursor-pointer group"
                                aria-label="Close"
                            >
                                <X size={24} className="text-gray-500 group-hover:text-[#800000] transition-colors" />
                            </button>
                        </div>

                        {/* Scrollable Form Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                                {/* Customer Information Section */}
                                <section>
                                    <h3 className="flex items-center font-serif text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#800000] mr-3"></span>
                                        Contact Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <div className="group relative">
                                                <input
                                                    type="text"
                                                    name="customerName"
                                                    id="customerName"
                                                    value={formData.customerName}
                                                    onChange={handleChange}
                                                    required
                                                    className="peer w-full px-0 py-3 border-b-2 border-gray-200 bg-transparent font-serif placeholder-transparent focus:border-[#800000] focus:outline-none transition-colors"
                                                    placeholder="Full Name"
                                                />
                                                <label
                                                    htmlFor="customerName"
                                                    className="absolute left-0 -top-3.5 text-sm text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#800000] font-serif"
                                                >
                                                    Full Name <span className="text-red-500">*</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="group relative">
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="peer w-full px-0 py-3 border-b-2 border-gray-200 bg-transparent font-serif placeholder-transparent focus:border-[#800000] focus:outline-none transition-colors"
                                                placeholder="Email Address"
                                            />
                                            <label
                                                htmlFor="email"
                                                className="absolute left-0 -top-3.5 text-sm text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#800000] font-serif"
                                            >
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                        </div>

                                        <div className="group relative">
                                            <input
                                                type="tel"
                                                name="phone"
                                                id="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                className="peer w-full px-0 py-3 border-b-2 border-gray-200 bg-transparent font-serif placeholder-transparent focus:border-[#800000] focus:outline-none transition-colors"
                                                placeholder="Phone Number"
                                            />
                                            <label
                                                htmlFor="phone"
                                                className="absolute left-0 -top-3.5 text-sm text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#800000] font-serif"
                                            >
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                        </div>
                                    </div>
                                </section>

                                {/* Specifications Section */}
                                <section>
                                    <h3 className="flex items-center font-serif text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#800000] mr-3"></span>
                                        Custom Specifications
                                    </h3>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="group relative">
                                                <input
                                                    type="number"
                                                    name="customWidth"
                                                    id="customWidth"
                                                    value={formData.customWidth}
                                                    onChange={handleChange}
                                                    min="1"
                                                    step="0.1"
                                                    className="peer w-full px-0 py-3 border-b-2 border-gray-200 bg-transparent font-serif placeholder-transparent focus:border-[#800000] focus:outline-none transition-colors"
                                                    placeholder="Width (cm)"
                                                />
                                                <label
                                                    htmlFor="customWidth"
                                                    className="absolute left-0 -top-3.5 text-sm text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#800000] font-serif"
                                                >
                                                    Width (cm)
                                                </label>
                                            </div>

                                            <div className="group relative">
                                                <input
                                                    type="number"
                                                    name="customHeight"
                                                    id="customHeight"
                                                    value={formData.customHeight}
                                                    onChange={handleChange}
                                                    min="1"
                                                    step="0.1"
                                                    className="peer w-full px-0 py-3 border-b-2 border-gray-200 bg-transparent font-serif placeholder-transparent focus:border-[#800000] focus:outline-none transition-colors"
                                                    placeholder="Height (cm)"
                                                />
                                                <label
                                                    htmlFor="customHeight"
                                                    className="absolute left-0 -top-3.5 text-sm text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#800000] font-serif"
                                                >
                                                    Height (cm)
                                                </label>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-serif text-[#800000] mb-1.5">Frame Preference</label>
                                                <div className="relative">
                                                    <select
                                                        name="framePreference"
                                                        value={formData.framePreference}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-serif focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] cursor-pointer appearance-none transition-all hover:border-gray-300"
                                                    >
                                                        <option value="">Select frame option...</option>
                                                        <option value="Unframed">Unframed (Canvas Only)</option>
                                                        <option value="Simple Frame">Simple Museum Frame</option>
                                                        <option value="Premium Frame">Premium Gold/Wood Frame</option>
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-serif text-[#800000] mb-1.5">Quantity</label>
                                                <input
                                                    type="number"
                                                    name="quantity"
                                                    value={formData.quantity}
                                                    onChange={handleChange}
                                                    min="1"
                                                    max="100"
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-serif focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-serif text-[#800000] mb-1.5">Additional Notes</label>
                                            <textarea
                                                name="additionalNotes"
                                                value={formData.additionalNotes}
                                                onChange={handleChange}
                                                rows={4}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-serif focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] resize-none transition-colors"
                                                placeholder="Tell us about any specific requirements, timeline, or questions..."
                                            />
                                        </div>
                                    </div>
                                </section>
                            </form>
                        </div>

                        {/* Footer / Actions */}
                        <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <p className="text-sm text-gray-500 font-serif italic text-center sm:text-left order-2 sm:order-1">
                                Expect a response within 24 hours
                            </p>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full sm:w-auto order-1 sm:order-2 bg-[#800000] hover:bg-[#600000] text-white font-serif font-medium tracking-wide text-lg py-3 px-10 rounded-full transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    'Submit Request'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
