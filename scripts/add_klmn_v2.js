const fs = require('fs');
const path = require('path');

// Read missing artworks
const missingPath = path.join(__dirname, 'klmn_all_missing.json');
const missing = JSON.parse(fs.readFileSync(missingPath, 'utf-8'));

console.log(`Found ${missing.length} missing artworks to add`);

// Generate TypeScript code for each artwork
function generateArtworkCode(art) {
  // Parse dimensions for options
  let width = 0, height = 0;
  if (art.originalSize) {
    const dims = art.originalSize.split(' x ');
    if (dims.length === 2) {
      width = parseFloat(dims[0]) || 0;
      height = parseFloat(dims[1]) || 0;
    }
  }
  
  // Generate image path
  const imageName = art.title.toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
  
  const imagePath = `/image/${art.letter.toLowerCase()}/${imageName}.jpg`;
  
  return `  {
    title: "${art.title}",
    year: "${art.year || ''}",
    originalSize: "${art.originalSize ? art.originalSize + ' cm' : ''}",
    artist: "${art.artist}",
    artistLife: "${art.artistLife || ''}",
    sku: "${art.sku}",
    basePrice: ${art.basePrice || 0},
    currency: "AED",
    image: "${imagePath}",
    options: [{ id: 'opt1', width: ${width}, height: ${height}, price: ${art.basePrice || 0}, label: 'Original Size' }],
  },`;
}

// Read the current artworks.ts
const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
const artworksContent = fs.readFileSync(artworksPath, 'utf-8');

// Find the closing bracket of the ARTWORKS array
// Look for the pattern "];" that ends the array (not inside a function)
// The array declaration starts at line 17: "export const ARTWORKS: Artwork[] = ["

// Split into lines to find the correct closing bracket
const lines = artworksContent.split('\n');
let arrayEndLine = -1;

// Find the first `];` that's at the root level (after the array, before any export functions)
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === '];') {
    arrayEndLine = i;
    break;
  }
}

if (arrayEndLine === -1) {
  console.log('ERROR: Could not find the end of ARTWORKS array');
  process.exit(1);
}

console.log(`Found array end at line ${arrayEndLine + 1}`);

// Generate all artwork code
const allCode = '\n  // Additional artworks from K, L, M, N PDFs\n' +
  missing.map(generateArtworkCode).join('\n\n');

// Insert the new artworks before the closing bracket
lines.splice(arrayEndLine, 0, allCode);

// Write the updated file
const newContent = lines.join('\n');
fs.writeFileSync(artworksPath, newContent, 'utf-8');

// Verify by counting titles
const titleCount = (newContent.match(/title:\s*"/g) || []).length;
console.log(`\nSuccessfully added ${missing.length} artworks to artworks.ts`);
console.log(`Total artworks now: ${titleCount}`);

// Group by letter for reference
const byLetter = {};
for (const art of missing) {
  if (!byLetter[art.letter]) byLetter[art.letter] = [];
  byLetter[art.letter].push(art);
}

console.log('\nAdded by letter:');
for (const [letter, arts] of Object.entries(byLetter)) {
  console.log(`  ${letter}: ${arts.length} artworks`);
}
