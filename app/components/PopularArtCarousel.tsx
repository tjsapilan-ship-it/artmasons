'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const extendedArtists = [...POPULAR_ARTISTS, ...POPULAR_ARTISTS];

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number | null = null;
    let lastTime = 0;
    const speed = 40;
    let isRunning = true;

    const step = (time: number) => {
      if (!isRunning) return;
      
      if (document.hidden || isCarouselPaused) {
        lastTime = time;
        animationFrameId = requestAnimationFrame(step);
        return;
      }

      if (!lastTime) lastTime = time;
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      container.scrollLeft += speed * delta;

      const maxScroll = container.scrollWidth / 2;
      if (container.scrollLeft >= maxScroll) {
        container.scrollLeft -= maxScroll;
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      isRunning = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isCarouselPaused]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-gray-50 py-8 border-b border-gray-200">
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          will-change: scroll-position;
        }
        @supports (-webkit-touch-callout: none) {
          .hide-scrollbar {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
      <div className="container mx-auto px-4">
        <h3 className="font-serif text-2xl font-bold mb-6 text-center uppercase">
          POPULAR ART
        </h3>
        <div className="relative w-full">
          <button
            onClick={handleScrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 transition-colors hover:text-[#800000]"
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
          >
            <ChevronLeft size={32} />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar w-full"
            style={{ WebkitOverflowScrolling: 'touch' }}
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
            onTouchStart={() => setIsCarouselPaused(true)}
            onTouchEnd={() => setIsCarouselPaused(false)}
            onTouchMove={() => setIsCarouselPaused(true)}
          >
            {extendedArtists.map((artist, i) => (
              <Link
                key={`${artist.name}-${i}`}
                href={`/popular-art/${generateSlug(artist.name)}`}
                className="flex-shrink-0 w-40 h-40 relative rounded-lg overflow-hidden group"
                onMouseEnter={() => setIsCarouselPaused(true)}
                onMouseLeave={() => setIsCarouselPaused(false)}
              >
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
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

          <button
            onClick={handleScrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 transition-colors hover:text-[#800000]"
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>
    </section>
  );
}
