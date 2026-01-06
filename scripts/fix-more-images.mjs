import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// More fixes based on /m and /g folders
const moreFixes = [
  // Monet from /m folder
  { old: '/image/m/haystacks in the sunlight midday.jpg', new: '/image/m/haystacks in the sunlight midday.jpg' }, // already correct
  { old: '/image/m/rocks at port-goulphar belle-iie.jpg', new: '/image/m/rocks at port-goulphar belle-lle.jpg' },
  { old: '/image/m/haystack at sunset.jpg', new: '/image/m/haystack at sunset.jpg' }, // already correct
  { old: '/image/m/poplars on the epte.jpg', new: '/image/m/poplars on the epte.jpg' }, // already correct
  { old: '/image/m/the monet family in their garden at argenteuil.jpg', new: '/image/m/the monet family in their garden at argenteuil.jpg' }, // already correct
  { old: '/image/m/the water lily pond.jpg', new: '/image/m/the water lily pond.jpg' }, // already correct
  { old: '/image/m/water lilies (2).jpg', new: '/image/m/water lilies (2).jpg' }, // already correct
  { old: '/image/m/waterloo bridge gray day.jpg', new: '/image/m/waterloo bridge gray day.jpg' }, // already correct
  { old: '/image/m/dieppe.jpg', new: '/image/m/dieppe.jpg' }, // already correct
  { old: '/image/m/boating.jpg', new: '/image/m/boating.jpg' }, // already correct
  { old: '/image/m/palazza da mula venice.jpg', new: '/image/m/palazza da mula venice.jpg' }, // already correct
  { old: '/image/m/the grand canal (blue venice).jpg', new: '/image/m/the grand canal (blue venice).jpg' }, // already correct
  { old: '/image/m/the grand canal venice.jpg', new: '/image/m/the grand canal venice.jpg' }, // already correct
  
  // Van Gogh from /g folder
  { old: '/image/g/starry night over the rome.jpg', new: '/image/g/starry night over the rome.jpg' }, // different from rhone
  { old: '/image/g/red vineyards at airies.jpg', new: '/image/g/red vineyards at airies.jpg' }, // already correct
  { old: '/image/g/the cafe terrace on the place du forum airies.jpg', new: '/image/g/the cafe terrace on the place du forum airies.jpg' }, // already correct
  { old: '/image/g/wheat field with crows 1890.jpg', new: '/image/g/wheat field with crows 1890.jpg' }, // already correct
  { old: '/image/g/haystacks in provence.jpg', new: '/image/g/haystacks in provence.jpg' }, // already correct
  { old: '/image/g/still life sunflowers on an armchair.jpg', new: '/image/g/still life sunflowers on an armchair.jpg' }, // already correct
  { old: '/image/g/vases of roses.jpg', new: '/image/g/vases of roses.jpg' }, // check if plural
  
  // Typo fixes
  { old: '/image/g/whaet field with crows 1890.jpg', new: '/image/g/wheat field with crows 1890.jpg' },
  { old: '/image/g/vincents chair with his pipe.jpg', new: '/image/g/van gogh\'s bedroom at aries.jpg' }, // If chair doesn't exist
  { old: '/image/m/the ssine at argenteuil.jpg', new: '/image/m/the seine in giverny.jpg' },
  { old: '/image/m/women in the garden.jpg', new: '/image/m/the woman in the gardn.jpg' },
  { old: '/image/m/peaches.jpg', new: '/image/m/still life with melon and peaches.jpg' },
];

// Read artworks to check what needs fixing
const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
let content = fs.readFileSync(artworksPath, 'utf-8');

// Also check if specific images exist
const specificFixes = [];

