const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

// Parse a single PDF file
async function parsePDF(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdf(dataBuffer);
  return data.text;
}

// Extract artwork data from text
function extractArtworks(text, letter) {
  const artworks = [];
  
  // Split by artwork entries - each artwork typically starts with a title in uppercase
  // Look for patterns like "ARTWORK TITLE" followed by details
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let currentArtwork = null;
  let collectingDescription = false;
  let description = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip header/footer lines
    if (line.includes('Page') || line.match(/^\d+$/)) continue;
    
    // Check if this is a title line (usually bold/uppercase in PDF, here we detect pattern)
    // Titles typically don't have colons and are longer descriptive names
    if (line.length > 3 && !line.includes(':') && !line.match(/^\d+/) && 
        !line.toLowerCase().startsWith('artist') &&
        !line.toLowerCase().startsWith('year') &&
        !line.toLowerCase().startsWith('original size') &&
        !line.toLowerCase().startsWith('location') &&
        !line.toLowerCase().startsWith('description')) {
      
      // Save previous artwork if exists
      if (currentArtwork && currentArtwork.title) {
        if (description.length > 0) {
          currentArtwork.description = description.join(' ').trim();
        }
        artworks.push(currentArtwork);
        description = [];
      }
      
      // Start new artwork
      currentArtwork = {
        title: line,
        artist: '',
        year: '',
        location: '',
        originalSize: '',
        description: '',
        image: `${letter.toLowerCase()}/${line.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.jpg`
      };
      collectingDescription = false;
    }
    // Check for metadata fields
    else if (currentArtwork) {
      if (line.startsWith('Artist:')) {
        const artistMatch = line.match(/Artist:\s*(.+?)(?:\s*\(([^)]+)\))?$/);
        if (artistMatch) {
          currentArtwork.artist = artistMatch[1].trim();
          if (artistMatch[2]) {
            currentArtwork.artistLife = artistMatch[2].trim();
          }
        }
      }
      else if (line.startsWith('Year:')) {
        currentArtwork.year = line.replace('Year:', '').trim();
      }
      else if (line.startsWith('Original Size:')) {
        currentArtwork.originalSize = line.replace('Original Size:', '').trim();
      }
      else if (line.startsWith('Location:')) {
        currentArtwork.location = line.replace('Location:', '').trim();
      }
      else if (line.startsWith('Description:')) {
        collectingDescription = true;
        const desc = line.replace('Description:', '').trim();
        if (desc) description.push(desc);
      }
      else if (collectingDescription) {
        // Continue collecting description lines
        if (line.length > 0 && !line.includes(':')) {
          description.push(line);
        } else {
          collectingDescription = false;
        }
      }
    }
  }
  
  // Save last artwork
  if (currentArtwork && currentArtwork.title) {
    if (description.length > 0) {
      currentArtwork.description = description.join(' ').trim();
    }
    artworks.push(currentArtwork);
  }
  
  return artworks;
}

// Main function
async function main() {
  const letters = ['H', 'I', 'J'];
  const allArtworks = {};
  
  for (const letter of letters) {
    console.log(`\n=== Processing ART_DETAILS_${letter}.pdf ===`);
    const pdfPath = path.join(__dirname, '..', 'data', `ART_DETAILS_${letter}.pdf`);
    
    if (!fs.existsSync(pdfPath)) {
      console.log(`PDF not found: ${pdfPath}`);
      continue;
    }
    
    try {
      const text = await parsePDF(pdfPath);
      
      // Save raw text for inspection
      const rawTextPath = path.join(__dirname, `${letter.toLowerCase()}_pdf_raw_text.txt`);
      fs.writeFileSync(rawTextPath, text, 'utf-8');
      console.log(`Raw text saved to: ${rawTextPath}`);
      
      // Extract artworks
      const artworks = extractArtworks(text, letter);
      allArtworks[letter] = artworks;
      
      console.log(`Found ${artworks.length} artworks for letter ${letter}`);
      
      // Save parsed artworks
      const outputPath = path.join(__dirname, `${letter.toLowerCase()}_parsed_artworks.json`);
      fs.writeFileSync(outputPath, JSON.stringify(artworks, null, 2), 'utf-8');
      console.log(`Parsed artworks saved to: ${outputPath}`);
      
    } catch (error) {
      console.error(`Error processing ${letter}:`, error.message);
    }
  }
  
  // Create summary
  console.log('\n=== Summary ===');
  for (const [letter, artworks] of Object.entries(allArtworks)) {
    console.log(`${letter}: ${artworks.length} artworks`);
    if (artworks.length > 0) {
      console.log(`  First: ${artworks[0].title}`);
      console.log(`  Last: ${artworks[artworks.length - 1].title}`);
    }
  }
  
  // Save combined output
  const combinedPath = path.join(__dirname, 'hij_all_artworks.json');
  fs.writeFileSync(combinedPath, JSON.stringify(allArtworks, null, 2), 'utf-8');
  console.log(`\nCombined artworks saved to: ${combinedPath}`);
}

main().catch(console.error);
