import React from 'react';
import { Playfair_Display, Inter } from 'next/font/google';
import PageTransition from '../../components/PageTransition';
import Breadcrumbs from '../../components/Breadcrumbs';
import ClientProductDetails from '../ClientProductDetails';
import { type Artwork, ARTWORKS, generateArtistSlug, getArtworkBySlug, getArtworkSlug, enrichArtworkWithOptions } from '../../../data/artworks';
import { getFamousArtworkBySlug, getFamousArtworkSlug, FAMOUS_ART } from '../../../data/famousAndTop100';

// --- Fonts ---
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

// --- MAIN PRODUCT PAGE ---
export default async function ProductDetailsPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ from?: string; category?: string }>;
}) {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : {};
  const from = sp?.from;
  const category = sp?.category;
  
  // First try to find in main ARTWORKS collection
  let artwork = getArtworkBySlug(slug as string) as Artwork | null;
  
  // Enrich with options if found in ARTWORKS
  if (artwork) {
    artwork = enrichArtworkWithOptions(artwork);
  }
  
  // If not found, try to find in FAMOUS_ART collection
  if (!artwork) {
    const famousArtwork = getFamousArtworkBySlug(slug as string);
    if (famousArtwork) {
      // Transform FamousArtwork to Artwork format
      artwork = {
        name: famousArtwork.title,
        artist: famousArtwork.artist,
        year: famousArtwork.year,
        originalDimensions: famousArtwork.originalSize,
        sellingDimensions: famousArtwork.originalSize,
        price: famousArtwork.basePrice,
        image: famousArtwork.image,
        artistLifespan: famousArtwork.artistLife,
        slug: slug as string,
        letter: famousArtwork.artist.charAt(0).toUpperCase(),
        currency: famousArtwork.currency,
        basePrice: famousArtwork.basePrice,
        options: famousArtwork.options,
      };
    }
  }
  
  // Find similar artworks from both collections
  const similarArtworks = artwork
    ? [
        ...ARTWORKS.filter(
          (item) => item.artist === artwork.artist && getArtworkSlug(item) !== slug
        ).map(item => enrichArtworkWithOptions({ ...item, _slug: getArtworkSlug(item) } as Artwork & { _slug: string })),
        ...FAMOUS_ART.filter(
          (item) => item.artist === artwork.artist && getFamousArtworkSlug(item) !== slug
        ).map(item => ({
          name: item.title,
          artist: item.artist,
          year: item.year,
          originalDimensions: item.originalSize,
          sellingDimensions: item.originalSize,
          price: item.basePrice,
          image: item.image,
          artistLifespan: item.artistLife,
          slug: getFamousArtworkSlug(item),
          letter: item.artist.charAt(0).toUpperCase(),
          currency: item.currency,
          basePrice: item.basePrice,
          options: item.options,
          _slug: getFamousArtworkSlug(item)
        } as Artwork & { _slug: string }))
      ].slice(0, 4)
    : [];

  // Breadcrumbs component always prepends Home, so provide trail based on referrer
  let breadcrumbs;
  if (from === 'popular-art' && category) {
    // User came from popular art category page
    const categoryLabel = category
      .replace(/-/g, ' ')
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
    breadcrumbs = artwork
      ? [
          { label: 'Popular Art', href: '/' },
          { label: categoryLabel, href: `/popular-art/${category}` },
          { label: artwork.name, href: `/artworks/${slug}` },
        ]
      : [
          { label: 'Popular Art', href: '/' },
          { label: categoryLabel, href: `/popular-art/${category}` },
          { label: 'Artwork', href: `/artworks/${slug}` },
        ];
  } else {
    // Default: Artists A-Z path
    breadcrumbs = artwork
      ? [
          { label: 'Artists A-Z', href: '/artists-a-z' },
          { label: artwork.artist, href: `/artists-a-z/${generateArtistSlug(artwork.artist)}` },
          { label: artwork.name, href: `/artworks/${slug}` },
        ]
      : [
          { label: 'Artists A-Z', href: '/artists-a-z' },
          { label: 'Artwork', href: `/artworks/${slug}` },
        ];
  }

  return (
    <main className={`${playfair.variable} ${inter.variable} min-h-screen bg-art-texture text-black font-serif text-base`}>
      <PageTransition>
        <div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl relative z-10">
          {/* Breadcrumb */}
          <div className="mb-4 md:mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Client-rendered product details (interactive) */}
          {artwork ? (
            <ClientProductDetails
              artwork={artwork}
              slug={slug as string}
              similarArtworks={similarArtworks}
            />
          ) : (
            <div className="py-20 text-center bg-white/60 rounded-lg shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-gray-700">Artwork not found</h2>
              <p className="text-gray-500 mt-2">The artwork you requested could not be located.</p>
            </div>
          )}
        </div>
      </PageTransition>
    </main>
  );
}