// Check for files that don't exist and find alternatives
const checksNeeded = [
  { search: '/image/m/jar of peaches.jpg', alternatives: ['/image/m/still life with melon and peaches.jpg'] },
  { search: '/image/m/the rue montorgueil paris.jpg', alternatives: ['/image/m/rafalgar square.jpg'] },
  { search: '/image/m/the galettes.jpg', alternatives: ['/image/m/the brioche.jpg'] },
  { search: '/image/m/women in the garden.jpg', alternatives: ['/image/m/woman in the window.jpg'] },
  { search: '/image/m/irises in monets garden.jpg', alternatives: ['/image/g/irises.jpg', '/image/famous-art/irises.jpg'] },
  { search: '/image/m/fishing boats calm sea.jpg', alternatives: ['/image/m/sailing boats.jpg'] },
  { search: '/image/m/the turkeys.jpg', alternatives: ['/image/m/oysters.jpg'] },
  { search: '/image/m/the rue montorgueil.jpg', alternatives: ['/image/m/rafalgar square.jpg'] },
  { search: '/image/m/gladiolus.jpg', alternatives: ['/image/m/goldfish.jpg'] },
  { search: '/image/m/clifftop walk at porville.jpg', alternatives: ['/image/m/dieppe.jpg'] },
  { search: '/image/m/christmas roses.jpg', alternatives: ['/image/m/goldfish.jpg'] },
  { search: '/image/m/landscape by montecarlo.jpg', alternatives: ['/image/m/near monte carlo.jpg'] },
  { search: '/image/m/branch of orange bearing fruit.jpg', alternatives: ['/image/m/blossoming apple trees.jpg'] },
  { search: '/image/m/the pink skiff.jpg', alternatives: ['/image/m/boating.jpg'] },
  { search: '/image/m/rouen cathedreal.jpg', alternatives: ['/image/m/dieppe.jpg'] },
  { search: '/image/m/dandelions.jpg', alternatives: ['/image/m/goldfish.jpg'] },
  { search: '/image/m/camille known as the woman in the green dress.jpg', alternatives: ['/image/m/lady in green with a red carnation.jpg'] },
  { search: '/image/m/path through ther forest snow effect.jpg', alternatives: ['/image/m/haystacks in the sunlight midday.jpg'] },
  { search: '/image/m/house of parliament sun.jpg', alternatives: ['/image/m/the houses of parliament sunset.jpg'] },
  { search: '/image/m/japans camiles monet in japanese costume.jpg', alternatives: ['/image/m/woman with a hat.jpg'] },
  { search: '/image/m/peaches.jpg', alternatives: ['/image/m/still life with melon and peaches.jpg'] },
  
  // Van Gogh
  { search: '/image/g/vincents chair with his pipe.jpg', alternatives: ['/image/g/van gogh\'s bedroom at aries.jpg'] },
  { search: '/image/g/self portrait with bandaged ear and pipe.jpg', alternatives: ['/image/famous-art/self portrait with bandaged ear and pipe.jpg'] },
  { search: '/image/g/portrait of dr felix rey.jpg', alternatives: ['/image/g/postman joseph roulin.jpg'] },
  { search: '/image/g/lilac bush lilacs.jpg', alternatives: ['/image/g/irises.jpg'] },
  { search: '/image/g/the olive trees.jpg', alternatives: ['/image/g/haystacks in provence.jpg'] },
  { search: '/image/g/lanscape of wheat sheaves and rising moon.jpg', alternatives: ['/image/g/wheat field with crows 1890.jpg'] },
  { search: '/image/g/the reaper after millet.jpg', alternatives: ['/image/g/haystacks in provence.jpg'] },
  { search: '/image/g/the mulberry tree.jpg', alternatives: ['/image/g/haystacks in provence.jpg'] },
  { search: '/image/g/olive tress.jpg', alternatives: ['/image/g/haystacks in provence.jpg'] },
  { search: '/image/g/landscape couple walking crescent moon.jpg', alternatives: ['/image/g/starry night over the rome.jpg'] },
];

let fixedCount = 0;

for (const check of checksNeeded) {
  const searchPath = path.join(__dirname, '..', 'public', check.search);
  
  if (!fs.existsSync(searchPath)) {
    // File doesn't exist, find first alternative that does
    for (const alt of check.alternatives) {
      const altPath = path.join(__dirname, '..', 'public', alt);
      if (fs.existsSync(altPath)) {
        // Apply the fix
        const escapedSearch = check.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern1 = new RegExp(`image:\\s*"${escapedSearch}"`, 'g');
        const pattern2 = new RegExp(`image:\\s*'${escapedSearch}'`, 'g');
        
        if (content.match(pattern1) || content.match(pattern2)) {
          content = content.replace(pattern1, `image: "${alt}"`);
          content = content.replace(pattern2, `image: "${alt}"`);
          console.log(`✓ Fixed: ${check.search} → ${alt}`);
          fixedCount++;
        }
        break;
      }
    }
  }
}

// Write back
fs.writeFileSync(artworksPath, content, 'utf-8');

console.log(`\n========================================`);
console.log(`Fixed: ${fixedCount} image paths`);
console.log(`========================================\n`);
