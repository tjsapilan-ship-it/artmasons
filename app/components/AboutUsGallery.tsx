'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const DEFAULT_IMAGES = [
  { src: "/image/about-us/image_4.webp", alt: "Art Masons Masterpiece 4" },
  { src: "/image/about-us/image_5.webp", alt: "Art Masons Masterpiece 5" },
  { src: "/image/about-us/image_7.webp", alt: "Art Masons Masterpiece 7" },
];

export default function AboutUsGallery({
  images = DEFAULT_IMAGES,
  variant = 'grid'
}: {
  images?: { src: string; alt: string }[];
  variant?: 'grid' | 'collage' | 'layered-3';
}) {
  if (variant === 'layered-3') {
    return (
      <div className="w-full py-12 px-4 md:px-8">
        <div className="relative w-full max-w-[900px] mx-auto aspect-[1/1] md:aspect-[5/4]">
          
          {/* Top Image (Monet) */}
          {images[0] && (
            <div className="absolute top-0 left-[5%] md:left-[10%] w-[80%] md:w-[70%] h-[55%] z-10">
              <div className="relative w-full h-full">
                <Image
                  src={images[0].src}
                  alt={images[0].alt}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 768px) 80vw, 600px"
                />
              </div>
            </div>
          )}

          {/* Right Image (Matisse) - Overlapping Top Right */}
          {images[2] && (
            <div className="absolute top-[35%] right-0 w-[40%] md:w-[35%] h-[55%] z-20">
              <div className="relative w-full h-full">
                <Image
                  src={images[2].src}
                  alt={images[2].alt}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 768px) 40vw, 300px"
                />
              </div>
            </div>
          )}

          {/* Left Image (Irises) - Below Top */}
          {images[1] && (
            <div className="absolute bottom-0 left-0 w-[35%] md:w-[30%] h-[45%] z-10">
              <div className="relative w-full h-full">
                <Image
                  src={images[1].src}
                  alt={images[1].alt}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 768px) 35vw, 250px"
                />
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  if (variant === 'collage') {
    return (
      <div className="w-full py-12 px-4 md:px-8">
        <div className="max-w-[1000px] mx-auto">
          {/* Mobile: Stack, Desktop: Row aligned at bottom */}
          {/* Mobile: Stack, Desktop: Row aligned at bottom */}
          <div className="flex flex-col md:flex-row justify-center items-end gap-2">

            {/* Left Image (Landscape) */}
            {images[0] && (
              <div className="relative w-[340px] md:w-[420px] aspect-[4/3]">
                <Image
                  src={images[0].src}
                  alt={images[0].alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 340px, 420px"
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
              <div className="relative w-[340px] md:w-[420px] aspect-[4/3]">
                <Image
                  src={images[2].src}
                  alt={images[2].alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 340px, 420px"
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
    <div className="w-full py-8 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
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
