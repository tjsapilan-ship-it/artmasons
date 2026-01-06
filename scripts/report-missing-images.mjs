import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
const artworksContent = fs.readFileSync(artworksPath, 'utf-8');
const artworksMatch = artworksContent.match(/export const ARTWORKS[^=]*=\s*(\[[\s\S]*?\n\]);/);
const ARTWORKS = eval(artworksMatch[1]);

function generateSlug(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function getArtworkSlug(artwork) {
  if (artwork.slug) return artwork.slug;
  const artistSlug = generateSlug(artwork.artist || '');
  const titleSlug = generateSlug(artwork.title || '');
  return `${artistSlug}-${titleSlug}`;
}

function byArtist(nameFragment) {
  const frag = nameFragment.toLowerCase();
  return ARTWORKS.filter((a) => (a.artist || '').toLowerCase().includes(frag));
}

function byTitleKeywords(...keywords) {
  const keys = keywords.map((k) => k.toLowerCase());
  return ARTWORKS.filter((a) => {
    const t = (a.title || '').toLowerCase();
    return keys.some((k) => t.includes(k));
  });
}

const categoryArtworks = {
  'monet': byArtist('monet'),
  'klimt': byArtist('klimt'),
  'matisse': byArtist('matisse'),
  'van-gogh': byArtist('van gogh'),
  'picasso': byArtist('picasso'),
  'da-vinci': byArtist('leonardo'),
  'portraits': byTitleKeywords('portrait', 'portrait of'),
  'still-lifes': byTitleKeywords('still life', 'still-life', 'stilllife', 'still'),
  'landscapes': ARTWORKS.filter((a) => {
    const t = (a.title || '').toLowerCase();
    const kws = ['landscape', 'valley', 'sea', 'view', 'nile', 'bay', 'river', 'field', 'sunrise', 'wheat', 'beach', 'shore', 'harbor', 'yosemite'];
    return kws.some((k) => t.includes(k));
  }),
};

console.log('\n========================================');
console.log('REMAINING MISSING IMAGES');
console.log('========================================\n');

const allMissing = [];

for (const [category, artworks] of Object.entries(categoryArtworks)) {
  const missing = [];
  
  for (const artwork of artworks) {
    const imagePath = artwork.image;
    const fullPath = path.join(__dirname, '..', 'public', imagePath);
    
    if (!fs.existsSync(fullPath)) {
      missing.push({
        category,
        title: artwork.title,
        artist: artwork.artist,
        imagePath,
        slug: getArtworkSlug(artwork),
      });
    }
  }
  
  if (missing.length > 0) {
    console.log(`\n${category.toUpperCase()} (${missing.length} missing):`);
    for (const item of missing) {
      console.log(`  • ${item.title}`);
      console.log(`    ${item.imagePath}`);
      allMissing.push(item);
    }
  }
}

console.log('\n========================================');
console.log(`TOTAL MISSING: ${allMissing.length} artworks`);
console.log('========================================\n');

// Create JSON report
const reportPath = path.join(__dirname, '..', 'missing_images_report.json');
fs.writeFileSync(reportPath, JSON.stringify(allMissing, null, 2), 'utf-8');
console.log(`Report saved to: missing_images_report.json\n`);
