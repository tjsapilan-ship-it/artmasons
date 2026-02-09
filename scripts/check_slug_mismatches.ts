import { ARTWORKS } from '../data/artworks';
import * as fs from 'fs';
import * as path from 'path';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Read the HAMMER PRICE.txt file
const hammerPriceFile = path.join(__dirname, '..', 'data', 'HAMMER PRICE.txt');
let hammerPriceContent = '';

try {
  for (const encoding of ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']) {
    try {
      hammerPriceContent = fs.readFileSync(hammerPriceFile, encoding);
      break;
    } catch (e) {
      continue;
    }
  }
} catch (error) {
  console.error('Failed to read HAMMER PRICE.txt');
  process.exit(1);
}

// Extract artwork names and prices from HAMMER PRICE.txt
const lines = hammerPriceContent.split(/\r?\n/).map(line => line.trim()).filter(line => line);
let startIdx = lines.findIndex(line => line.includes('FAMOUS ART')) + 1;

const hammerPriceData: Array<{name: string, slug: string, price: string}> = [];
const seenSlugs = new Set<string>();

for (let i = startIdx; i < lines.length - 3; i += 4) {
  const artName = lines[i]?.trim();
  const artist = lines[i + 1]?.trim();
  const location = lines[i + 2]?.trim();
  const price = lines[i + 3]?.trim();
  
  if (artName && artist && location && price) {
    const slug = generateSlug(artName);
    if (!seenSlugs.has(slug)) {
      hammerPriceData.push({ name: artName, slug, price });
      seenSlugs.add(slug);
    }
  }
}

console.log('Checking for Slug Mismatches');
console.log('='.repeat(80));
console.log(`\nArtworks in HAMMER PRICE.txt: ${hammerPriceData.length}`);

// Create a map of artwork slugs
const artworkSlugs = new Set(ARTWORKS.map(a => a.slug));

// Find artworks in HAMMER PRICE.txt that don't match any artwork slug
const unmatched = hammerPriceData.filter(hp => !artworkSlugs.has(hp.slug));

console.log(`Artworks in database with hammer prices: ${ARTWORKS.filter(a => a.hammerPrice).length}`);
console.log(`\nMismatches found: ${unmatched.length}`);

if (unmatched.length > 0) {
  console.log('\n' + '='.repeat(80));
  console.log('Artworks in HAMMER PRICE.txt NOT found in database:');
  console.log('='.repeat(80));
  
  unmatched.forEach((item, idx) => {
    console.log(`\n${idx + 1}. "${item.name}"`);
    console.log(`   Expected slug: ${item.slug}`);
    console.log(`   Price: ${item.price}`);
    
    // Try to find similar artwork names
    const similar = ARTWORKS.filter(a => {
      const nameWords = a.name.toLowerCase().split(/\s+/);
      const itemWords = item.name.toLowerCase().split(/\s+/);
      const commonWords = nameWords.filter(w => itemWords.includes(w) && w.length > 3);
      return commonWords.length >= 2;
    });
    
    if (similar.length > 0) {
      console.log(`   Possible matches in database:`);
      similar.slice(0, 3).forEach(s => {
        console.log(`     - "${s.name}" (${s.slug}) - ${s.hammerPrice ? 'HAS PRICE' : 'NO PRICE'}`);
      });
    }
  });
}

// Check matched ones
const matched = hammerPriceData.filter(hp => artworkSlugs.has(hp.slug));
console.log('\n' + '='.repeat(80));
console.log(`Successfully Matched: ${matched.length}`);
console.log('='.repeat(80));

// Sample some matched artworks
console.log('\nSample matched artworks (first 10):');
matched.slice(0, 10).forEach((item, idx) => {
  const artwork = ARTWORKS.find(a => a.slug === item.slug);
  console.log(`${idx + 1}. "${item.name}" → ${artwork?.hammerPrice === item.price ? '✓' : '✗'} ${artwork?.hammerPrice || 'MISSING'}`);
});
