"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Video,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-10 pb-10 md:pt-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h4 className="font-serif text-xl mb-6">About Art Masons</h4>
          <p className="font-serif text-gray-400 text-sm leading-relaxed mb-6">
            We are a small, highly specialised team of artists, academically
            trained according to European standards, and we never compromise
            on detail, technique, or materials.
          </p>
          <div className="flex gap-4 items-center">
            <a href="https://instagram.com/Theartmasons" className="block cursor-pointer">
              <Image src="/image/icons/instagram.png" alt="Instagram" width={24} height={24} />
            </a>
            <a href="#" className="block cursor-pointer">
              <Image src="/image/icons/facebook.png" alt="Facebook" width={24} height={24} />
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
            <div className="flex items-center gap-3 text-gray-300 font-serif">
              <Image src="/image/icons/whatsapp.png" alt="WhatsApp" width={20} height={20} />
              <span>+971 56 170 4788</span>
            </div>
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
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email"
                className="bg-white text-black px-4 py-2 outline-none rounded-sm w-full font-serif text-sm"
              />
              <button className="bg-[#800000] text-white px-4 py-2 font-bold uppercase text-xs tracking-widest hover:bg-[#600000] transition-colors rounded-sm font-serif cursor-pointer">
                Subscribe*
              </button>
              <p className="text-[10px] text-gray-500 font-serif leading-tight">
                *Subscribe to receive special offers, updates and news.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-500 font-serif">
          Trade Mark 1990/{new Date().getFullYear()} Art Masons. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold uppercase text-gray-500 tracking-widest font-serif">
            Follow Us
          </span>
          <div className="flex items-center gap-4">
            <a href="#" className="block cursor-pointer">
              <Image src="/image/icons/facebook.png" alt="Facebook" width={20} height={20} />
            </a>
            <a href="https://instagram.com/Theartmasons" className="block cursor-pointer">
              <Image src="/image/icons/instagram.png" alt="Instagram" width={20} height={20} />
            </a>
            <a href="#" className="block cursor-pointer">
              <Image src="/image/icons/whatsapp.png" alt="WhatsApp" width={20} height={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
              <Video size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
