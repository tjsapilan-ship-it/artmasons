const fs = require('fs');

// Read the main artworks.ts file
const artworksContent = fs.readFileSync('./data/artworks.ts', 'utf8');

// Read T, U, V, W, Y, Z artworks output files
const letters = ['t', 'u', 'v', 'w', 'y', 'z'];
const artworksByLetter = {};

for (const letter of letters) {
  const filename = `./scripts/${letter}_artworks_output.txt`;
  if (fs.existsSync(filename)) {
    const content = fs.readFileSync(filename, 'utf8');
    // Extract just the artworks array content (remove export statement and brackets)
    const artworks = content
      .replace(/export const \w+Artworks = \[/, '')
      .replace(/\];[\s\S]*$/, '')
      .trim();
    artworksByLetter[letter] = artworks;
    console.log(`✅ Read ${letter.toUpperCase()} artworks`);
  } else {
    console.warn(`⚠️  ${filename} not found`);
  }
}

// Find the insertion point - after the last S artwork (AM-S-033)
const insertionPattern = /  },\n\n\];/;
const match = artworksContent.match(insertionPattern);

if (!match) {
  console.error('❌ Could not find insertion point (closing of ARTWORKS array)');
  process.exit(1);
}

const insertionPoint = artworksContent.indexOf(match[0]);

// Build the new content
const beforeInsertion = artworksContent.substring(0, insertionPoint + 4); // Include "  },"

// Prepare all the artworks to insert
const artworksToInsert = letters
  .filter(letter => artworksByLetter[letter])
  .map(letter => artworksByLetter[letter])
  .join(',\n\n  ');

const afterInsertion = artworksContent.substring(insertionPoint + 4); // From after "  },"

// Insert all artworks with proper formatting
const newContent = beforeInsertion + '\n\n  ' + artworksToInsert + afterInsertion;

// Write the updated file
fs.writeFileSync('./data/artworks.ts', newContent, 'utf8');

console.log('\n✅ Successfully added T, U, V, W, Y, Z artworks to artworks.ts');
letters.forEach(letter => {
  if (artworksByLetter[letter]) {
    const count = (artworksByLetter[letter].match(/\bsku:/g) || []).length;
    console.log(`📊 Added ${count} ${letter.toUpperCase()} artworks`);
  }
});
