const fs = require('fs');
const path = require('path');

// Read the TSV file
const tsvPath = 'd:\\DOWNLOADS\\New folder\\TOP 100 and Famous Art\\Rosie - ARTISTS A_Z.tsv';
const tsPath = path.join(__dirname, '..', 'data', 'artworks.ts');

const tsvContent = fs.readFileSync(tsvPath, 'utf-8');
const tsContent = fs.readFileSync(tsPath, 'utf-8');

// Parse TSV
const lines = tsvContent.split('\n');
const tsvArtworks = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line || line === 'A' || line === 'B' || line === 'C' || line === 'D' || line === 'E' || line === 'F' || line === 'G' || line === 'H' || line === 'I') continue;
  
  const parts = line.split('\t');
  if (parts.length < 2) continue;
  
  const title = parts[0]?.trim();
  const artist = parts[1]?.trim();
  
  if (!title || !artist || title === 'ART NAME A-Z') continue;
  
  tsvArtworks.push({
    title,
    artist,
    year: parts[2]?.trim() || '',
    originalDimensions: parts[3]?.trim() || '',
    sellingDimensions: parts[4]?.trim() || '',
    price: parts[5]?.trim() || '',
    artistLife: parts[7]?.trim() || ''
  });
}

console.log(`Found ${tsvArtworks.length} artworks in TSV`);

// Find missing artworks
const missingArtworks = [];

for (const artwork of tsvArtworks) {
  // Check if title exists in TS file
  const titlePattern = `title: "${artwork.title}"`;
  if (!tsContent.includes(titlePattern)) {
    missingArtworks.push(artwork);
  }
}

console.log(`\nFound ${missingArtworks.length} missing artworks:\n`);

// Group by artist
const byArtist = {};
for (const artwork of missingArtworks) {
  if (!byArtist[artwork.artist]) {
    byArtist[artwork.artist] = [];
  }
  byArtist[artwork.artist].push(artwork);
}

// Display grouped by artist
for (const [artist, artworks] of Object.entries(byArtist)) {
  console.log(`\n${artist} (${artworks[0].artistLife}):`);
  artworks.forEach(art => {
    console.log(`  - ${art.title} (${art.year})`);
  });
}

// Save to file for reference
fs.writeFileSync(
  path.join(__dirname, 'missing_artworks_report.json'),
  JSON.stringify(missingArtworks, null, 2)
);

console.log(`\n\nReport saved to missing_artworks_report.json`);
