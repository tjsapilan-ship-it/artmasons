"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Video,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Please enter your email address.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/subscribe-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.error || 'An error occurred. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <footer className="bg-[#1a1a1a] text-white pt-10 pb-10 md:pt-20">
      <div className="w-full px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h4 className="font-serif text-xl mb-6">About Art Masons</h4>
          <p className="font-serif text-gray-400 text-sm leading-relaxed mb-6">
            We are a small, highly specialised team of artists, academically
            trained according to European standards, and we never compromise
            on detail, technique, or materials.
          </p>
          <div className="flex gap-4 items-center">
            <a href="https://instagram.com/Theartmasons" className="block cursor-pointer">
              <Image src="/image/icons/instagram.webp" alt="Instagram" width={24} height={24} />
            </a>

            <a href="https://www.tiktok.com/@theartmasons" className="block cursor-pointer" target="_blank" rel="noopener noreferrer">
              <Image src="/image/icons/tiktok.webp" alt="TikTok" width={24} height={24} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">
            Customer Service
          </h4>
          <ul className="space-y-3 font-serif text-gray-300">
            <li>
              <Link href="/faqs" className="hover:text-white transition-colors">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/return-policy" className="hover:text-white transition-colors">
                Return Policy
              </Link>
            </li>
            <li>
              <Link href="/delivery-information" className="hover:text-white transition-colors">
                Delivery Information
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-conditions" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">
            Contact Us
          </h4>
          <div className="space-y-4">
            <a
              href="mailto:info@artmasons.com"
              className="flex items-center gap-3 text-white hover:underline transition-colors font-serif font-normal cursor-pointer"
            >
              <Mail size={18} /> info@artmasons.com
            </a>
            <a
              href="https://wa.me/971561704788"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-300 font-serif cursor-pointer hover:text-white transition-colors"
            >
              <Image src="/image/icons/whatsapp.webp" alt="WhatsApp" width={20} height={20} />
              <span>+971 56 170 4788</span>
            </a>
          </div>

          <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 mt-8">
            Shipping Companies
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              { src: 'dhl.webp', alt: 'DHL' },
              { src: 'fedex.webp', alt: 'FedEx' },
              { src: 'ups.webp', alt: 'UPS' }
            ].map((logo) => (
              <div key={logo.src} className="bg-white rounded px-2 py-1 h-8 w-12 flex items-center justify-center shadow-md">
                <Image
                  src={`/image/icons/${logo.src}`}
                  alt={logo.alt}
                  width={40}
                  height={25}
                  className="object-contain w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>


        <div className="flex flex-col gap-8">
          <div>
            <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              Secure Online Payment
            </h4>
            <div className="flex gap-2">
              <div className="bg-white rounded px-2 py-1 h-8 w-12 flex items-center justify-center shadow-md">
                <span className="text-blue-900 font-bold text-[10px] italic font-serif">
                  VISA
                </span>
              </div>
              <div className="bg-white rounded px-2 py-1 h-8 w-12 flex items-center justify-center shadow-md">
                <div className="flex -space-x-1 relative">
                  <div className="w-3 h-3 rounded-full bg-red-600 opacity-90"></div>
                  <div className="w-3 h-3 rounded-full bg-orange-500 opacity-90"></div>
                </div>
              </div>
              <div className="bg-white rounded px-2 py-1 h-8 w-12 flex items-center justify-center shadow-md">
                <span className="text-blue-500 font-bold text-[8px] uppercase font-serif">
                  AMEX
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              Newsletter
            </h4>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="bg-white text-black px-4 py-2 outline-none rounded-sm w-full font-serif text-sm disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#800000] text-white px-4 py-2 font-bold uppercase text-xs tracking-widest hover:bg-[#600000] transition-colors rounded-sm font-serif cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe*'}
              </button>
              {message && (
                <p className={`text-xs font-serif leading-tight ${message.type === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}>
                  {message.text}
                </p>
              )}
              <p className="text-[10px] text-gray-500 font-serif leading-tight">
                *Subscribe to receive special offers, updates and news.
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="w-full px-4 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-500 font-serif">
          Trade Mark 1990/{new Date().getFullYear()} Art Masons. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold uppercase text-gray-500 tracking-widest font-serif">
            Follow Us
          </span>
          <div className="flex items-center gap-4">

            <a
              href="https://instagram.com/Theartmasons"
              target="_blank"
              rel="noopener noreferrer"
              className="block cursor-pointer"
            >
              <Image src="/image/icons/instagram.webp" alt="Instagram" width={20} height={20} />
            </a>
            <a
              href="https://wa.me/971561704788"
              target="_blank"
              rel="noopener noreferrer"
              className="block cursor-pointer hover:opacity-70 transition-opacity"
            >
              <Image src="/image/icons/whatsapp.webp" alt="WhatsApp" width={20} height={20} />
            </a>
            <a href="https://www.tiktok.com/@theartmasons" className="block cursor-pointer" target="_blank" rel="noopener noreferrer">
              <Image src="/image/icons/tiktok.webp" alt="TikTok" width={20} height={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
