import { ARTWORKS, getArtworkSlug } from './artworks';

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
  'portraits': byTitleKeywords('portrait', 'portrait of'),
  'still-lifes': byTitleKeywords('still life', 'still-life', 'stilllife', 'still'),
  'landscapes': ARTWORKS.filter((a) => {
    const t = (a.name || '').toLowerCase();
    const kws = ['landscape', 'valley', 'sea', 'view', 'nile', 'bay', 'river', 'field', 'sunrise', 'wheat', 'beach', 'shore', 'harbor', 'yosemite'];
    return kws.some((k) => t.includes(k));
  }).map((a) => getArtworkSlug(a)),
};

export function getCategorySlugs(categorySlug: string) {
  return POPULAR_CATEGORY_MAP[categorySlug] || [];
}

export default POPULAR_CATEGORY_MAP;
