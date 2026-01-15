import { ARTWORKS, getArtworkSlug } from './artworks';
import { POPULAR_PORTRAITS } from './popularPortraits';
import { POPULAR_LANDSCAPES } from './popularLandscapes';
import { POPULAR_STILL_LIFES } from './popularStillLifes';

function byArtist(nameFragment: string) {
  const frag = nameFragment.toLowerCase();
  return ARTWORKS.filter((a) => (a.artist || '').toLowerCase().includes(frag)).map((a) => getArtworkSlug(a));
}

function byTitleKeywords(...keywords: string[]) {
  const keys = keywords.map((k) => k.toLowerCase());
  return ARTWORKS.filter((a) => {
    const t = (a.name || '').toLowerCase();
    return keys.some((k) => t.includes(k));
  }).map((a) => getArtworkSlug(a));
}

export const POPULAR_CATEGORY_MAP: Record<string, string[]> = {
  'monet': byArtist('monet'),
  'klimt': byArtist('klimt'),
  'matisse': byArtist('matisse'),
  'van-gogh': byArtist('van gogh'),
  'picasso': byArtist('picasso'),
  'da-vinci': byArtist('leonardo'),
  'degas': byArtist('degas'),
  'portraits': POPULAR_PORTRAITS,
  'still-lifes': POPULAR_STILL_LIFES,
  'landscapes': POPULAR_LANDSCAPES,
};

export function getCategorySlugs(categorySlug: string) {
  return POPULAR_CATEGORY_MAP[categorySlug] || [];
}

export default POPULAR_CATEGORY_MAP;
