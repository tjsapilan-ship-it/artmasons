'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import { User } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { ARTWORKS, generateSlug, getArtworkSlug } from '../../data/artworks';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const STORAGE_KEY = 'artistsAZSelectedLetter';

const getArtistLetter = (artistName: string): string => {
  const artwork = ARTWORKS.find(item => item.artist === artistName);
  return artwork?.letter || 'A';
};

const getArtistDates = (artistName: string): { birth?: number; death?: number } => {
  const artwork = ARTWORKS.find(item => item.artist === artistName);
  if (!artwork?.artistLifespan) return {};
  
  const parts = artwork.artistLifespan.split('-');
  if (parts.length === 2) {
    return { 
      birth: parseInt(parts[0]) || undefined, 
      death: parseInt(parts[1]) || undefined 
    };
  }
  return {};
};

export default function ArtistsAZPage() {
  const [selectedLetter, setSelectedLetter] = useState<string>('A');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openUp, setOpenUp] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const fromHistory = typeof window !== 'undefined' && (window.history.state && window.history.state.selectedLetter);
      if (fromHistory && ALPHABET.includes(fromHistory)) {
        setTimeout(() => setSelectedLetter(fromHistory), 0);
        return;
      }
      const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored && ALPHABET.includes(stored)) {
        setTimeout(() => setSelectedLetter(stored), 0);
      }
    } catch { }
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && selectedLetter) {
        localStorage.setItem(STORAGE_KEY, selectedLetter);
      }
    } catch { }
  }, [selectedLetter]);

  useEffect(() => {
    const handler = (ev: MouseEvent) => {
      const target = ev.target as Node | null;
      if (resultsRef.current && target && !resultsRef.current.contains(target)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectLetter = (letter: string) => {
    setSelectedLetter(letter);
    try {
      if (typeof window !== 'undefined') {
        const state = Object.assign({}, window.history.state, { selectedLetter: letter });
        window.history.replaceState(state, document.title);
        localStorage.setItem(STORAGE_KEY, letter);
      }
    } catch { }
  };

  const toggleMenu = (idx: number, extraCount: number) => {
    if (openIndex === idx) {
      setOpenIndex(null);
      return;
    }
    const container = resultsRef.current;
    const button = container?.querySelector(`[data-menu="${idx}"] button`) as HTMLElement | null;
    let shouldOpenUp = false;
    if (button && typeof window !== 'undefined') {
      const rect = button.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const estimatedItemH = 40;
      const items = Math.max(0, extraCount);
      const estimatedHeight = Math.min(viewportH * 0.6, items * estimatedItemH);
      const spaceBelow = viewportH - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < Math.min(160, estimatedHeight) && spaceAbove > spaceBelow) {
        shouldOpenUp = true;
      }
    }
    setOpenUp(shouldOpenUp);
    setOpenIndex(idx);
  };

  const uniqueArtists = useMemo(() => {
    const artists = ARTWORKS.map(item => item.artist);
    return Array.from(new Set(artists)).sort();
  }, []);

  const letterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALPHABET.forEach(letter => {
      counts[letter] = uniqueArtists.filter(artist => getArtistLetter(artist) === letter).length;
    });
    return counts;
  }, [uniqueArtists]);

  const filteredArtists = useMemo(() => {
    if (!selectedLetter) return [];
    return uniqueArtists.filter(artist => getArtistLetter(artist) === selectedLetter);
  }, [selectedLetter, uniqueArtists]);

  const getArtworksByArtist = (artist: string) => {
    return ARTWORKS.filter(item => item.artist === artist);
  };

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
          <Breadcrumbs items={[{ label: 'Artists A-Z', href: '/artists-a-z' }]} />
        </div>

        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-[#800000]">Artists A-Z</h1>
          <p className="font-serif text-lg text-gray-600 max-w-3xl">
            Explore our curated collection of master artists from throughout history. Browse by last name to discover their available works.
          </p>
        </div>

        {/* Alphabet Filter */}
        <div className="mb-12 bg-white/90 shadow-sm p-6 rounded-lg backdrop-blur-sm border border-[#800000]/10">
          <h2 className="font-serif text-xl font-bold mb-4 text-gray-800">Browse by Letter</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {ALPHABET.map((letter) => {
              const count = letterCounts[letter];
              const hasArtists = count > 0;
              const isSelected = selectedLetter === letter;
              
              return (
                <button
                  key={letter}
                  onClick={() => hasArtists && selectLetter(letter)}
                  disabled={!hasArtists}
                  className={`
                    relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all duration-200 rounded font-serif text-lg font-bold
                    ${!hasArtists 
                      ? 'bg-gray-100/50 text-gray-400 cursor-not-allowed' 
                      : isSelected 
                        ? 'bg-[#800000] text-white shadow-lg scale-110 cursor-pointer' 
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-[#800000] hover:text-[#800000] hover:scale-105 shadow-sm cursor-pointer'
                    }
                  `}
                >
                  {letter}
                  {hasArtists && count > 0 && (
                    <span className={`
                      absolute -top-1 -right-1 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200
                      ${isSelected 
                        ? 'bg-white text-[#800000] border border-white' 
                        : 'bg-white text-[#800000] border border-gray-300'
                      }
                    `}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Section */}
        <div className="min-h-[400px]">
          {filteredArtists.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-bold text-gray-800">
                  <span className="text-4xl font-bold text-[#800000]">{filteredArtists.length}</span> {filteredArtists.length === 1 ? 'Artist' : 'Artists'} starting with “{selectedLetter}”
                </h2>
              </div>
              
              <div ref={resultsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArtists.map((artist, idx) => {
                  const artworks = getArtworksByArtist(artist);
                  const dates = getArtistDates(artist);
                  
                  return (
                    <div 
                      key={idx} 
                      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[#800000]/30"
                    >
                      <div className="flex items-start gap-4 mb-5">
                        <div className="flex-shrink-0 w-14 h-14 bg-[#800000] rounded-full flex items-center justify-center shadow-md border-2 border-[#fdfbf7]">
                          <User className="text-white" size={26} />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-serif text-2xl font-bold text-[#800000] leading-tight mb-1">
                            <Link
                              href={`/artists-a-z/${generateSlug(artist)}`}
                              className="hover:underline cursor-pointer"
                            >
                              {artist}
                            </Link>
                          </h3>
                          {(dates.birth || dates.death) && (
                            <p className="font-serif text-sm text-gray-500">
                              ({dates.birth || '?'} - {dates.death || '?'})
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="font-serif text-base font-semibold text-gray-600">
                          <span className="text-2xl font-bold text-[#800000]">{artworks.length}</span> {artworks.length === 1 ? 'Artwork' : 'Artworks'}
                        </p>
                        <ul className="space-y-2">
                          {artworks.slice(0, 4).map((artwork, artIdx) => {
                            const slug = getArtworkSlug(artwork);

                            return (
                              <li key={artIdx}>
                                <Link 
                                  href={`/artworks/${slug}`}
                                  className="font-serif text-gray-700 text-base flex items-start gap-2 hover:text-[#800000] transition-colors leading-relaxed group cursor-pointer"
                                >
                                  <span className="text-[#800000] mt-1">•</span>
                                  <span className="flex-1 group-hover:underline">{artwork.name}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>

                        {artworks.length > 4 && (
                          <div className="mt-3 relative" onClick={(e) => e.stopPropagation()} data-menu={idx}>
                            <button
                              type="button"
                              onClick={() => toggleMenu(idx, artworks.length - 4)}
                              aria-haspopup="menu"
                              aria-expanded={openIndex === idx}
                              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-gray-50 text-sm hover:bg-white transition-colors cursor-pointer"
                            >
                              <span>View other artworks ({artworks.length - 4})</span>
                              <svg
                                className={`w-3 h-3 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden
                              >
                                <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>

                            {openIndex === idx && (
                              <ul className={`absolute z-50 ${openUp ? 'bottom-full mb-2' : 'mt-2'} left-0 w-64 bg-white border border-gray-200 rounded shadow-lg overflow-hidden max-h-[56vh] md:max-h-[60vh] overflow-y-auto`}>
                                {artworks.slice(4).map((other, oIdx) => (
                                  <li key={oIdx} className="last:rounded-b">
                                    <Link
                                      href={`/artworks/${getArtworkSlug(other)}`}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                                      onClick={() => setOpenIndex(null)}
                                    >
                                      {other.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white/60 shadow-sm rounded-lg">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="text-gray-400" size={40} />
              </div>
              <p className="text-xl font-serif text-gray-400 mb-2">No artists found for letter “{selectedLetter}”</p>
              <p className="font-serif text-sm text-gray-500">Try selecting a different letter above</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}