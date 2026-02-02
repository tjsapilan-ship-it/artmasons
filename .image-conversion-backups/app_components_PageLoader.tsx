'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function PageLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const start = setTimeout(() => setLoading(true), 0);
    const end = setTimeout(() => setLoading(false), 500);
    return () => {
      clearTimeout(start);
      clearTimeout(end);
    };
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-4">
            {/* Logo */}
            <div className="relative w-24 h-24 animate-pulse">
              <Image
                src="/artmasons_logo.png"
                alt="Art Masons"
                fill
                sizes="96px"
                className="object-contain"
                priority
              />
            </div>
            
            {/* Animated loader */}
            <div className="flex gap-2">
              <motion.div
                className="w-2 h-2 bg-[#800000] rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 bg-[#800000] rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 bg-[#800000] rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
