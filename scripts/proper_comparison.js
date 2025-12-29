const fs = require('fs');

// Read artworks.ts and extract all artwork titles
function getArtworksFromTS() {
  const content = fs.readFileSync('c:/xampp/htdocs/artmasons/data/artworks.ts', 'utf8');
  
  // Extract all title values
  const titleRegex = /title:\s*["']([^"']+)["']/g;
  const titles = [];
  let match;
  
  while ((match = titleRegex.exec(content)) !== null) {
    titles.push(match[1]);
  }
  
  return titles;
}

// Read PDF raw text and extract artwork titles
function getArtworksFromPDFs() {
  const letters = ['a', 'b', 'c', 'd'];
  const pdfTitles = new Set();
  
  for (const letter of letters) {
    const filename = `c:/xampp/htdocs/artmasons/scripts/${letter}_pdf_raw.txt`;
    if (!fs.existsSync(filename)) {
      console.log(`Warning: ${filename} not found`);
      continue;
    }
    
    const content = fs.readFileSync(filename, 'utf8');
    const lines = content.split('\n');
    
    // Parse artwork entries
    // Format: Title ArtistName Year dimensions price
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines, single letters, and year ranges
      if (!line || line.length < 3 || /^\d{4}-$/.test(line) || /^\d{4}$/.test(line)) {
        continue;
      }
      
      // Look for lines that contain artist names and years (main artwork lines)
      // Pattern: Title + Full Name + Year (4 digits) + dimensions/price
      if (/\d{4}/.test(line) && line.length > 30) {
        // This is likely a main artwork line
        // Extract the title part (everything before the artist's name)
        
        // Common artist patterns to find where title ends
        const artistPatterns = [
          'John Otis Adams',
          'Wilem Van Aelst',
          'Pieter Aertsen',
          'Jaques-Laurent Agasse',
          'Ivan Konstantinovich Aivazovsky',
          'John White Alexander',
          'Sir Lawreance Alma-Tadema',
          'Jean Baptiste Camille Corot',
          'Gustave Caillebotte',
          'Canaletto',
          'Michelangelo Merisi Da Caravaggio',
          'Mary Stevenson Cassatt',
          'Paul Cezanne',
          'Jean Simeon Chardin',
          'John Constable',
          'Leonardo Da Vinci',
          'Jaques-Louis David',
          'Hilaire Germaine Edgar Degas',
          'Alexandre Francois Desportes',
          'Melchior D\'Hondecoeter',
          'Raoul Dufy'
        ];
        
        let title = null;
        for (const artist of artistPatterns) {
          const idx = line.indexOf(artist);
          if (idx > 0) {
            title = line.substring(0, idx).trim();
            break;
          }
        }
        
        if (title) {
          pdfTitles.add(title);
          console.log(`Found: "${title}"`);
        }
      }
    }
  }
  
  return pdfTitles;
}

console.log('=== EXTRACTING ARTWORKS FROM PDFs ===\n');
const pdfTitles = getArtworksFromPDFs();
console.log(`\nTotal unique titles found in PDFs: ${pdfTitles.size}\n`);

console.log('=== EXTRACTING ARTWORKS FROM artworks.ts ===\n');
const tsTitles = getArtworksFromTS();
console.log(`Total titles in artworks.ts: ${tsTitles.length}\n`);

console.log('=== FINDING NON-MATCHING ARTWORKS ===\n');
const nonMatching = tsTitles.filter(title => !pdfTitles.has(title));
console.log(`Found ${nonMatching.length} artworks to remove:\n`);

nonMatching.forEach((title, idx) => {
  console.log(`${idx + 1}. "${title}"`);
});

// Save results
fs.writeFileSync(
  'c:/xampp/htdocs/artmasons/scripts/artworks_to_remove.json',
  JSON.stringify(nonMatching, null, 2)
);

console.log(`\n✓ List saved to scripts/artworks_to_remove.json`);
console.log(`\nSummary:`);
console.log(`- PDFs contain: ${pdfTitles.size} artworks`);
console.log(`- artworks.ts contains: ${tsTitles.length} artworks`);
console.log(`- To remove: ${nonMatching.length} artworks`);
console.log(`- Will remain: ${tsTitles.length - nonMatching.length} artworks`);
