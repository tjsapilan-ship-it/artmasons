import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Final fixes for typos and known mismatches
const finalFixes = [
  // Typo fixes
  { old: '/image/g/whaet field with crows 1890.jpg', new: '/image/g/wheat field with crows 1890.jpg' },
  { old: '/image/m/the ssine at argenteuil.jpg', new: '/image/m/the seine in giverny.jpg' },
  { old: '/image/m/rocks at port-goulphar belle-iie.jpg', new: '/image/m/rocks at port-goulphar belle-lle.jpg' },
  { old: '/image/m/women in the garden.jpg', new: '/image/m/the woman in the gardn.jpg' },
  { old: '/image/m/the red room harmony in red.jpg', new: '/image/m/the red room, harmony in red.jpg' },
  
  // Da Vinci - check alternative
  { old: '/image/v/virgin and child with st anne.jpg', new: '/image/d/virgin and child with st anne.jpg' },
];

const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
let content = fs.readFileSync(artworksPath, 'utf-8');

let fixedCount = 0;

for (const fix of finalFixes) {
  const fullPath = path.join(__dirname, '..', 'public', fix.new);
  
  // Check if new path exists
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping - file doesn't exist: ${fix.new}`);
    continue;
  }
  
  const escapedOld = fix.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern1 = new RegExp(`image:\\s*"${escapedOld}"`, 'g');
  const pattern2 = new RegExp(`image:\\s*'${escapedOld}'`, 'g');
  
  if (content.match(pattern1) || content.match(pattern2)) {
    content = content.replace(pattern1, `image: "${fix.new}"`);
    content = content.replace(pattern2, `image: "${fix.new}"`);
    console.log(`✓ Fixed: ${fix.old} → ${fix.new}`);
    fixedCount++;
  }
}

fs.writeFileSync(artworksPath, content, 'utf-8');

console.log(`\n========================================`);
console.log(`Fixed: ${fixedCount} typos and mismatches`);
console.log(`========================================\n`);
