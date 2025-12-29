const fs = require('fs');
const pdf = require('pdf-parse');

// All PDF files to process
const pdfFiles = [
  'data/ART_DETAILS_A.pdf',
  'data/ART_DETAILS_B.pdf',
  'data/ART_DETAILS_C.pdf',
  'data/ART_DETAILS_D.pdf',
  'data/ART_DETAILS_E.pdf',
  'data/ART_DETAILS_G.pdf',
  'data/ART_DETAILS_H.pdf',
  'data/ART_DETAILS_I.pdf',
  'data/ART_DETAILS_J.pdf',
  'data/ART_DETAILS_K.pdf',
  'data/ART_DETAILS_M.pdf',
  'data/ART_DETAILS_N.pdf',
  'data/ART_DETAILS_O.pdf',
  'data/ART_DETAILS_P.pdf',
  'data/ART_DETAILS_T.pdf',
  'data/ART_DETAILS_V.pdf',
  'data/ART_DETAILS_W.pdf',
  'data/ART_DETAILS_Y.pdf',
  'data/ART_DETAILS_Z.pdf',
];

async function extractPDFTitles() {
  const allTitles = new Set();
  
  for (const pdfFile of pdfFiles) {
    const fullPath = `c:/xampp/htdocs/artmasons/${pdfFile}`;
    if (!fs.existsSync(fullPath)) {
      console.log(`Skipping ${pdfFile} - file not found`);
      continue;
    }
    
    console.log(`Processing ${pdfFile}...`);
    
    const dataBuffer = fs.readFileSync(fullPath);
    const data = await pdf(dataBuffer);
    const text = data.text;
    
    // Save raw text for reference
    const letter = pdfFile.match(/ART_DETAILS_([A-Z])/)[1].toLowerCase();
    fs.writeFileSync(`c:/xampp/htdocs/artmasons/scripts/${letter}_pdf_raw.txt`, text);
    
    // Parse titles from the text
    // The format is: Title ArtistName Year dimensions price
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines, single letters, and year ranges
      if (!line || line.length < 5 || /^\d{4}-?$/.test(line) || /^[A-Z]$/.test(line)) {
        continue;
      }
      
      // Look for lines that likely contain artwork titles
      // These typically have a 4-digit year and are longer lines
      if (/\d{4}/.test(line) && line.length > 20) {
        // Try to extract title before the year
        // Common pattern: Title ... Year ...
        const match = line.match(/^(.+?)(\d{4})/);
        if (match) {
          let potentialTitle = match[1].trim();
          
          // Remove common artist name patterns at the end
          // This is a heuristic - artist names usually come right before the year
          const words = potentialTitle.split(' ');
          
          // If the last 2-4 words look like a name (capitalized), it's likely the artist
          // Remove them to get just the title
          if (words.length > 3) {
            // Check if last few words are capitalized (likely artist name)
            const lastWords = words.slice(-3);
            const likelyArtistName = lastWords.every(w => /^[A-Z]/.test(w) ||w === 'Van' || w === 'De' || w === 'Da' || w === 'D\'');
            
            if (likelyArtistName) {
              potentialTitle = words.slice(0, -3).join(' ').trim();
            }
          }
          
          if (potentialTitle.length > 3) {
            allTitles.add(potentialTitle);
            console.log(`  Found: "${potentialTitle}"`);
          }
        }
      }
      
      // Also check for multi-line titles
      // If a line doesn't have a year but next few lines might complete the artwork entry
      if (line.length > 10 && /^[A-Z]/.test(line) && !/\d{4}/.test(line)) {
        // Check next few lines to see if they complete the entry
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const nextLine = lines[j].trim();
          if (/\d{4}/.test(nextLine)) {
            // Found the year line - combine
            const fullText = line + ' ' + nextLine;
            const match = fullText.match(/^(.+?)(\d{4})/);
            if (match) {
              let title = match[1].trim();
              const words = title.split(' ');
              if (words.length > 3) {
                const lastWords = words.slice(-3);
                const likelyArtistName = lastWords.every(w => /^[A-Z]/.test(w) || w === 'Van' || w === 'De' || w === 'Da');
                if (likelyArtistName) {
                  title = words.slice(0, -3).join(' ').trim();
                }
              }
              if (title.length > 3) {
                allTitles.add(title);
                console.log(`  Found (multiline): "${title}"`);
              }
            }
            break;
          }
        }
      }
    }
    
    console.log(`  Total from ${pdfFile}: ${allTitles.size} unique titles so far\n`);
  }
  
  return allTitles;
}

(async () => {
  console.log('=== EXTRACTING TITLES FROM ALL PDFs ===\n');
  const pdfTitles = await extractPDFTitles();
  
  console.log(`\n=== TOTAL UNIQUE TITLES IN PDFs: ${pdfTitles.size} ===\n`);
  
  // Save all PDF titles
  fs.writeFileSync(
    'c:/xampp/htdocs/artmasons/scripts/all_pdf_titles.json',
    JSON.stringify(Array.from(pdfTitles).sort(), null, 2)
  );
  
  console.log('✓ All PDF titles saved to scripts/all_pdf_titles.json');
  
  // Now get titles from artworks.ts
  console.log('\n=== COMPARING WITH artworks.ts ===\n');
  const tsContent = fs.readFileSync('c:/xampp/htdocs/artmasons/data/artworks.ts', 'utf8');
  const titleRegex = /title:\s*["']([^"']+)["']/g;
  const tsTitles = [];
  let match;
  
  while ((match = titleRegex.exec(tsContent)) !== null) {
    tsTitles.push(match[1]);
  }
  
  console.log(`Total titles in artworks.ts: ${tsTitles.length}`);
  
  // Find non-matching titles
  const nonMatching = tsTitles.filter(title => !pdfTitles.has(title));
  
  console.log(`\nNon-matching titles (to remove): ${nonMatching.length}\n`);
  
  // Save non-matching titles
  fs.writeFileSync(
    'c:/xampp/htdocs/artmasons/scripts/titles_to_remove.json',
    JSON.stringify(nonMatching, null, 2)
  );
  
  console.log('✓ Non-matching titles saved to scripts/titles_to_remove.json');
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`PDFs contain: ${pdfTitles.size} artworks`);
  console.log(`artworks.ts contains: ${tsTitles.length} artworks`);
  console.log(`To remove: ${nonMatching.length} artworks`);
  console.log(`Will remain: ${tsTitles.length - nonMatching.length} artworks`);
})();
