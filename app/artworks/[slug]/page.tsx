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
export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
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
      artwork = famousArtwork as Artwork;
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
        ).map(item => ({ ...item as Artwork, _slug: getFamousArtworkSlug(item) }))
      ].slice(0, 4)
    : [];

  // Breadcrumbs component always prepends Home, so provide trail starting at Artists A-Z
  const breadcrumbs = artwork
    ? [
        { label: 'Artists A-Z', href: '/artists-a-z' },
        { label: artwork.artist, href: `/artists-a-z/${generateArtistSlug(artwork.artist)}` },
        { label: artwork.name, href: `/artworks/${slug}` },
      ]
    : [
        { label: 'Artists A-Z', href: '/artists-a-z' },
        { label: 'Artwork', href: `/artworks/${slug}` },
      ];

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