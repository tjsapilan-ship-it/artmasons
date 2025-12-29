const fs = require('fs');
const path = require('path');

// Verify artworks in artworks.ts match the output files
function main() {
  const letters = ['H', 'I', 'J'];
  
  // Read artworks.ts
  const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
  const artworksContent = fs.readFileSync(artworksPath, 'utf-8');
  
  // Extract all titles
  const titleRegex = /title:\s*"([^"]+)"/g;
  const allTitles = [];
  let match;
  
  while ((match = titleRegex.exec(artworksContent)) !== null) {
    allTitles.push(match[1]);
  }
  
  console.log('='.repeat(70));
  console.log('VERIFICATION: All artworks from PDFs in artworks.ts');
  console.log('='.repeat(70));
  console.log(`\nTotal artworks in artworks.ts: ${allTitles.length}`);
  
  // Expected artworks from PDFs (manually verified)
  const expectedArtworks = {
    J: [
      "Banquet In The Thames Tunnel",
      "The Port Of Dordrecht",
      "Rotterdam",
      "The Port Of Marseille",
      "Boatman By Windmill",
      "Le Port De La Tounelle, Paris",
      "Portrait Of Louis XV"
    ],
    I: [
      "Domtesse D'Haussonville",
      "The Clouded Sun",
      "The Home At Montclair",
      "Morning, Catskill Valley",
      "Sundown Near Montclair",
      "The Coming Storm",
      "A Bit Of Roman Aqueduct",
      "The Wood Chopper",
      "Crossing The Ford",
      "Hudson River Valley",
      "Landscape Sunset",
      "Landscape",
      "Autumn Oaks",
      "Villa Borgese, Rome",
      "Golden Glow (The Golden Sun)",
      "Sunrise",
      "Summer Foliage",
      "The Shepherds Prayer",
      "Children Of The Sea"
    ]
  };
  
  const titleSet = new Set(allTitles.map(t => t.toLowerCase()));
  
  for (const [letter, artworks] of Object.entries(expectedArtworks)) {
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`Letter ${letter} - ${artworks.length} artworks expected`);
    console.log('─'.repeat(70));
    
    const missing = [];
    const found = [];
    
    for (const artwork of artworks) {
      if (titleSet.has(artwork.toLowerCase())) {
        found.push(artwork);
      } else {
        missing.push(artwork);
      }
    }
    
    console.log(`✓ Found: ${found.length}`);
    console.log(`✗ Missing: ${missing.length}`);
    
    if (missing.length > 0) {
      console.log('\nMissing artworks:');
      missing.forEach(art => console.log(`  - ${art}`));
    } else {
      console.log('\n✅ ALL ARTWORKS PRESENT!');
    }
  }
  
  console.log(`\n${'='.repeat(70)}`);
  console.log('VERIFICATION COMPLETE');
  console.log('='.repeat(70));
}

main();
