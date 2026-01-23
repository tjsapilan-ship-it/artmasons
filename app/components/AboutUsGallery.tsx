'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const DEFAULT_IMAGES = [
  { src: "/image/about-us/image_4.png", alt: "Art Masons Masterpiece 4" },
  { src: "/image/about-us/image_5.png", alt: "Art Masons Masterpiece 5" },
  { src: "/image/about-us/image_7.png", alt: "Art Masons Masterpiece 7" },
];

export default function AboutUsGallery({
  images = DEFAULT_IMAGES,
  variant = 'grid'
}: {
  images?: { src: string; alt: string }[];
  variant?: 'grid' | 'collage';
}) {
  if (variant === 'collage') {
    return (
      <div className="w-full py-12 px-4 md:px-8">
        <div className="max-w-[1000px] mx-auto">
          {/* Mobile: Stack, Desktop: Row aligned at bottom */}
          {/* Mobile: Stack, Desktop: Row aligned at bottom */}
          <div className="flex flex-col md:flex-row justify-center items-end gap-6 md:gap-8">

            {/* Left Image (Landscape) */}
            {images[0] && (
              <div className="relative w-[240px] md:w-[260px] aspect-[4/3]">
                <Image
                  src={images[0].src}
                  alt={images[0].alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 240px, 260px"
                />
              </div>
            )}

            {/* Center Image (Portrait/Tall) - Main focal point */}
            {images[1] && (
              <div className="relative w-[280px] md:w-[320px] aspect-[2/3]">
                <Image
                  src={images[1].src}
                  alt={images[1].alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 280px, 320px"
                />
              </div>
            )}

            {/* Right Image (Landscape) */}
            {images[2] && (
              <div className="relative w-[250px] md:w-[270px] aspect-[4/3]">
                <Image
                  src={images[2].src}
                  alt={images[2].alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 250px, 270px"
                />
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <p className="text-[#800000]/60 text-sm font-serif tracking-widest uppercase">
              A Collection of Excellence
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid Layout
  return (
    <div className="w-full py-20 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {images.map((image, i) => (
            <div key={i} className="relative w-[280px] md:w-[320px] aspect-[4/5]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 280px, 320px"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <p className="text-[#800000]/60 text-sm font-serif tracking-widest uppercase">
            A Collection of Excellence
          </p>
        </div>
      </div>
    </div>
  );
}
