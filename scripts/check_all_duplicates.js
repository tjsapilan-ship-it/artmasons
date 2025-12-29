const fs = require('fs');
const artworksContent = fs.readFileSync('./data/artworks.ts', 'utf-8');

// Extract all artworks
const lines = artworksContent.split('\n');
const allArtworks = [];

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('sku:')) {
    const skuMatch = lines[i].match(/sku:\s*"([^"]+)"/);
    if (!skuMatch) continue;
    
    const sku = skuMatch[1];
    let title = '';
    let artist = '';
    let image = '';
    
    // Look around for title, artist, image
    for (let j = Math.max(0, i - 10); j < Math.min(lines.length, i + 5); j++) {
      const line = lines[j];
      if (line.includes('title:')) {
        const m = line.match(/title:\s*"([^"]+)"/);
        if (m) title = m[1];
      }
      if (line.includes('artist:')) {
        const m = line.match(/artist:\s*"([^"]+)"/);
        if (m) artist = m[1];
      }
      if (line.includes('image:')) {
        const m = line.match(/image:\s*"([^"]+)"/);
        if (m) image = m[1];
      }
    }
    
    if (title && artist) {
      allArtworks.push({ sku, title, artist, image, line: i + 1 });
    }
  }
}

console.log(`Total artworks: ${allArtworks.length}\n`);

// Find exact duplicates (same title + artist)
const titleArtistMap = {};
allArtworks.forEach(art => {
  const key = `${art.title}|||${art.artist}`;
  if (!titleArtistMap[key]) {
    titleArtistMap[key] = [];
  }
  titleArtistMap[key].push(art);
});

console.log('DUPLICATE ARTWORKS (same title + artist):');
let foundDupes = false;
Object.entries(titleArtistMap).forEach(([key, artworks]) => {
  if (artworks.length > 1) {
    foundDupes = true;
    const [title, artist] = key.split('|||');
    console.log(`\n"${title}" by ${artist} (${artworks.length} times):`);
    artworks.forEach(a => {
      console.log(`  ${a.sku.padEnd(15)} line ${String(a.line).padStart(5)}  ${a.image}`);
    });
  }
});

if (!foundDupes) {
  console.log('  None found - all artworks are unique!\n');
} else {
  console.log('\n');
}
