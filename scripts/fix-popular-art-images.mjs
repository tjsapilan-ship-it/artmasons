import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map of corrections based on the scan results
const imageFixes = [
  // Picasso
  { expectedPath: '/image/p/the dream.jpg', correctPath: '/image/famous-art/the dream.jpg', slug: 'pablo-picasso-the-dream' },
  { expectedPath: '/image/p/garcon ala pipe.jpg', correctPath: '/image/famous-art/garcon a\'la pipe.jpg', slug: 'pablo-picasso-garcon-ala-pipe' },
  { expectedPath: '/image/p/figures at the seaside.jpg', correctPath: '/image/famous-art/figures at the seaside.jpg', slug: 'pablo-picasso-figures-at-the-seaside' },
  
  // Da Vinci
  { expectedPath: '/image/v/mona lisa la gioconda.jpg', correctPath: '/image/d/mona lisa (la gioconda).jpg', slug: 'leonardo-da-vinci-mona-lisa-la-gioconda' },
  { expectedPath: '/image/v/st john the baptist.jpg', correctPath: '/image/d/st john the baptist.jpg', slug: 'leonardo-da-vinci-st-john-the-baptist' },
  { expectedPath: '/image/v/the last supper.jpg', correctPath: '/image/d/the last supper.jpg', slug: 'leonardo-da-vinci-the-last-supper' },
  { expectedPath: '/image/v/the virgin on the rocks.jpg', correctPath: '/image/d/the virgin on the rocks.jpg', slug: 'leonardo-da-vinci-the-virgin-on-the-rocks' },
  { expectedPath: '/image/v/salvator mundi.jpg', correctPath: '/image/famous-art/salvator mundi.jpg', slug: 'leonardo-da-vinci-salvator-mundi' },
  
  // Van Gogh
  { expectedPath: '/image/g/starry night over the rhone.jpg', correctPath: '/image/famous-art/starry night.jpg', slug: 'vincent-van-gogh-starry-night-over-the-rhone' },
  { expectedPath: '/image/g/starry night.jpg', correctPath: '/image/famous-art/starry night.jpg', slug: 'vincent-van-gogh-starry-night' },
  { expectedPath: '/image/g/vincents bedroom in airies.jpg', correctPath: '/image/famous-art/van gogh\'s bedroom at aries.jpg', slug: 'vincent-van-gogh-vincents-bedroom-in-airies' },
  { expectedPath: '/image/g/wheat field with cypresses.jpg', correctPath: '/image/famous-art/wheat field with cypresses.jpg', slug: 'vincent-van-gogh-wheat-field-with-cypresses' },
  { expectedPath: '/image/g/self portrait with bandaged ear and pipe.jpg', correctPath: '/image/famous-art/self portrait with bandaged ear and pipe.jpg', slug: 'vincent-van-gogh-self-portrait-with-bandaged-ear-and-pipe' },
  
  // Klimt
  { expectedPath: '/image/k/music i.jpg', correctPath: '/image/famous-art/music I.jpg', slug: 'gustav-klimt-music-i' },
  { expectedPath: '/image/k/university of vienna ceiling medicine detail showing hygiieia.jpg', correctPath: '/image/k/university of vienna ceiling (medicine) detail showing hygiiegia.jpg', slug: 'gustav-klimt-university-of-vienna-ceiling-medicine-detail-showing-hygiieia' },
  
  // Landscapes
  { expectedPath: '/image/f/nude-youth-sitting-by-the-sea.jpg', correctPath: '/image/famous-art/nude youth sitting by the sea.jpg', slug: 'hippolyte-flandrin-nude-youth-sitting-by-the-sea' },
  { expectedPath: '/image/f/ship-in-the-polar-sea.jpg', correctPath: '/image/f/ship in the polar sea.jpg', slug: 'caspar-david-friedrich-ship-in-the-polar-sea' },
  { expectedPath: '/image/f/a wanderer above a sea of mist.jpg', correctPath: '/image/famous-art/a wanderer above a sea of mist.jpg', slug: 'caspar-david-friedrich-a-wanderer-above-a-sea-of-mist' },
];

const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
let content = fs.readFileSync(artworksPath, 'utf-8');

let fixedCount = 0;

for (const fix of imageFixes) {
  // Check if the correct path exists
  const fullPath = path.join(__dirname, '..', 'public', fix.correctPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping ${fix.slug} - correct path doesn't exist: ${fix.correctPath}`);
    continue;
  }
  
  // Replace in the content - look for image: followed by the old path
  const oldPattern = new RegExp(`image:\\s*['"]${fix.expectedPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g');
  const newValue = `image: '${fix.correctPath}'`;
  
  if (content.match(oldPattern)) {
    content = content.replace(oldPattern, newValue);
    console.log(`✓ Fixed: ${fix.slug}`);
    console.log(`  ${fix.expectedPath} → ${fix.correctPath}`);
    fixedCount++;
  }
}

// Write back
fs.writeFileSync(artworksPath, content, 'utf-8');

console.log(`\n========================================`);
console.log(`Fixed ${fixedCount} image paths in artworks.ts`);
console.log(`========================================\n`);
