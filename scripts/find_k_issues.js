const fs = require('fs');
const artworksContent = fs.readFileSync('./data/artworks.ts', 'utf-8');

// Find all AM-K artworks and check their artists
const lines = artworksContent.split('\n');
const kArtworks = [];

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('sku: "AM-K-')) {
    const skuMatch = lines[i].match(/sku:\s*"(AM-K-\d+)"/);
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
    
    kArtworks.push({ sku, title, artist, image, line: i + 1 });
  }
}

console.log(`Found ${kArtworks.length} AM-K artworks\n`);

// Find duplicates by title+artist
const titleArtistMap = {};
kArtworks.forEach(art => {
  const key = `${art.title}|||${art.artist}`;
  if (!titleArtistMap[key]) {
    titleArtistMap[key] = [];
  }
  titleArtistMap[key].push(art);
});

// Show duplicates
console.log('DUPLICATE ARTWORKS (same title + artist):');
let foundDupes = false;
Object.entries(titleArtistMap).forEach(([key, artworks]) => {
  if (artworks.length > 1) {
    foundDupes = true;
    const [title, artist] = key.split('|||');
    console.log(`\n"${title}" by ${artist}:`);
    artworks.forEach(a => {
      console.log(`  ${a.sku} (line ${a.line})`);
    });
  }
});

if (!foundDupes) {
  console.log('  None found');
}

// Show all by artist
console.log('\n\nALL K ARTWORKS BY ARTIST:');
const byArtist = {};
kArtworks.forEach(art => {
  if (!byArtist[art.artist]) {
    byArtist[art.artist] = [];
  }
  byArtist[art.artist].push(art);
});

Object.entries(byArtist).sort().forEach(([artist, artworks]) => {
  console.log(`\n${artist} (${artworks.length}):`);
  artworks.forEach(a => {
    console.log(`  ${a.sku}: ${a.title}`);
  });
});
