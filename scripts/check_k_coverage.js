const fs = require('fs');

// Get all image files in k folder
const imageFiles = fs.readdirSync('./public/image/k/').map(f => f.toLowerCase());
console.log('Total images in k folder:', imageFiles.length);

// Get artworks from artworks.ts with AM-K- prefix
const artworksContent = fs.readFileSync('./data/artworks.ts', 'utf-8');

// Find all K artworks with AM-K- prefix
const kArtworks = [];
const regex = /\{[^}]*sku:\s*"AM-K-\d+"[^}]*image:\s*"([^"]+)"[^}]*\}/gs;
let match;
while ((match = regex.exec(artworksContent)) !== null) {
  const imgMatch = match[0].match(/image:\s*"([^"]+)"/);
  if (imgMatch) {
    kArtworks.push(imgMatch[1].toLowerCase());
  }
}

console.log('K artworks with AM-K- prefix:', kArtworks.length);

// Get unique K artwork images
const uniqueKImages = [...new Set(kArtworks.map(i => i.replace('/image/k/', '')))];
console.log('Unique K artwork images:', uniqueKImages.length);

// Find missing images (in folder but not in AM-K artworks)
const missing = imageFiles.filter(img => !uniqueKImages.includes(img));
console.log('\nImages NOT covered by AM-K artworks:');
missing.forEach(m => console.log('  -', m));

// Find which AM-K artworks point to non-existent images
const nonExistent = uniqueKImages.filter(img => !imageFiles.includes(img));
console.log('\nAM-K artworks pointing to non-existent images:');
nonExistent.forEach(e => console.log('  -', e));
