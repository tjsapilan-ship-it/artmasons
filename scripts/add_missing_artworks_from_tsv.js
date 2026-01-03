const fs = require('fs');
const path = require('path');

// Read the missing artworks report
const missingArtworks = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'missing_artworks_report.json'), 'utf-8')
);

console.log(`Processing ${missingArtworks.length} missing artworks...`);

// Helper function to generate SKU
function generateSKU(artist, index) {
  const nameParts = artist.split(' ').filter(p => p.length > 2);
  let initials = nameParts.map(p => p[0].toUpperCase()).join('').slice(0, 3);
  if (initials.length < 3) {
    initials = artist.replace(/[^A-Z]/g, '').slice(0, 3);
  }
  return `AM-${initials}-${String(index).padStart(3, '0')}`;
}

// Helper function to clean and format image path
function generateImagePath(title, artist) {
  // Get first letter of artist surname
  const artistParts = artist.split(' ');
  let firstLetter = 'a';
  
  // Find surname (usually the last part, but handle special cases)
  for (let i = artistParts.length - 1; i >= 0; i--) {
    const part = artistParts[i].toLowerCase();
    if (part !== 'the' && part !== 'de' && part !== 'van' && part !== 'von' && part.length > 1) {
      firstLetter = part[0].toLowerCase();
      break;
    }
  }
  
  // Clean title for image filename
  const cleanTitle = title.toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s/g, ' ');
  
  return `/image/${firstLetter}/${cleanTitle}.jpg`;
}

// Helper function to parse price
function parsePrice(priceStr) {
  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/[,\s]/g, '')) || 0;
}

// Helper function to parse dimensions
function parseDimensions(dimStr) {
  if (!dimStr) return { width: 0, height: 0 };
  const match = dimStr.match(/(\d+\.?\d*)\s*x\s*(\d+\.?\d*)/);
  if (match) {
    return {
      width: parseFloat(match[1]),
      height: parseFloat(match[2])
    };
  }
  return { width: 0, height: 0 };
}

// Group artworks by artist surname first letter
const groupedByLetter = {};
for (const artwork of missingArtworks) {
  const artistParts = artwork.artist.split(' ');
  let firstLetter = 'a';
  
  for (let i = artistParts.length - 1; i >= 0; i--) {
    const part = artistParts[i].toLowerCase();
    if (part !== 'the' && part !== 'de' && part !== 'van' && part !== 'von' && part.length > 1) {
      firstLetter = part[0].toLowerCase();
      break;
    }
  }
  
  if (!groupedByLetter[firstLetter]) {
    groupedByLetter[firstLetter] = [];
  }
  groupedByLetter[firstLetter].push(artwork);
}

// Generate artwork entries for each letter
const allEntries = {};

for (const [letter, artworks] of Object.entries(groupedByLetter)) {
  console.log(`\nGenerating entries for letter ${letter.toUpperCase()} (${artworks.length} artworks)...`);
  
  // Group by artist to generate sequential SKUs
  const byArtist = {};
  for (const artwork of artworks) {
    if (!byArtist[artwork.artist]) {
      byArtist[artwork.artist] = [];
    }
    byArtist[artwork.artist].push(artwork);
  }
  
  const entries = [];
  
  for (const [artist, artistArtworks] of Object.entries(byArtist)) {
    // Find the highest existing SKU for this artist
    let skuIndex = 1;
    
    for (const artwork of artistArtworks) {
      const dims = parseDimensions(artwork.sellingDimensions || artwork.originalDimensions);
      const price = parsePrice(artwork.price);
      
      const entry = `  {
    title: "${artwork.title}",${artwork.year ? `\n    year: "${artwork.year}",` : ''}${artwork.originalDimensions ? `\n    originalSize: "${artwork.originalDimensions} cm",` : ''}
    artist: "${artwork.artist}",${artwork.artistLife ? `\n    artistLife: "${artwork.artistLife}",` : ''}
    sku: "${generateSKU(artwork.artist, skuIndex)}",${price ? `\n    basePrice: ${price},` : ''}
    currency: "AED",
    image: "${generateImagePath(artwork.title, artwork.artist)}",
    options: [${dims.width && dims.height ? `{ id: 'opt1', width: ${dims.width}, height: ${dims.height}, price: ${price}, label: 'Original Size' }` : ''}],
  }`;
      
      entries.push(entry);
      skuIndex++;
    }
  }
  
  allEntries[letter] = entries.join(',\n\n');
}

// Save each letter's entries to separate files for review
for (const [letter, entries] of Object.entries(allEntries)) {
  fs.writeFileSync(
    path.join(__dirname, `missing_artworks_${letter}.txt`),
    entries
  );
  console.log(`Saved missing_artworks_${letter}.txt`);
}

console.log('\n\nAll entries generated! Now adding to artworks.ts...');

// Read current artworks.ts
const tsPath = path.join(__dirname, '..', 'data', 'artworks.ts');
let tsContent = fs.readFileSync(tsPath, 'utf-8');

// Find the closing bracket of the array
const arrayEndIndex = tsContent.lastIndexOf('];');
if (arrayEndIndex === -1) {
  console.error('Could not find array end in artworks.ts');
  process.exit(1);
}

// Insert new entries before the closing bracket
const beforeArray = tsContent.substring(0, arrayEndIndex);
const afterArray = tsContent.substring(arrayEndIndex);

// Combine all entries
const allNewEntries = Object.values(allEntries).join(',\n\n');

// Build new content
const newContent = beforeArray.trimEnd() + ',\n\n' + allNewEntries + '\n' + afterArray;

// Write back to file
fs.writeFileSync(tsPath, newContent);

console.log('\n✓ Successfully added all missing artworks to artworks.ts!');
console.log(`Total artworks added: ${missingArtworks.length}`);
