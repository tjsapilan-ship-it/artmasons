import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import Breadcrumbs from '../../components/Breadcrumbs';
import PageTransition from '../../components/PageTransition';
import ArtistsAZNavigation from '../../components/ArtistsAZNavigation';
import { getArtworkSlug, getArtworksByArtistSlug, getArtistNameBySlug, type Artwork } from '../../../data/artworks';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

const humanizeSlug = (slug: string) =>
  slug
    .replace(/-/g, ' ')
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const formatPrice = (price: number, currency: string) => {
  const formatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
  return `${currency} ${formatted}`;
};

const sortArtworks = (items: Artwork[], sort: string) => {
  if (sort === 'title') {
    return items.slice().sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
  }
  if (sort === 'year') {
    return items
      .slice()
      .sort((a, b) => (a.year ?? '').localeCompare(b.year ?? ''));
  }
  return items;
};

export default async function ArtistPage({
  params,
  searchParams,
}: {
  params: Promise<{ artist: string }>;
  searchParams?: Promise<{ sort?: string }>;
}) {
  const { artist } = await params;
  const sp = searchParams ? await searchParams : {};
  const sort = sp.sort ?? 'default';

  const artistSlug = artist ?? '';
  const artworks = getArtworksByArtistSlug(artistSlug);
  const displayName = getArtistNameBySlug(artistSlug) ?? humanizeSlug(artistSlug);
  const sortedArtworks = sortArtworks(artworks, sort);

  return (
    <main className={`${playfair.variable} min-h-screen bg-white text-black font-serif`}>
      <PageTransition>
        <ArtistsAZNavigation />
        
        <div className="w-full px-4 py-8">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: 'Artists A-Z', href: '/artists-a-z' },
                { label: displayName, href: `/artists-a-z/${artistSlug}` },
              ]}
            />
          </div>

          <header className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
            <div className="flex-1">
              <h1 className="font-serif text-3xl font-bold text-[#800000]">{displayName}</h1>
              <p className="text-sm text-gray-600 mt-1">
                Browse all paintings by {displayName} from our collection.
              </p>
            </div>

            <div className="w-full md:w-auto mt-4 md:mt-0 flex items-center gap-4">
              <div className="font-serif text-sm text-gray-600">{sortedArtworks.length} items</div>
              <div className="font-serif text-sm text-gray-600">
                <span className="mr-2">Sort:</span>
                <Link
                  href={`/artists-a-z/${artistSlug}`}
                  className={`px-2 ${sort === 'default' ? 'font-semibold text-black' : ''}`}
                >
                  Default
                </Link>
                <Link
                  href={`/artists-a-z/${artistSlug}?sort=title`}
                  className={`px-2 ${sort === 'title' ? 'font-semibold text-black' : ''}`}
                >
                  Title
                </Link>
                <Link
                  href={`/artists-a-z/${artistSlug}?sort=year`}
                  className={`px-2 ${sort === 'year' ? 'font-semibold text-black' : ''}`}
                >
                  Year
                </Link>
              </div>
            </div>
          </header>

          {sortedArtworks.length === 0 ? (
            <div className="py-20 text-center">
              <h2 className="font-serif text-xl font-bold text-gray-700">No artworks found</h2>
              <p className="text-gray-500 mt-2">
                We could not find artworks for “{displayName}”. Try returning to the artists list.
              </p>
              <div className="mt-4">
                <Link
                  href="/artists-a-z"
                  className="inline-flex items-center px-4 py-2 rounded bg-[#800000] text-white hover:bg-[#660000] transition-colors"
                >
                  Back to Artists A-Z
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedArtworks.map((art) => (
                <article
                  key={getArtworkSlug(art)}
                  className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group hover:border-[#800000]/20 border border-transparent"
                >
                  <Link href={`/artworks/${getArtworkSlug(art)}`} className="block cursor-pointer">
                    <div className="relative bg-gray-50 aspect-[3/4] overflow-hidden">
                      <Image
                        src={art.image}
                        alt={art.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    </div>
                  </Link>

                  <div className="p-5">
                    {/* Title - Clickable */}
                    <Link href={`/artworks/${getArtworkSlug(art)}`}>
                      <h3 className="font-serif text-base font-bold text-[#800000] mb-1.5 line-clamp-2 leading-snug min-h-[2.8rem] hover:underline cursor-pointer">
                        {art.name}
                      </h3>
                    </Link>

                    {/* Year */}
                    <p className="font-serif text-sm text-gray-500 mb-1.5">
                      {art.year}
                    </p>

                    {/* Artist */}
                    <p className="font-serif text-sm text-[#4A5568] mb-3 font-medium line-clamp-1">
                      {art.artist}
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
                      <button className="bg-white border-2 border-gray-200 rounded-md px-3 py-2.5 text-center hover:border-[#800000] hover:bg-gray-50 transition-all cursor-pointer">
                        <div className="font-serif text-xs text-gray-600 mb-1">Original Size</div>
                        <div className="font-serif text-base font-bold text-[#800000]">
                          {formatPrice(art.price, art.currency || 'AED')}
                        </div>
                      </button>
                      <button className="bg-white border-2 border-gray-200 rounded-md px-3 py-2.5 text-center hover:border-[#800000] hover:bg-gray-50 transition-all cursor-pointer">
                        <div className="font-serif text-xs text-gray-600 mb-1">Custom Size</div>
                        <div className="font-serif text-base font-bold text-[#800000]">Request quote</div>
                      </button>
                    </div>

                    {/* Additional Info */}
                    <div className="text-xs font-serif text-gray-500 leading-relaxed space-y-1 pt-3 border-t border-gray-100">
                      <p className="line-clamp-1">{art.artist}</p>
                      <p className="line-clamp-1">Year: {art.year}</p>
                      <p className="line-clamp-1 text-gray-400">Hand-painted on linen canvas</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </main>
  );
}
