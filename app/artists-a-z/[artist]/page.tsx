import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import Breadcrumbs from '../../components/Breadcrumbs';
import PageTransition from '../../components/PageTransition';
import { getArtworkSlug, getArtworksByArtistSlug, getArtistNameBySlug, type Artwork } from '../../../data/artworks';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

const humanizeSlug = (slug: string) =>
  slug
    .replace(/-/g, ' ')
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const sortArtworks = (items: Artwork[], sort: string) => {
  if (sort === 'title') {
    return items.slice().sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''));
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
        <div className="container mx-auto px-4 py-8 max-w-7xl">
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
                  className="bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow rounded-md overflow-hidden"
                >
                  <Link href={`/artworks/${getArtworkSlug(art)}`} className="block group">
                    <div className="relative w-full h-56 md:h-44 lg:h-48">
                      <Image
                        src={art.image}
                        alt={art.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-serif text-sm font-semibold text-gray-900 truncate">{art.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 truncate">{art.artist}</p>
                      {art.year && <p className="text-[11px] text-gray-400 mt-1">{art.year}</p>}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </main>
  );
}
