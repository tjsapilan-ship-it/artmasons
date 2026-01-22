'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import { User, Grid } from 'lucide-react';
import { motion } from 'framer-motion';
import Breadcrumbs from '../components/Breadcrumbs';
import { ARTWORKS, generateSlug, getArtworkSlug } from '../../data/artworks';
import { ARTIST_RECOMMENDED_IMAGES } from '../../data/artistRecommendedImages';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const STORAGE_KEY = 'artistsAZSelectedLetter';
const PAGE_STATE_KEY = 'artistsAZPageState';
const ITEMS_PER_PAGE = 24;

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

const formatPrice = (price: number, currency: string = 'AED') => {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  
  if (currency === 'AED') {
    return `AED ${formatted}`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function ArtistsAZPage({ searchParams }: { searchParams?: Promise<{ view?: string }> }) {
  const [selectedLetter, setSelectedLetter] = useState<string>('A');
  const [showAllGallery, setShowAllGallery] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);


  const [urlParams, setUrlParams] = useState<{ view?: string } | null>(null);

  useEffect(() => {
    // Get URL parameters
    Promise.resolve(searchParams).then(params => {
      setUrlParams(params || {});
    });
  }, [searchParams]);

  useEffect(() => {
    try {
      // Check for hash parameter (letter selection from navigation)
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.replace('#', '');
        if (hash && ALPHABET.includes(hash)) {
          setSelectedLetter(hash);
          setShowAllGallery(false);
          setCurrentPage(1);
          return;
        }
      }

      // Check for view=gallery parameter
      if (urlParams?.view === 'gallery') {
        setShowAllGallery(true);
        setSelectedLetter('');
        setCurrentPage(1);
        return;
      }

      // Check if we're returning from a navigation and restore state
      const savedState = sessionStorage.getItem(PAGE_STATE_KEY);
      
      if (savedState) {
        const { selectedLetter: savedLetter, showAllGallery: savedGallery, currentPage: savedPage, scrollPosition } = JSON.parse(savedState);
        
        // Restore the view state
        if (savedGallery) {
          setShowAllGallery(true);
          setSelectedLetter('');
          setCurrentPage(savedPage || 1);
        } else if (savedLetter && ALPHABET.includes(savedLetter)) {
          setSelectedLetter(savedLetter);
          setShowAllGallery(false);
        }
        
        // Restore scroll position after content loads
        setTimeout(() => {
          window.scrollTo(0, scrollPosition || 0);
          // Clear saved state after restoration
          sessionStorage.removeItem(PAGE_STATE_KEY);
        }, 150);
        return;
      }

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
  }, [urlParams]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && selectedLetter) {
        localStorage.setItem(STORAGE_KEY, selectedLetter);
      }
    } catch { }
  }, [selectedLetter]);



  const selectLetter = (letter: string) => {
    setSelectedLetter(letter);
    setShowAllGallery(false);
    setCurrentPage(1);
    try {
      if (typeof window !== 'undefined') {
        const state = Object.assign({}, window.history.state, { selectedLetter: letter });
        window.history.replaceState(state, document.title);
        localStorage.setItem(STORAGE_KEY, letter);
      }
    } catch { }
  };

  const showGalleryView = () => {
    setShowAllGallery(true);
    setCurrentPage(1);
    setSelectedLetter('');
  };

  const savePageState = () => {
    try {
      const state = {
        selectedLetter,
        showAllGallery,
        currentPage,
        scrollPosition: window.scrollY
      };
      sessionStorage.setItem(PAGE_STATE_KEY, JSON.stringify(state));
    } catch { }
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

  const getArtistSurname = (artistName: string): string => {
    // Remove parenthetical content (e.g., "Edmund Blair (Leighton)" -> "Edmund Blair Leighton")
    const cleanedName = artistName.replace(/\([^)]*\)/g, '').trim();
    const parts = cleanedName.trim().split(/\s+/).filter(part => part.length > 0);
    
    if (parts.length === 0) return artistName;
    
    return parts[parts.length - 1];
  };

  // Pagination logic
  const allArtworks = useMemo(() => {
    return [...ARTWORKS].sort((a, b) => {
      const surnameA = getArtistSurname(a.artist);
      const surnameB = getArtistSurname(b.artist);
      const surnameCompare = surnameA.localeCompare(surnameB);
      
      if (surnameCompare !== 0) {
        return surnameCompare;
      }
      
      // If surnames are the same, sort by full artist name
      const artistCompare = a.artist.localeCompare(b.artist);
      if (artistCompare !== 0) {
        return artistCompare;
      }
      
      // If artists are the same, sort by artwork name
      return a.name.localeCompare(b.name);
    });
  }, []);

  const totalPages = Math.ceil(allArtworks.length / ITEMS_PER_PAGE);

  const displayedArtworks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return allArtworks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [allArtworks, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className={`${playfair.variable} bg-art-texture min-h-screen text-black font-serif relative`}>
      {/* Linen Canvas Background Pattern */}
      <style jsx global>{`
        .bg-art-texture {
          background-color: #fdfbf7;
          background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23800000' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
        }
        
        /* Custom scrollbar for pagination */
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          background-color: rgba(0,0,0,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #800000;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #800000 rgba(0,0,0,0.05);
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

        {/* View Toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-100 p-1.5 rounded-full inline-flex relative shadow-inner">
            <button
              onClick={showGalleryView}
              className={`
                px-6 md:px-10 py-3 rounded-full text-lg font-serif font-bold transition-all duration-300 relative z-10 text-center flex items-center justify-center
                ${showAllGallery 
                  ? 'bg-[#800000] text-white shadow-md' 
                  : 'text-gray-500 hover:text-[#800000] bg-transparent'
                }
              `}
              style={{ minWidth: '200px' }}
            >
              Discover Gallery
            </button>
            <button
              onClick={() => {
                setShowAllGallery(false);
                if (!selectedLetter) setSelectedLetter('A');
                setCurrentPage(1);
              }}
              className={`
                px-6 md:px-10 py-3 rounded-full text-lg font-serif font-bold transition-all duration-300 relative z-10 text-center flex items-center justify-center
                ${!showAllGallery 
                  ? 'bg-[#800000] text-white shadow-md' 
                  : 'text-gray-500 hover:text-[#800000] bg-transparent'
                }
              `}
              style={{ minWidth: '200px' }}
            >
              Artist Gallery A-Z
            </button>
          </div>
        </div>

        {/* Alphabet Filter */}
        {!showAllGallery && (
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
        )}

        {/* Results Section */}
        <div className="min-h-[400px]">
          {showAllGallery ? (
            <>
              {/* Gallery View */}
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-bold text-gray-800">
                  <span className="text-4xl font-bold text-[#800000]">{allArtworks.length}</span> Artworks in Gallery
                  <span className="ml-4 text-lg text-gray-600">
                    (Showing {displayedArtworks.length} of {allArtworks.length})
                  </span>
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedArtworks.map((artwork, idx) => (
                  <div 
                    key={idx}
                    className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group hover:border-[#800000]/20 border border-transparent"
                  >
                    <Link href={`/artworks/${getArtworkSlug(artwork)}`} onClick={savePageState} className="block cursor-pointer">
                      <div className="relative bg-gray-50 aspect-[3/4] overflow-hidden">
                        <Image
                          src={artwork.image}
                          alt={artwork.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        />
                      </div>
                    </Link>

                    <div className="p-5">
                      <Link href={`/artworks/${getArtworkSlug(artwork)}`} onClick={savePageState}>
                        <h3 className="font-serif text-base font-bold text-[#800000] mb-1.5 line-clamp-2 leading-snug min-h-[2.8rem] hover:underline cursor-pointer">
                          {artwork.name}
                        </h3>
                      </Link>
                      
                      <p className="font-serif text-sm text-gray-500 mb-1.5">
                        {artwork.year}
                      </p>
                      
                      <p className="font-serif text-sm text-[#4A5568] mb-3 font-medium line-clamp-1">
                        {artwork.artist}
                      </p>
                      
                      <div className="flex gap-0.5 mb-4 justify-center">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 fill-orange-400" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 mb-4">
                        <button className="bg-white border-2 border-gray-200 rounded-md px-3 py-2.5 text-center hover:border-[#800000] hover:bg-gray-50 transition-all cursor-pointer">
                          <div className="font-serif text-xs text-gray-600 mb-1">Original Size</div>
                          <div className="font-serif text-base font-bold text-[#800000]">
                            {artwork.price ? formatPrice(artwork.price, artwork.currency) : 'Price on request'}
                          </div>
                        </button>
                        <button className="bg-white border-2 border-gray-200 rounded-md px-3 py-2.5 text-center hover:border-[#800000] hover:bg-gray-50 transition-all cursor-pointer">
                          <div className="font-serif text-xs text-gray-600 mb-1">Custom Size</div>
                          <div className="font-serif text-base font-bold text-[#800000]">Request quote</div>
                        </button>
                      </div>

                      <div className="text-xs font-serif text-gray-500 leading-relaxed space-y-1 pt-3 border-t border-gray-100">
                        <p className="line-clamp-1">{artwork.artist}</p>
                        <p className="line-clamp-1">Year: {artwork.year}</p>
                        <p className="line-clamp-1 text-gray-400">Hand-painted on linen canvas</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 py-8 mt-4 flex-wrap">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:border-[#800000] hover:text-[#800000] disabled:opacity-50 disabled:cursor-not-allowed font-serif transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex flex-1 overflow-x-auto gap-2 px-2 max-w-[80vw] md:max-w-[500px] pb-2 custom-scrollbar">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`flex-shrink-0 w-10 h-10 rounded border font-serif font-bold transition-all ${
                          currentPage === page
                            ? 'bg-[#800000] text-white border-[#800000]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#800000] hover:text-[#800000]'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:border-[#800000] hover:text-[#800000] disabled:opacity-50 disabled:cursor-not-allowed font-serif transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : filteredArtists.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-bold text-gray-800">
                  <span className="text-4xl font-bold text-[#800000]">{filteredArtists.length}</span> {filteredArtists.length === 1 ? 'Artist' : 'Artists'} starting with “{selectedLetter}”
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArtists.map((artist, idx) => {
                  const artworks = getArtworksByArtist(artist);
                  const dates = getArtistDates(artist);
                  
                  // Determine image to show
                  let artistImage = null;
                  const recommendedArtworkName = ARTIST_RECOMMENDED_IMAGES[artist];
                  
                  if (recommendedArtworkName) {
                    const found = artworks.find(a => a.name === recommendedArtworkName);
                    if (found) artistImage = found.image;
                  }
                  
                  if (!artistImage && artworks.length > 0) {
                    artistImage = artworks[0].image;
                  }

                  return (
                    <div 
                      key={idx} 
                      className="group flex flex-col h-full rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-white border border-gray-100"
                    >
                      <Link 
                        href={`/artists-a-z/${generateSlug(artist)}`} 
                        onClick={savePageState}
                        className="relative block w-full aspect-[4/3] overflow-hidden cursor-pointer bg-gray-100"
                      >
                         {artistImage ? (
                           <Image 
                             src={artistImage} 
                             alt={artist} 
                             fill 
                             className="object-cover transition-transform duration-700 group-hover:scale-110"
                             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                           />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-400">
                             <User size={48} />
                           </div>
                         )}
                      </Link>
                      
                      <div className="flex-1 p-2 flex flex-col">
                        <div>
                          <h3 className="font-serif text-lg font-bold text-[#800000] leading-snug mb-0.5">
                            <Link
                              href={`/artists-a-z/${generateSlug(artist)}`}
                              onClick={savePageState}
                              className="hover:text-[#600000] transition-colors"
                            >
                              {artist}
                            </Link>
                          </h3>
                          {(dates.birth || dates.death) && (
                            <p className="font-serif text-sm text-gray-500 italic mb-1.5">
                              {dates.birth || '?'} - {dates.death || '?'}
                            </p>
                          )}
                        </div>
                        <div>
                          <Link 
                              href={`/artists-a-z/${generateSlug(artist)}`}
                              onClick={savePageState}
                              className="inline-flex items-center text-xs font-bold tracking-wider text-[#800000] uppercase border-b border-[#800000]/20 hover:border-[#800000] transition-all pb-0.5"
                          >
                              View full gallery
                          </Link>
                        </div>
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