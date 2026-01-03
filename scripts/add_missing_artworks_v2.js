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

// Group by artist to generate sequential SKUs
const byArtist = {};
for (const artwork of missingArtworks) {
  if (!byArtist[artwork.artist]) {
    byArtist[artwork.artist] = [];
  }
  byArtist[artwork.artist].push(artwork);
}

const entries = [];

for (const [artist, artistArtworks] of Object.entries(byArtist)) {
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

const allNewEntries = entries.join(',\n\n');

console.log(`Generated ${entries.length} artwork entries`);

// Read current artworks.ts
const tsPath = path.join(__dirname, '..', 'data', 'artworks.ts');
let tsContent = fs.readFileSync(tsPath, 'utf-8');

// Find the last artwork entry before the closing ];
// Look for the pattern "  },\n\n];" or "  },\n];"
const lines = tsContent.split('\n');
let insertIndex = -1;

// Find the line with just "];" that closes the ARTWORKS array
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === '];' && i > 100) {
    // Check if previous lines suggest this is the array end
    let foundArrayEnd = false;
    for (let j = Math.max(0, i - 5); j < i; j++) {
      if (lines[j].includes('  },')) {
        foundArrayEnd = true;
        break;
      }
    }
    if (foundArrayEnd) {
      insertIndex = i;
      break;
    }
  }
}

if (insertIndex === -1) {
  console.error('Could not find the correct array closing position');
  process.exit(1);
}

console.log(`Found array end at line ${insertIndex + 1}`);

// Insert new entries
const beforeArray = lines.slice(0, insertIndex).join('\n');
const afterArray = lines.slice(insertIndex).join('\n');

const newContent = beforeArray + ',\n\n' + allNewEntries + '\n' + afterArray;

// Write back to file
fs.writeFileSync(tsPath, newContent);

console.log('\n✓ Successfully added all missing artworks to artworks.ts!');
console.log(`Total artworks added: ${missingArtworks.length}`);
console.log(`File now has ${newContent.split('\n').length} lines`);
