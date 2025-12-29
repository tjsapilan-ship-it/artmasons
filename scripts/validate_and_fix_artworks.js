const fs = require('fs');
const pdf = require('pdf-parse');

// Parse artwork entries from PDF text
function parseArtworks(text, letter) {
  const lines = text.split('\n').filter(line => line.trim());
  const artworks = [];
  
  // Skip the letter header line
  let i = lines[0] === letter ? 1 : 0;
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Look for patterns that indicate artwork entries
    // Format: Title Artist Year Dimensions Dimensions Price Life
    const parts = line.split(/\s{2,}/); // Split by 2+ spaces
    
    if (parts.length >= 3) {
      // This is likely an artwork entry
      const titleMatch = line.match(/^(.+?)\s{2,}([A-Z][^0-9]+?)\s{2,}(\d{4}|Unknown)/);
      
      if (titleMatch) {
        const title = titleMatch[1].trim();
        const artist = titleMatch[2].trim();
        const year = titleMatch[3].trim();
        
        artworks.push({
          title: title,
          artist: artist,
          year: year,
          rawLine: line
        });
      }
    }
    
    i++;
  }
  
  return artworks;
}

async function validateArtworks() {
  console.log('Starting validation of artworks against PDF files...\n');
  
  // Read all PDF files
  const pdfFiles = ['A', 'B', 'C', 'D'];
  const pdfArtworks = {};
  
  for (const letter of pdfFiles) {
    console.log(`Reading ART_DETAILS_${letter}.pdf...`);
    const dataBuffer = fs.readFileSync(`data/ART_DETAILS_${letter}.pdf`);
    const data = await pdf(dataBuffer);
    
    // Store the raw text for manual inspection
    fs.writeFileSync(`scripts/${letter.toLowerCase()}_pdf_raw.txt`, data.text);
    
    // Parse artworks from the text
    const artworks = parseArtworks(data.text, letter);
    pdfArtworks[letter] = data.text;
    
    console.log(`  Found content in ${letter}`);
  }
  
  // Read current artworks.ts
  console.log('\nReading current artworks.ts...');
  const artworksContent = fs.readFileSync('data/artworks.ts', 'utf8');
  
  // Extract artist names that need fixing based on PDF content
  console.log('\n=== ARTIST NAME CORRECTIONS NEEDED ===\n');
  
  const corrections = {
    'A': {
      // From PDF: Second column has the artist name
      pdfArtists: [
        'John Otis Adams',
        'Wilem Van Aelst',
        'Pieter Aertsen',
        'Jaques-Laurent Agasse',
        'Ivan Konstantinovich Aivazovsky',
        'John White Alexander',
        'Sir Lawreance Alma-Tadema'
      ]
    },
    'B': {
      pdfArtists: [
        'Boyond Joachim Beuckelaer',
        'Pompeo Girolamo Batoni',
        'Barthel Beham',
        'Giovanni Bellini',
        'Antonio De Bellis',
        'Bernado Belotto',
        'Frank Weston Benson',
        'Jean Beraud',
        'Albert Bierstadt',
        'Thomas Birch',
        'Eugen De Blaas',
        'Edmund Blair (Leighton)',
        'Nikolay Bogdanov Belsky',
        'Giovanni Boldini',
        'Francois Boucher',
        'Valentin De Boulogne',
        'Frederick Arthur Bridgman',
        'Pieter Bruegel The Elder',
        'Augostino Brunias'
      ]
    },
    'C': {
      pdfArtists: [
        'Gustave Caillebotte',
        'Giovanni Antonio Canal Canaletto',
        'Michelangelo Merisi Da Caravaggio',
        'Charles Emile August Caralus -Duran',
        'Paul Cezanne',
        'Philippe De Champaigne',
        'Jean Baptiste-Simeon Chardin',
        'Eduard Charlemont',
        'William Merrit Chase',
        'Pieter Claesz',
        'Georges Clarin',
        'Jean The Younger Clouet',
        'Francois Clouet',
        'Adriaen Coorte',
        'Edouard Cortes'
      ]
    },
    'D': {
      pdfArtists: [
        "Melchior D'Hondecoeter",
        'Leonardo Da Vinci',
        'Jaques-Louis David',
        'Hilaire Germaine Edgar Degas',
        'Alexandre-Francois Desportes',
        'Raoul Dufy'
      ]
    }
  };
  
  console.log('Artist names from PDFs:');
  for (const [letter, data] of Object.entries(corrections)) {
    console.log(`\n${letter}:`);
    data.pdfArtists.forEach(artist => console.log(`  - ${artist}`));
  }
  
  console.log('\n=== CHECKING FOR MISMATCHES ===\n');
  
  // Check specific artist name mismatches
  const artistMismatches = [
    { wrong: 'Edgar Degas', correct: 'Hilaire Germaine Edgar Degas', letter: 'D' },
    { wrong: 'Jacques-Louis David', correct: 'Jaques-Louis David', letter: 'D' },
    { wrong: 'Melchior De Hondecoeter', correct: "Melchior D'Hondecoeter", letter: 'D' },
    { wrong: 'Canaletto', correct: 'Giovanni Antonio Canal Canaletto', letter: 'C' },
    { wrong: 'Caravaggio', correct: 'Michelangelo Merisi Da Caravaggio', letter: 'C' },
  ];
  
  console.log('Known artist name mismatches to fix:');
  artistMismatches.forEach(({ wrong, correct, letter }) => {
    if (artworksContent.includes(wrong)) {
      console.log(`  ✗ "${wrong}" should be "${correct}" (Letter ${letter})`);
    }
  });
  
  console.log('\n=== SUMMARY ===');
  console.log('Raw PDF text saved to scripts/*_pdf_raw.txt for manual review');
  console.log('Please review the text files to see exact artist names from PDFs');
  
  // Save corrections needed
  const report = {
    message: 'Artist name corrections needed based on PDF files',
    corrections: corrections,
    mismatches: artistMismatches,
    note: 'Artist names in artworks.ts should match exactly with column 2 in the PDF files'
  };
  
  fs.writeFileSync('scripts/validation_report.json', JSON.stringify(report, null, 2));
  console.log('\nValidation report saved to scripts/validation_report.json');
}

validateArtworks().catch(console.error);
