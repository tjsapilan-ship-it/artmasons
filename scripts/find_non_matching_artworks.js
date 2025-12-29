const fs = require('fs');
const pdf = require('pdf-parse');

// Parse all artworks from a PDF text
function parseArtworksFromPDF(text, letter) {
  const artworks = [];
  const lines = text.split('\n');
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Skip header and empty lines
    if (!line || line === letter || line.match(/^\d{4}-$/)) {
      i++;
      continue;
    }
    
    // Look for artwork title patterns (lines that start with capital letter and contain multiple words)
    if (line && line[0] === line[0].toUpperCase() && !line.match(/^\d/)) {
      // Collect the full title (might span multiple lines)
      let titleLine = line;
      let artistLine = '';
      
      // Look ahead for artist name
      let j = i + 1;
      while (j < lines.length && lines[j].trim()) {
        const nextLine = lines[j].trim();
        
        // Check if this looks like an artist name (contains known artist patterns)
        if (nextLine.match(/[A-Z][a-z]+/) && 
            (nextLine.includes(' ') || nextLine.match(/^[A-Z]/))) {
          artistLine = nextLine;
          break;
        }
        j++;
      }
      
      if (artistLine) {
        artworks.push({
          title: titleLine,
          artist: artistLine,
          letter: letter
        });
      }
    }
    
    i++;
  }
  
  return artworks;
}

// Normalize title for comparison (remove special chars, lowercase, trim spaces)
function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function findNonMatchingArtworks() {
  console.log('=== FINDING NON-MATCHING ARTWORKS ===\n');
  
  // Step 1: Extract all artworks from PDFs
  const pdfArtworks = [];
  
  for (const letter of ['A', 'B', 'C', 'D']) {
    console.log(`Reading ART_DETAILS_${letter}.pdf...`);
    const dataBuffer = fs.readFileSync(`data/ART_DETAILS_${letter}.pdf`);
    const data = await pdf(dataBuffer);
    
    // Use the raw text we already extracted
    const rawText = fs.readFileSync(`scripts/${letter.toLowerCase()}_pdf_raw.txt`, 'utf8');
    
    // Manually parse based on the actual PDF structure we've seen
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l);
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip letter header and life dates
      if (line === letter || line.match(/^\d{4}-$/) || line.match(/^[\d,]+$/)) {
        continue;
      }
      
      // If line looks like a title (starts with capital, has words)
      if (line && line[0] === line[0].toUpperCase() && line.length > 3) {
        // Next non-empty line should be artist
        let j = i + 1;
        while (j < lines.length && !lines[j]) j++;
        
        if (j < lines.length) {
          const artistLine = lines[j];
          // Store normalized title
          pdfArtworks.push({
            title: line,
            normalizedTitle: normalizeTitle(line),
            artist: artistLine,
            letter: letter
          });
        }
      }
    }
  }
  
  console.log(`Total artworks found in PDFs: ${pdfArtworks.length}\n`);
  
  // Step 2: Parse artworks.ts
  console.log('Reading artworks.ts...');
  const artworksContent = fs.readFileSync('data/artworks.ts', 'utf8');
  
  // Extract all title entries from artworks.ts
  const titleMatches = artworksContent.matchAll(/title:\s*"([^"]+)"/g);
  const tsArtworks = [];
  
  for (const match of titleMatches) {
    tsArtworks.push({
      title: match[1],
      normalizedTitle: normalizeTitle(match[1])
    });
  }
  
  console.log(`Total artworks in artworks.ts: ${tsArtworks.length}\n`);
  
  // Step 3: Find artworks in TS that are NOT in PDFs
  const pdfTitlesSet = new Set(pdfArtworks.map(a => a.normalizedTitle));
  const nonMatching = [];
  
  for (const tsArtwork of tsArtworks) {
    if (!pdfTitlesSet.has(tsArtwork.normalizedTitle)) {
      nonMatching.push(tsArtwork.title);
    }
  }
  
  // Step 4: Output results
  console.log('=== NON-MATCHING ARTWORKS (in artworks.ts but NOT in PDFs) ===\n');
  
  if (nonMatching.length === 0) {
    console.log('✓ No non-matching artworks found! All records in artworks.ts exist in PDFs.');
  } else {
    console.log(`Found ${nonMatching.length} artworks that need to be removed:\n`);
    nonMatching.forEach((title, idx) => {
      console.log(`${idx + 1}. "${title}"`);
    });
    
    // Save to file for review
    fs.writeFileSync('scripts/non_matching_artworks.json', JSON.stringify(nonMatching, null, 2));
    console.log('\n✓ List saved to scripts/non_matching_artworks.json');
  }
  
  // Also save PDF artworks list for reference
  fs.writeFileSync('scripts/pdf_artworks_list.json', JSON.stringify(
    pdfArtworks.map(a => ({ title: a.title, artist: a.artist, letter: a.letter })), 
    null, 
    2
  ));
  console.log('✓ PDF artworks list saved to scripts/pdf_artworks_list.json');
  
  return nonMatching;
}

findNonMatchingArtworks().catch(console.error);
