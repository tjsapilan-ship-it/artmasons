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

// Generate all artwork code
const allCode = missing.map(generateArtworkCode).join('\n\n');

// Group by letter for reference
const byLetter = {};
for (const art of missing) {
  if (!byLetter[art.letter]) byLetter[art.letter] = [];
  byLetter[art.letter].push(art);
}

console.log('\nMissing by letter:');
for (const [letter, arts] of Object.entries(byLetter)) {
  console.log(`  ${letter}: ${arts.length} artworks`);
}

// Save the generated code
const outputPath = path.join(__dirname, 'klmn_artwork_additions.txt');
fs.writeFileSync(outputPath, allCode, 'utf-8');
console.log(`\nGenerated code saved to: ${outputPath}`);

// Read the current artworks.ts to find where to insert
const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
const artworksContent = fs.readFileSync(artworksPath, 'utf-8');

// Find the closing bracket of the array
const lastBracketIndex = artworksContent.lastIndexOf('];');

if (lastBracketIndex === -1) {
  console.log('ERROR: Could not find the end of ARTWORKS array');
  process.exit(1);
}

// Insert the new artworks before the closing bracket
const newContent = 
  artworksContent.substring(0, lastBracketIndex) + 
  '\n  // Additional artworks from K, L, M, N PDFs\n' +
  allCode + '\n' +
  artworksContent.substring(lastBracketIndex);

// Write the updated file
fs.writeFileSync(artworksPath, newContent, 'utf-8');
console.log(`\nSuccessfully added ${missing.length} artworks to artworks.ts`);

// Verify by counting titles
const newArtworksContent = fs.readFileSync(artworksPath, 'utf-8');
const titleCount = (newArtworksContent.match(/title:\s*"/g) || []).length;
console.log(`Total artworks now: ${titleCount}`);
