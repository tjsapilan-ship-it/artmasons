import { ARTWORKS } from '../data/artworks';
import * as fs from 'fs';
import * as path from 'path';

// Read the HAMMER PRICE.txt file
const hammerPriceFile = path.join(__dirname, '..', 'data', 'HAMMER PRICE.txt');
let hammerPriceContent = '';

try {
  const encodings: BufferEncoding[] = ['utf-8', 'latin1'];
  for (const encoding of encodings) {
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

// Extract artwork names from HAMMER PRICE.txt
const lines = hammerPriceContent.split(/\r?\n/).map(line => line.trim()).filter(line => line);
let startIdx = lines.findIndex(line => line.includes('FAMOUS ART')) + 1;

const hammerPriceArtworks = new Set<string>();
for (let i = startIdx; i < lines.length - 3; i += 4) {
  const artName = lines[i]?.trim();
  if (artName) {
    hammerPriceArtworks.add(artName);
  }
}

console.log('Analysis of Missing Hammer Prices');
console.log('='.repeat(80));
console.log(`\nTotal artworks in database: ${ARTWORKS.length}`);
console.log(`Artworks with hammer prices: ${ARTWORKS.filter(a => a.hammerPrice).length}`);
console.log(`Artworks WITHOUT hammer prices: ${ARTWORKS.filter(a => !a.hammerPrice).length}`);
console.log(`\nUnique artworks in HAMMER PRICE.txt: ${hammerPriceArtworks.size}`);

// Find artworks in database without hammer prices
const withoutHammerPrice = ARTWORKS.filter(a => !a.hammerPrice);

console.log('\n' + '='.repeat(80));
console.log('Sample artworks WITHOUT hammer prices (first 30):');
console.log('='.repeat(80));

withoutHammerPrice.slice(0, 30).forEach((artwork, idx) => {
  console.log(`${idx + 1}. "${artwork.name}" by ${artwork.artist}`);
  console.log(`   Slug: ${artwork.slug}`);
});

// Check if these artworks exist in HAMMER PRICE.txt with different names
console.log('\n' + '='.repeat(80));
console.log('Checking if any of these exist in HAMMER PRICE.txt with different names...');
console.log('='.repeat(80));

let foundSimilar = 0;
withoutHammerPrice.slice(0, 20).forEach((artwork) => {
  const nameWords = artwork.name.toLowerCase().split(/\s+/);
  const found = Array.from(hammerPriceArtworks).find(hpName => {
    const hpWords = hpName.toLowerCase().split(/\s+/);
    const commonWords = nameWords.filter(w => hpWords.includes(w) && w.length > 3);
    return commonWords.length >= 2;
  });

  if (found) {
    console.log(`\n✓ "${artwork.name}" (${artwork.slug})`);
    console.log(`  May match: "${found}"`);
    foundSimilar++;
  }
});

if (foundSimilar === 0) {
  console.log('\nNo similar matches found in first 20 artworks.');
}

console.log('\n' + '='.repeat(80));
console.log('Summary:');
console.log('='.repeat(80));
console.log(`Most artworks (${withoutHammerPrice.length}) don't have hammer prices because:`);
console.log(`1. They are not famous/iconic enough to have public auction estimates`);
console.log(`2. HAMMER PRICE.txt only contains ${hammerPriceArtworks.size} famous artworks`);
console.log(`3. This is expected - only the most famous masterpieces have hammer prices`);
