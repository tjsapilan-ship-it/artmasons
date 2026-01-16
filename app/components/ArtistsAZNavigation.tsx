'use client';

import React from 'react';
import Link from 'next/link';
import { Grid } from 'lucide-react';
import { generateSlug, ARTWORKS } from '../../data/artworks';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const getArtistLetter = (artistName: string): string => {
  const artwork = ARTWORKS.find(item => item.artist === artistName);
  return artwork?.letter || 'A';
};

export default function ArtistsAZNavigation() {
  // Get unique artists and count by letter
  const uniqueArtists = React.useMemo(() => {
    const artists = ARTWORKS.map(item => item.artist);
    return Array.from(new Set(artists)).sort();
  }, []);

  const letterCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    ALPHABET.forEach(letter => {
      counts[letter] = uniqueArtists.filter(artist => getArtistLetter(artist) === letter).length;
    });
    return counts;
  }, [uniqueArtists]);

  return (
    <section className="bg-gray-50 py-6 border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="font-serif text-lg font-bold mb-4 text-gray-800">Browse by Letter</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {ALPHABET.map((letter) => {
            const count = letterCounts[letter];
            const hasArtists = count > 0;
            
            return (
              <Link
                key={letter}
                href={hasArtists ? `/artists-a-z#${letter}` : '#'}
                onClick={(e) => {
                  if (!hasArtists) {
                    e.preventDefault();
                  }
                }}
                className={`
                  relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-all duration-200 rounded font-serif text-base md:text-lg font-bold
                  ${!hasArtists 
                    ? 'bg-gray-100/50 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-[#800000] hover:text-[#800000] hover:scale-105 shadow-sm cursor-pointer'
                  }
                `}
              >
                {letter}
                {hasArtists && count > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs font-bold rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-white text-[#800000] border border-gray-300">
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* View All Gallery Button */}
        <div className="mt-6 flex justify-center border-t border-gray-100 pt-6">
          <Link
            href="/artists-a-z?view=gallery"
            className="group relative flex items-center justify-center gap-3 px-8 py-3.5 rounded-full transition-all duration-300 font-serif text-lg font-bold !bg-[#800000] !text-white border-2 !border-[#800000] hover:!bg-[#600000] hover:!border-[#600000] hover:shadow-lg hover:-translate-y-0.5"
          >
            <Grid size={22} className="transition-transform duration-300 group-hover:scale-110" />
            <span>Discover Gallery</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
