'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import { Trophy, Search } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { ARTWORKS, getArtworkSlug } from '../../data/artworks';
import { TOP_100_PAINTINGS, getFamousArtworkSlug, FamousArtwork } from '../../data/famousAndTop100';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

// --- THEME COLORS ---
const THEME_RED = '#800000';

type CollectionPainting = {
  rank: number;
  title: string;
  artist: string;
  year: string;
  period: string;
  image: string;
  slug: string;
  price: number | null;
  currency: string;
  priceLabel: string;
};

// ... (existing helper logic remains same) ...
const getPeriod = (artistLife?: string, year?: string): string => {
  if (!artistLife && !year) return 'Historical';
  const yearMatch = year?.match(/\d{4}/);
  const lifeMatch = artistLife?.match(/(\d{4})-(\d{4})/);
  let refYear = 0;
  if (yearMatch) refYear = parseInt(yearMatch[0]);
  else if (lifeMatch) refYear = parseInt(lifeMatch[1]) + 30;
  if (refYear < 1400) return 'Medieval';
  if (refYear < 1600) return 'Renaissance';
  if (refYear < 1700) return 'Baroque';
  if (refYear < 1800) return 'Rococo';
  if (refYear < 1850) return 'Neoclassicism';
  if (refYear < 1880) return 'Romanticism';
  if (refYear < 1900) return 'Impressionism';
  if (refYear < 1920) return 'Post-Impressionism';
  if (refYear < 1950) return 'Modern';
  return 'Contemporary';
};

const getPrimaryPricing = (artwork: FamousArtwork) => {
  const hasOptions = Array.isArray(artwork.options) && artwork.options.length > 0;
  const minOption = hasOptions
    ? artwork.options.reduce((min, option) => (option.price < min.price ? option : min), artwork.options[0])
    : null;
  const price = minOption?.price ?? artwork.basePrice ?? null;
  return { price, currency: artwork.currency || 'AED', label: minOption?.label || 'Original Size' };
};

const formatPrice = (price: number, currency: string) => {
  const formatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
  return `${currency} ${formatted}`;
};

// Use TOP_100_PAINTINGS from the PDF data file
const COLLECTION_PAINTINGS: CollectionPainting[] = TOP_100_PAINTINGS.map((artwork: FamousArtwork, index: number) => {
  // Try to find matching artwork in main ARTWORKS collection for slug
  const matchingArtwork = ARTWORKS.find(
    (a) =>
      (a.title ?? "").toLowerCase() === artwork.title.toLowerCase() ||
      (a.artist ?? "").toLowerCase() === artwork.artist.toLowerCase(),
  );
  
  return {
    rank: index + 1,
    title: artwork.title,
    artist: artwork.artist,
    year: artwork.year || 'Unknown',
    period: getPeriod(artwork.artistLife, artwork.year),
    image: artwork.image,
    slug: matchingArtwork ? getArtworkSlug(matchingArtwork) : getFamousArtworkSlug(artwork),
    ...(() => {
      const pricing = getPrimaryPricing(artwork);
      return { price: pricing.price, currency: pricing.currency, priceLabel: pricing.label };
    })()
  };
});

