const fs = require('fs');

// Read the list of titles to remove
const titlesToRemove = JSON.parse(
  fs.readFileSync('c:/xampp/htdocs/artmasons/scripts/verified_titles_to_remove.json', 'utf8')
);

console.log(`=== REMOVING ${titlesToRemove.length} ARTWORKS ===\n`);

// Read artworks.ts
let content = fs.readFileSync('c:/xampp/htdocs/artmasons/data/artworks.ts', 'utf8');

// Create backup
fs.writeFileSync('c:/xampp/htdocs/artmasons/data/artworks.ts.backup', content);
console.log('✓ Backup created at artworks.ts.backup\n');

let removedCount = 0;

for (const title of titlesToRemove) {
  console.log(`Removing: "${title}"`);
  
  // Find the artwork object for this title
  // Pattern: find from title line to the closing }, (including whitespace)
  const titleEscaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Match the entire artwork object
  // Starting from the opening { before title, ending at }, after options
  const artworkRegex = new RegExp(
    `\\n\\s*{[^}]*?title:\\s*["']${titleEscaped}["'][\\s\\S]*?options:\\s*\\[[^\\]]*?\\]\\s*},`,
    'g'
  );
  
  const beforeLength = content.length;
  content = content.replace(artworkRegex, '');
  const afterLength = content.length;
  
  if (beforeLength > afterLength) {
    removedCount++;
    console.log(`  ✓ Removed`);
  } else {
    console.log(`  ✗ Not found - trying alternate pattern`);
    
    // Try alternate pattern without options (some artworks might have different structure)
    const altRegex = new RegExp(
      `\\n\\s*{[^{]*?title:\\s*["']${titleEscaped}["'][\\s\\S]*?},\\s*(?=\\n|$)`,
      'g'
    );
    
    const beforeLength2 = content.length;
    content = content.replace(altRegex, '');
    const afterLength2 = content.length;
    
    if (beforeLength2 > afterLength2) {
      removedCount++;
      console.log(`  ✓ Removed (alternate pattern)`);
    } else {
      console.log(`  ✗ Could not find artwork`);
    }
  }
}

// Clean up any double empty lines
content = content.replace(/\n\n\n+/g, '\n\n');

// Write the updated content
fs.writeFileSync('c:/xampp/htdocs/artmasons/data/artworks.ts', content);

console.log(`\n=== SUMMARY ===`);
console.log(`Artworks to remove: ${titlesToRemove.length}`);
console.log(`Successfully removed: ${removedCount}`);
console.log(`Failed to remove: ${titlesToRemove.length - removedCount}`);
console.log(`\n✓ Updated artworks.ts saved`);
console.log(`✓ Backup available at artworks.ts.backup`);
