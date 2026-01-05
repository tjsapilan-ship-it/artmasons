'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const POPULAR_ARTISTS = [
  { name: "MONET", image: "/popular-art/monet.jpg" },
  { name: "KLIMT", image: "/popular-art/klimt.jpg" },
  { name: "MATISSE", image: "/popular-art/matisse.jpg" },
  { name: "VAN GOGH", image: "/popular-art/gogh.webp" },
  { name: "PICASSO", image: "/popular-art/picasso.jpg" },
  { name: "DA VINCI", image: "/popular-art/davinci.jpg" },
  { name: "STILL LIFES", image: "/popular-art/still-life.jpg" },
  { name: "LANDSCAPES", image: "/popular-art/landscape.jpg" },
  { name: "PORTRAITS", image: "/popular-art/portrait.jpg" },
];

const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

export default function PopularArtCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  // Double the array for seamless infinite scroll
  const extendedArtists = [...POPULAR_ARTISTS, ...POPULAR_ARTISTS];

  // Auto-scroll effect optimized for Apple devices
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const container = trackRef.current;
    if (!container) return;

    let animationFrameId: number | null = null;
    let lastTime = 0;
    const speed = 30; // pixels per second
    let isRunning = true;

    const step = (time: number) => {
      if (!isRunning) return;
      
      // Pause when document is hidden or user is hovering
      if (document.hidden || isPaused) {
        lastTime = time;
        animationFrameId = requestAnimationFrame(step);
        return;
      }

      if (!lastTime) lastTime = time;
      const delta = (time - lastTime) / 1000;
      const deltaPx = speed * delta;

      // Get current scroll position
      const currentTransform = window.getComputedStyle(container).transform;
      const matrix = new DOMMatrix(currentTransform);
      let currentX = matrix.m41;

      // Calculate the width of one set (half of total)
      const singleSetWidth = container.scrollWidth / 2;
      
      // Move left
      currentX -= deltaPx;
      
      // Reset to start when we've scrolled through one complete set
      if (Math.abs(currentX) >= singleSetWidth) {
        currentX = 0;
      }

      container.style.transform = `translateX(${currentX}px)`;
      lastTime = time;
      animationFrameId = requestAnimationFrame(step);
    };

    const handleVisibility = () => {
      if (!document.hidden && isRunning) {
        lastTime = performance.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    
    // Start animation with delay for Safari compatibility
    const timeoutId = setTimeout(() => {
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(step);
    }, 100);

    return () => {
      isRunning = false;
      clearTimeout(timeoutId);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isPaused]);

  const handleScroll = useCallback((direction: 'left' | 'right') => {
    if (!trackRef.current) return;
    
    const track = trackRef.current;
    const scrollAmount = 400;
    
    // Get current position
    const currentTransform = window.getComputedStyle(track).transform;
    const matrix = new DOMMatrix(currentTransform);
    const currentX = matrix.m41;
    const targetX = direction === 'left' ? currentX + scrollAmount : currentX - scrollAmount;
    
    // Pause auto-scroll temporarily
    setIsPaused(true);
    track.style.transform = `translateX(${targetX}px)`;
    
    // Resume after a delay
    setTimeout(() => setIsPaused(false), 2000);
  }, []);

  return (
    <section className="bg-gray-50 py-8 border-b border-gray-200">
      <style jsx global>{`
        .carousel-track {
          display: flex;
          gap: 1rem;
          width: max-content;
          will-change: transform;
        }
        
        .carousel-container {
          overflow: hidden;
          width: 100%;
          position: relative;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Hardware acceleration for Apple devices */
        .carousel-item {
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          flex-shrink: 0;
        }
        
        /* Optimize for Safari/iOS */
        @supports (-webkit-touch-callout: none) {
          .carousel-track {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
        }
      `}</style>
      <div className="container mx-auto px-4">
        <h3 className="font-serif text-2xl font-bold mb-6 text-center uppercase">
          POPULAR ART
        </h3>
        <div className="relative w-full">
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 transition-colors hover:text-[#800000]"
            aria-label="Scroll left"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <ChevronLeft size={32} />
          </button>

          <div
            className="carousel-container"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div
              ref={trackRef}
              className="carousel-track"
            >
              {extendedArtists.map((artist, i) => (
                <Link
                  key={`${artist.name}-${i}`}
                  href={`/popular-art/${generateSlug(artist.name)}`}
                  className="w-40 h-40 relative rounded-lg overflow-hidden group carousel-item"
                >
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    sizes="160px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority={i < 9}
                  />
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-end pb-3">
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <span className="relative z-10 text-white font-serif font-bold tracking-wider text-sm text-center">
                      {artist.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 transition-colors hover:text-[#800000]"
            aria-label="Scroll right"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>
    </section>
  );
}
