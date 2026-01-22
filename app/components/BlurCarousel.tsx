'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface BlurCarouselProps {
  images: { src: string; alt: string }[];
}

export default function BlurCarousel({ images }: BlurCarouselProps) {
  return (
    <div className="w-full py-20 px-4 md:px-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 perspective-1000">
          {images.map((image, i) => {
            // Generate psuedo-random visual properties based on index
            // These make the layout look "scattered" but consistent
            const rotate = (i * 1337) % 10 - 5; // Random rotation between -5 and 5 deg
            const translateY = ((i * 457) % 60) - 30; // Random Y offset between -30 and 30px
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 100, rotate: 0 }}
                whileInView={{ 
                  opacity: 1, 
                  y: translateY,
                  rotate: rotate 
                }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: i * 0.1, 
                  type: "spring", 
                  stiffness: 70,
                  damping: 20
                }}
                className="relative group"
              >
                {/* Frame/Matting */}
                <div className="relative p-4 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)] group-hover:rotate-0 group-hover:z-50">
                  {/* Image Container */}
                  <div className="relative w-[280px] md:w-[320px] aspect-[4/5] overflow-hidden bg-white">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-contain transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 280px, 320px"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
