const fs = require('fs');

// Read the main artworks.ts file
const artworksContent = fs.readFileSync('./data/artworks.ts', 'utf8');

// Read R and S artworks (without the export statement)
const rContent = fs.readFileSync('./scripts/r_artworks_output.ts', 'utf8');
const sContent = fs.readFileSync('./scripts/s_artworks_output.ts', 'utf8');

// Extract just the artworks array content (remove export statement and brackets)
const rArtworks = rContent
  .replace('export const rArtworks = [', '')
  .replace(/\];[\s\S]*$/, '')
  .trim();

const sArtworks = sContent
  .replace('export const sArtworks = [', '')
  .replace(/\];[\s\S]*$/, '')
  .trim();

// Find the insertion point - between P (AM-P-028) and T (AM-T-001)
const insertionPoint = artworksContent.indexOf('  },\n\n  {\n    title: "Three Sisters A Study In June Sunlight",');

if (insertionPoint === -1) {
  console.error('Could not find insertion point');
  process.exit(1);
}

// Build the new content
const beforeInsertion = artworksContent.substring(0, insertionPoint);
const afterInsertion = artworksContent.substring(insertionPoint);

// Insert R and S artworks with proper formatting
const newContent = beforeInsertion + 
  '},\n\n  ' + rArtworks.trim() + ',\n\n  ' + sArtworks.trim() + ',\n\n  ' +
  afterInsertion.substring(6); // Remove the "  },\n\n  " at the start

// Write the updated file
fs.writeFileSync('./data/artworks.ts', newContent, 'utf8');

console.log('✅ Successfully added R and S artworks to artworks.ts');
console.log(`📊 Added ${rArtworks.match(/\bsku:/g).length} R artworks`);
console.log(`📊 Added ${sArtworks.match(/\bsku:/g).length} S artworks`);
