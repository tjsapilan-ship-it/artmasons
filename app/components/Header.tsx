"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from "../context/CartContext";

const THEME_RED = "#800000";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const { count } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const NAV_ITEMS = [
    { label: "Artists A-Z", href: "/artists-a-z" },
    { label: "Top 100 Paintings", href: "/top-100" },
    { label: "Our Quality", href: "/our-quality" },
    { label: "Frame & Size Art", href: "/frame-size-art" },
    { label: "About Us", href: "/about-us" },
  ];

  // Prevent background scroll when mobile menu is open
  React.useEffect(() => {
    // Use a robust scroll lock that prevents page jump when disabling scroll
    // Store current scroll position and apply fixed positioning to body.
    let scrollY = 0;
    if (mobileMenuOpen) {
      scrollY = window.scrollY || document.documentElement.scrollTop;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // restore
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
  }, [mobileMenuOpen]);

  return (
    <header className="relative z-50 bg-white pt-3 pb-3 md:pt-6 md:pb-4 shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-12">
        <Link href="/" className="flex-shrink-0 flex flex-col items-center justify-end w-auto md:w-56 cursor-pointer pb-2">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-44 md:h-44">
            <Image
              src="/image/icons/logo_1.png"
              alt="Art Masons Seal"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <div className="flex-1 flex flex-col w-full justify-end">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 relative w-full">
            <div className="flex-1 w-full relative z-20">
              <form onSubmit={handleSearch}>
                <div
                  className={`flex items-center border rounded-sm overflow-hidden bg-white w-full`}
                  style={{ borderColor: THEME_RED }}
                >
                  <input
                    type="text"
                    placeholder="Search For Paintings"
                    className="w-full px-4 py-2 sm:py-3 outline-none text-base placeholder-gray-400 font-serif text-black"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ color: '#000000' }}
                  />
                  <button 
                    type="submit"
                    className="p-3 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <Search size={22} className="text-black" />
                  </button>
                </div>
              </form>
            </div>

            <div className="flex-shrink-0 flex items-center gap-6 self-center h-full pb-1">
              <div
                className="w-8 h-8 rounded-full bg-gray-100 relative overflow-hidden shadow-sm border border-gray-200"
                title="UAE"
              >
                <div className="absolute inset-y-0 left-0 w-1/4 bg-red-600"></div>
                <div className="absolute top-0 right-0 w-3/4 h-1/3 bg-green-600"></div>
                <div className="absolute bottom-0 right-0 w-3/4 h-1/3 bg-black"></div>
                <div className="absolute top-1/3 right-0 w-3/4 h-1/3 bg-white"></div>
              </div>

              <Link href="/cart" className="flex items-center gap-2 cursor-pointer hover:opacity-70">
                <div className="relative">
                  <ShoppingBag size={28} color="black" strokeWidth={1.5} />
                  <CartCountBadge count={count} />
                </div>
              </Link>

              <button className="md:hidden text-black cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X color="black" /> : <Menu color="black" />}
              </button>
            </div>
          </div>

          <div className="h-10 hidden md:block"></div>

          {/* Mobile menu: render as overlay to avoid pushing page content */}
          <div className="w-full hidden md:block">
            <nav>
              <ul className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 py-2 font-serif text-base md:text-lg tracking-wide uppercase w-full">
                {NAV_ITEMS.map((item) => (
                  <li
                    key={item.label}
                    className="cursor-pointer text-black hover:text-[#800000] transition-colors relative group whitespace-nowrap"
                  >
                    <Link href={item.href}><span className="lining-nums">{item.label}</span></Link>
                    <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-[#800000] transition-all duration-300 group-hover:w-full"></span>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {typeof document !== 'undefined' && createPortal(
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 z-[9999] bg-white p-6 overflow-auto md:hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <Link href="/" onClick={() => setMobileMenuOpen(false)} className="relative w-24 h-24 block">
                        <Image src="/image/icons/logo_1.png" alt="Art Masons" fill className="object-contain" />
                      </Link>
                    </div>
                    <button aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} className="p-2 text-black cursor-pointer">
                      <X color="black" />
                    </button>
                  </div>

                  <nav>
                    <ul className="flex flex-col gap-4 text-lg font-serif uppercase">
                      {NAV_ITEMS.map((item) => (
                        <li key={item.label} className="py-3 border-b border-gray-100">
                          <Link href={item.href} onClick={() => setMobileMenuOpen(false)} className="block text-black">
                            <span className="lining-nums">{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}
        </div>
      </div>
    </header>
  );
}

function CartCountBadge({ count }: { count: number }) {
  return (
    <div className="absolute -top-1 -right-1 w-5 h-5">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={count}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute inset-0 bg-[#800000] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-serif"
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
