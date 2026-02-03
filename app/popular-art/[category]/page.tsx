'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '../../components/Breadcrumbs';
import PageTransition from '../../components/PageTransition';
import PopularArtCarousel from '../../components/PopularArtCarousel';
import { ARTWORKS, generateSlug, getArtworkBySlug, getArtworkSlug, type Artwork } from '../../../data/artworks';
import { getCategorySlugs } from '../../../data/popularCategories';
import QuoteRequestModal from '../../components/QuoteRequestModal';


const getPrimaryPricing = (artwork: Artwork) => {
  const hasOptions = Array.isArray(artwork.options) && artwork.options.length > 0;
  const minOption = hasOptions && artwork.options
    ? artwork.options.reduce((min, option) => (option.price < min.price ? option : min), artwork.options[0])
    : null;
  const price = minOption?.price ?? artwork.basePrice ?? artwork.price ?? null;
  return { price, currency: artwork.currency || 'AED', label: minOption?.label || 'Original Size' };
};

const formatPrice = (price: number, currency: string) => {
  const formatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
  return `${currency} ${formatted}`;
};

function humanize(slug: string) {
  return slug
    .replace(/-/g, ' ')
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

function matchesCategory(artwork: Artwork, slug?: string) {
  if (!slug) return false;
  const lower = String(slug).replace(/-/g, ' ').toLowerCase();
  const title = (artwork.name ?? '').toLowerCase();
  const artist = (artwork.artist ?? '').toLowerCase();

  // Direct artist match (e.g., "monet", "van gogh")
  if (artist.includes(lower)) return true;
  // match against artist slugified tokens (e.g., "van-gogh")
  try {
    const artistSlug = generateSlug(artwork.artist ?? '');
    if (artistSlug.includes(lower.replace(/\s+/g, '-'))) return true;
  } catch { }

  // Direct title match
  if (title.includes(lower)) return true;

  // Common category heuristics
  if (lower.includes('portrait')) {
    return title.includes('portrait') || title.includes('portrait of');
  }

  if (lower.includes('still') || lower.includes('life')) {
    return title.includes('still life');
  }

  if (lower.includes('landscap') || lower.includes('landscape')) {
    const landscapeKeywords = ['landscape', 'valley', 'sea', 'view', 'nile', 'bay', 'river', 'field', 'sunrise', 'wheat', 'beach', 'shore', 'harbor', 'yosemite'];
    return landscapeKeywords.some((k) => title.includes(k));
  }

  // Fallback: check if artist contains last word of slug
  const slugLast = lower.split(' ').slice(-1)[0];
  if (slugLast && artist.includes(slugLast)) return true;

  return false;
}

export default function CategoryPage({ params, searchParams }: { params: Promise<{ category: string }>, searchParams?: Promise<{ sort?: string }> }) {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<{ title: string; artist: string } | null>(null);
  const [resolvedParams, setResolvedParams] = React.useState<{ category: string } | null>(null);
  const [resolvedSearchParams, setResolvedSearchParams] = React.useState<{ sort?: string }>({});

  React.useEffect(() => {
    params.then(setResolvedParams);
    if (searchParams) {
      searchParams.then(setResolvedSearchParams);
    }
  }, [params, searchParams]);

  if (!resolvedParams) return null;

  const { category } = resolvedParams;
  const slug = category ?? '';
  const sort = resolvedSearchParams.sort || 'default';

  // Try curated lists first (exact controlled lists from `data/popularCategories.ts`)
  const curatedSlugs = getCategorySlugs(slug);
  let filtered: Artwork[] = [];

  if (curatedSlugs && curatedSlugs.length > 0) {
    filtered = curatedSlugs
      .map((s) => getArtworkBySlug(s))
      .filter((a): a is Artwork => Boolean(a));
  } else {
    filtered = ARTWORKS.filter((a) => matchesCategory(a, slug));
  }

  const title = slug ? humanize(slug) : 'Popular Art';

  // Apply sorting (server-side) — default preserves curated order
  if (sort === 'title') {
    filtered = filtered.slice().sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
  } else if (sort === 'artist') {
    filtered = filtered.slice().sort((a, b) => (a.artist ?? '').localeCompare(b.artist ?? ''));
  }

  // Render full list (no hero thumbnail)
  const gridItems = filtered;

  return (
    <main className="min-h-screen bg-art-texture text-black font-serif">
      <PageTransition>
        <PopularArtCarousel />

        <div className="w-full px-4 py-8 relative z-10">
          <div className="mb-6">
            <Breadcrumbs items={[{ label: 'Popular Art', href: '/' }, { label: title, href: `/popular-art/${slug}` }]} />
          </div>

          <header className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6 bg-white/60 p-6 rounded-lg backdrop-blur-sm border border-[#800000]/10">
            <div className="flex-1">
              <h1 className="font-serif text-3xl font-bold text-[#800000]">{title}</h1>
              <p className="text-sm text-gray-600 mt-1">Browse curated {title.toLowerCase()} paintings from our collection.</p>
            </div>

            <div className="w-full md:w-auto mt-4 md:mt-0 flex items-center gap-4">
              <div className="font-serif text-sm text-gray-600">{filtered.length} items</div>
              <div className="font-serif text-sm text-gray-600">
                <span className="mr-2">Sort:</span>
                <Link href={`/popular-art/${slug}`} className={`px-2 cursor-pointer ${sort === 'default' ? 'font-semibold text-black' : ''}`}>Default</Link>
                <Link href={`/popular-art/${slug}?sort=title`} className={`px-2 cursor-pointer ${sort === 'title' ? 'font-semibold text-black' : ''}`}>Title</Link>
                <Link href={`/popular-art/${slug}?sort=artist`} className={`px-2 cursor-pointer ${sort === 'artist' ? 'font-semibold text-black' : ''}`}>Artist</Link>
              </div>
            </div>
          </header>

          {filtered.length === 0 ? (
            <div className="py-20 text-center bg-white/60 rounded-lg">
              <h2 className="font-serif text-xl font-bold text-gray-700">No artworks found</h2>
              <p className="text-gray-500 mt-2">We couldn&apos;t find artworks for “{title}”.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {gridItems.map((art) => {
                // Get pricing directly from the artwork
                const pricing = getPrimaryPricing(art);

                return (
                  <div
                    key={getArtworkSlug(art)}
                    className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group hover:border-[#800000]/20 border border-transparent"
                  >
                    {/* Image */}
                    <Link href={`/artworks/${getArtworkSlug(art)}?from=popular-art&category=${slug}`} className="block cursor-pointer">
                      <div className="relative bg-gray-50 aspect-[3/4] overflow-hidden">
                        <Image
                          src={art.image}
                          alt={art.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          style={{ aspectRatio: '3/4' }}
                          loading="lazy"
                        />
                      </div>
                    </Link>

                    <div className="p-5">
                      {/* Title - Clickable */}
                      <Link href={`/artworks/${getArtworkSlug(art)}?from=popular-art&category=${slug}`}>
                        <h3 className="font-serif text-base font-bold text-[#800000] mb-1.5 line-clamp-2 leading-snug min-h-[2.8rem] hover:underline cursor-pointer">
                          {art.name}
                        </h3>
                      </Link>

                      {/* Year */}
                      {art.year && (
                        <p className="font-serif text-sm text-gray-500 mb-1.5">
                          {art.year}
                        </p>
                      )}

                      {/* Artist */}
                      <p className="font-serif text-sm text-[#4A5568] mb-3 font-medium line-clamp-1">
                        {art.artist}
                      </p>

                      {/* Star Rating */}
                      <div className="flex gap-0.5 mb-4 justify-center">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 fill-orange-400" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>

                      {/* Product Buttons */}
                      <div className="grid grid-cols-2 gap-2.5 mb-4">
                        <button className="bg-white border-2 border-gray-200 rounded-md px-3 py-2.5 text-center hover:border-[#800000] hover:bg-gray-50 transition-all cursor-pointer">
                          <div className="font-serif text-xs text-gray-600 mb-1">
                            {pricing.label}
                          </div>
                          <div className="font-serif text-base font-bold text-[#800000]">
                            {pricing.price !== null && pricing.price !== undefined
                              ? formatPrice(pricing.price, pricing.currency)
                              : 'Price on request'}
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedArtwork({ title: art.name, artist: art.artist });
                            setShowQuoteModal(true);
                          }}
                          className="bg-white border-2 border-gray-200 rounded-md px-3 py-2.5 text-center hover:border-[#800000] hover:bg-gray-50 transition-all cursor-pointer"
                        >
                          <div className="font-serif text-xs text-gray-600 mb-1">Custom Size</div>
                          <div className="font-serif text-base font-bold text-[#800000]">Request quote</div>
                        </button>
                      </div>

                      {/* Additional Info */}
                      <div className="text-xs font-serif text-gray-500 leading-relaxed space-y-1 pt-3 border-t border-gray-100">
                        <p className="line-clamp-1">{art.artist}</p>
                        <p className="line-clamp-1">Original Size: {art.originalDimensions || '73.7 x 92.1 cm'}</p>
                        <p className="line-clamp-1 text-gray-400">Hand-painted on linen canvas</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PageTransition>

      {/* Quote Request Modal */}
      <QuoteRequestModal
        open={showQuoteModal}
        onClose={() => {
          setShowQuoteModal(false);
          setSelectedArtwork(null);
        }}
        artworkTitle={selectedArtwork?.title}
        artworkArtist={selectedArtwork?.artist}
      />
    </main>
  );
}