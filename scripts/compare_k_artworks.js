const fs = require('fs');

// Get all image files in k folder
const imageFiles = fs.readdirSync('./public/image/k/').map(f => f.toLowerCase().replace('.jpg', ''));
console.log('Total images in k folder:', imageFiles.length);

// Get artworks from artworks.ts with /image/k/
const artworksContent = fs.readFileSync('./data/artworks.ts', 'utf-8');
const imageMatches = artworksContent.match(/image:\s*"\/image\/k\/([^"]+)\.jpg"/g) || [];
const existingImages = imageMatches.map(m => {
  const match = m.match(/image:\s*"\/image\/k\/([^"]+)\.jpg"/);
  return match ? match[1].toLowerCase() : null;
}).filter(Boolean);

console.log('Images referenced in artworks.ts:', existingImages.length);

// Find missing images
const missing = imageFiles.filter(img => !existingImages.includes(img));
console.log('\nMissing images (in folder but not in artworks.ts):');
missing.forEach(m => console.log('  -', m));

// Extra images (in artworks.ts but not in folder)
const extra = existingImages.filter(img => !imageFiles.includes(img));
console.log('\nExtra/wrong images (in artworks.ts but not in folder):');
extra.forEach(e => console.log('  -', e));
