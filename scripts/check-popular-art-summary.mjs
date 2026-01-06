import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read artworks data
const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
const artworksContent = fs.readFileSync(artworksPath, 'utf-8');

// Read popular categories
const popularCategoriesPath = path.join(__dirname, '..', 'data', 'popularCategories.ts');

// Extract ARTWORKS array from artworks.ts
const artworksMatch = artworksContent.match(/export const ARTWORKS[^=]*=\s*(\[[\s\S]*?\n\]);/);
if (!artworksMatch) {
  console.error('Could not find ARTWORKS array');
  process.exit(1);
}

// Parse the artworks (simple eval approach)
const artworksArrayStr = artworksMatch[1];
const ARTWORKS = eval(artworksArrayStr);

// Helper function to get artwork slug
function generateSlug(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Get artworks for each category
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
console.log('POPULAR ART IMAGE STATUS SUMMARY');
console.log('========================================\n');

let totalMissing = 0;
let totalFound = 0;

for (const [category, artworks] of Object.entries(categoryArtworks)) {
  let categoryMissing = 0;
  let categoryFound = 0;
  
  for (const artwork of artworks) {
    const imagePath = artwork.image;
    const fullPath = path.join(__dirname, '..', 'public', imagePath);
    
    if (!fs.existsSync(fullPath)) {
      categoryMissing++;
      totalMissing++;
    } else {
      categoryFound++;
      totalFound++;
    }
  }
  
  console.log(`${category.padEnd(15)} | Found: ${String(categoryFound).padStart(3)} | Missing: ${String(categoryMissing).padStart(3)} | Total: ${artworks.length}`);
}

console.log('\n========================================');
console.log(`TOTAL           | Found: ${String(totalFound).padStart(3)} | Missing: ${String(totalMissing).padStart(3)} | Total: ${totalFound + totalMissing}`);
console.log('========================================\n');

const percentageFound = ((totalFound / (totalFound + totalMissing)) * 100).toFixed(1);
console.log(`Image Coverage: ${percentageFound}%\n`);