export default function Top100Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('All');

  const periods = useMemo(() => {
    const uniquePeriods = Array.from(new Set(COLLECTION_PAINTINGS.map((p: CollectionPainting) => p.period)));
    return ['All', ...uniquePeriods.sort()];
  }, []);

  const filteredPaintings = useMemo(() => {
    let filtered = COLLECTION_PAINTINGS;
    if (selectedPeriod !== 'All') {
      filtered = filtered.filter((p: CollectionPainting) => p.period === selectedPeriod);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p: CollectionPainting) => 
        p.title.toLowerCase().includes(query) || 
        p.artist.toLowerCase().includes(query) ||
        p.period.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [searchQuery, selectedPeriod]);

  return (
    <main className={`${playfair.variable} bg-art-texture min-h-screen text-black font-serif relative`}>
      {/* Linen Canvas Background Pattern */}
      <style jsx global>{`
        .bg-art-texture {
          background-color: #fdfbf7;
          background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23800000' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>

      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs items={[{ label: 'Top 100 Paintings', href: '/top-100' }]} />
        </div>

        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="text-[#800000]" size={48} strokeWidth={1.5} />
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#800000]">
              Top 100 Paintings
            </h1>
          </div>
          <p className="font-serif text-lg text-gray-600 max-w-3xl mx-auto">
            Browse our curated collection of the most celebrated masterpieces. 
            Each painting is hand-painted by certified Art Masons using museum-quality materials on 100% linen canvas.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white/90 shadow-sm p-6 rounded-lg backdrop-blur-sm border border-[#800000]/10">
          <div className="mb-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div 
                className="flex items-center border rounded-sm overflow-hidden bg-white"
                style={{ borderColor: THEME_RED }}
              >
                <input
                  type="text"
                  placeholder="Search by title, artist, or period..."
                  className="w-full px-4 py-3 outline-none text-base placeholder-gray-400 font-serif"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="p-3 hover:bg-gray-100 transition-colors">
                  <Search size={22} className="text-black" />
                </button>
              </div>
            </div>
          </div>

          {/* Period Filter */}
          <div className="flex flex-wrap gap-2">
            {periods.map((period: string) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-sm font-serif text-sm transition-all ${
                  selectedPeriod === period
                    ? 'bg-[#800000] text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-[#800000] hover:text-[#800000]'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="font-serif text-xl text-gray-700">
            Showing <span className="font-bold text-[#800000] text-2xl">{filteredPaintings.length}</span> {filteredPaintings.length === 1 ? 'painting' : 'paintings'}
          </p>
        </div>

        {/* Paintings Grid */}
        {filteredPaintings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPaintings.map((painting: CollectionPainting) => {
              return (
                <div 
                  key={painting.rank}
                  className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group hover:border-[#800000]/20 border border-transparent"
                >
                  {/* Image with Rank Badge */}
                  <Link href={`/artworks/${painting.slug}`} className="block">
                    <div className="relative bg-gray-50 aspect-[3/4] overflow-hidden">
                      <Image 
                        src={painting.image} 
                        alt={painting.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                      
                      {/* Rank Badge - Simple white circle with black text */}
                      <div className="absolute top-3 left-3 w-11 h-11 rounded-full bg-[#800000] backdrop-blur-sm flex items-center justify-center font-bold text-sm shadow-lg border border-[#800000]">
                        <span className="text-white">{painting.rank}</span>
                      </div>
                    </div>
                  </Link>

                  <div className="p-5">
                    {/* Title - Clickable */}
                    <Link href={`/artworks/${painting.slug}`}>
                      <h3 className="font-serif text-base font-bold text-[#800000] mb-1.5 line-clamp-2 leading-snug min-h-[2.8rem] hover:underline cursor-pointer">
                        {painting.title}
                      </h3>
                    </Link>
                    
                    {/* Year */}
                    <p className="font-serif text-sm text-gray-500 mb-1.5">
                      {painting.year}
                    </p>
                    
                    {/* Artist */}
                    <p className="font-serif text-sm text-[#4A5568] mb-3 font-medium line-clamp-1">
                      {painting.artist}
                    </p>
                    
                    {/* Star Rating */}
                    <div className="flex gap-0.5 mb-4 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-orange-400" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>

                    {/* Product Buttons */}
                    <div className="grid grid-cols-2 gap-2.5 mb-4">
                      <button className="bg-white border-2 border-gray-200 rounded-md px-3 py-2.5 text-center hover:border-[#800000] hover:bg-gray-50 transition-all">
                        <div className="font-serif text-xs text-gray-600 mb-1">{painting.priceLabel}</div>
                        <div className="font-serif text-base font-bold text-[#800000]">
                          {painting.price !== null ? formatPrice(painting.price, painting.currency) : 'Price on request'}
                        </div>
                      </button>
                      <button className="bg-white border-2 border-gray-200 rounded-md px-3 py-2.5 text-center hover:border-[#800000] hover:bg-gray-50 transition-all">
                        <div className="font-serif text-xs text-gray-600 mb-1">Custom Size</div>
                        <div className="font-serif text-base font-bold text-[#800000]">Request quote</div>
                      </button>
                    </div>

                    {/* Additional Info */}
                    <div className="text-xs font-serif text-gray-500 leading-relaxed space-y-1 pt-3 border-t border-gray-100">
                      <p className="line-clamp-1">{painting.artist}</p>
                      <p className="line-clamp-1">Year: {painting.year}</p>
                      <p className="line-clamp-1 text-gray-400">Hand-painted on linen canvas</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white/60 rounded-lg shadow-sm">
            <Trophy className="text-gray-300 mb-4" size={64} strokeWidth={1} />
            <p className="text-xl font-serif text-gray-400 mb-2">No paintings found</p>
            <p className="font-serif text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </main>
  );
}