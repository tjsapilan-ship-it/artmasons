'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BlurCarouselProps {
  images: { src: string; alt: string }[];
}

export default function BlurCarousel({ images }: BlurCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Card dimensions
  const CARD_WIDTH = 280; 
  const GAP = 24; 
  const ITEM_FULL_WIDTH = CARD_WIDTH + GAP;

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Initial scroll to middle
  useEffect(() => {
    // Only run if we have width, images, and haven't initialized yet
    // Using a small timeout ensures the layout is fully stable
    if (containerWidth > 0 && images.length > 0 && !isInitialized && containerRef.current) {
      const middleIndex = Math.floor(images.length / 2);
      const position = middleIndex * ITEM_FULL_WIDTH;
      
      // Immediate scroll without animation for initial state
      containerRef.current.scrollLeft = position;
      setScrollX(position);
      setIsInitialized(true);
    }
  }, [containerWidth, images.length, isInitialized, ITEM_FULL_WIDTH]);

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollX(containerRef.current.scrollLeft);
    }
  };

  const scrollTo = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;

    const currentScroll = containerRef.current.scrollLeft;
    // Calculate current index based on scroll position
    const currentIndex = Math.round(currentScroll / ITEM_FULL_WIDTH);
    
    let targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    
    // Clamp index
    targetIndex = Math.max(0, Math.min(targetIndex, images.length - 1));
    
    const newPosition = targetIndex * ITEM_FULL_WIDTH;

    containerRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
  };

  const PADDING = Math.max(0, containerWidth / 2 - CARD_WIDTH / 2);

  return (
    <div className="relative w-full py-12 group">
      {/* Navigation Buttons - Visible on large screens or always? User didn't specify, but typically desktop. 
          We'll keep them always available but maybe adjust size for mobile if needed. */}
      
      {/* Left Button */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-24 z-20 flex items-center justify-center pointer-events-none">
        <button 
          onClick={() => scrollTo('left')}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-[#800000] hover:bg-[#800000] hover:text-white transition-all pointer-events-auto cursor-pointer border border-[#800000]/20 active:scale-95"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Right Button */}
      <div className="absolute inset-y-0 right-0 w-16 md:w-24 z-20 flex items-center justify-center pointer-events-none">
        <button 
          onClick={() => scrollTo('right')}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-[#800000] hover:bg-[#800000] hover:text-white transition-all pointer-events-auto cursor-pointer border border-[#800000]/20 active:scale-95"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ 
          paddingLeft: containerWidth > 0 ? PADDING : '20px',
          paddingRight: containerWidth > 0 ? PADDING : '20px' 
        }}
      >
        <div className="flex gap-6">
          {images.map((img, index) => {
            const position = index * ITEM_FULL_WIDTH;
            const distance = Math.abs(scrollX - position);
            const maxDist = ITEM_FULL_WIDTH;
            
            // Normalized distance (0 to 1 range typically for neighbors)
            const normalizedDist = Math.min(distance / maxDist, 1);
            
            // Scale logic: 1 at center, smaller at edges
            const scale = 1 - normalizedDist * 0.15; // 1 -> 0.85
            
            // Blur logic: 0 at center, increased blur at edges
            const blur = normalizedDist * 4; // 0px -> 4px
            
            const isCenter = distance < (CARD_WIDTH / 2);

            return (
              <motion.div
                key={index}
                className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-lg bg-white border-2 border-white snap-center"
                style={{
                  width: CARD_WIDTH,
                  height: 380,
                  filter: `blur(${blur}px)`,
                  scale,
                  zIndex: isCenter ? 10 : 1,
                  transformOrigin: 'center center',
                  opacity: 1 - normalizedDist * 0.2 // Slight fade for non-center items
                }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-contain"
                    sizes="300px"
                    priority={Math.abs(index - Math.floor(images.length / 2)) < 2}
                  />
                  {/* Removed overlay to ensure clarity */}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
