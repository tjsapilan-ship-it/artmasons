const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

// Parse a single PDF file
async function parsePDF(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdf(dataBuffer);
  return data.text;
}

// Extract artwork data from text (improved version)
function extractArtworks(text, letter) {
  const artworks = [];
  
  // Split by lines and clean
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Remove the first line if it's just the letter
  if (lines[0] === letter) {
    lines.shift();
  }
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    
    // Skip empty lines, page numbers, or single letter lines
    if (!line || line.match(/^\d+$/) || line === letter) {
      i++;
      continue;
    }
    
    // Check if this looks like a title line (doesn't contain years or dimensions pattern)
    // Title shouldn't have numbers at the start or be just years like "1780-1867"
    if (line.match(/^\d{4}-?\d{0,4}$/)) {
      i++;
      continue;
    }
    
    // This should be a title
    const title = line;
    
    // Next line should have: Artist Year Dimensions1 Dimensions2 SKU
    i++;
    if (i >= lines.length) break;
    
    let detailsLine = lines[i];
    
    // Check if the next line is the artist life dates (e.g., "1780-1867")
    // If so, skip it and combine the previous details
    i++;
    if (i < lines.length && lines[i].match(/^\d{4}\s*-\s*\d{4}$/)) {
      i++; // skip the life dates line
    }
    
    // Parse the details line
    // Format: Artist Name  Year  Dimensions1  Dimensions2  SKU
    // Example: "Jean-August Dominique Ingres 1845 131.7 x 92 131.7 x 92 14992"
    
    const artwork = {
      title: title.trim(),
      artist: '',
      artistLife: '',
      year: '',
      location: '',
      originalSize: '',
      description: '',
      sku: '',
      basePrice: 0,
      currency: 'GBP',
      image: `${letter.toLowerCase()}/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.jpg`,
      options: [
        { id: 'small', width: 12, height: 16, price: 49, label: 'Small (12" x 16")' },
        { id: 'medium', width: 18, height: 24, price: 79, label: 'Medium (18" x 24")' },
        { id: 'large', width: 24, height: 36, price: 119, label: 'Large (24" x 36")' },
        { id: 'xlarge', width: 32, height: 48, price: 179, label: 'Extra Large (32" x 48")' }
      ]
    };
    
    // Parse details - this is tricky because artist names can have multiple words
    // Pattern: Artist (words) Year (4 digits) Size1 (num x num) Size2 (num x num) SKU (num or num,num)
    
    // Try to extract year (4 digits)
    const yearMatch = detailsLine.match(/\b(\d{4})\b/);
    if (yearMatch) {
      artwork.year = yearMatch[1];
    }
    
    // Extract SKU (last number, possibly with comma)
    const skuMatch = detailsLine.match(/\b([\d,]+)\s*$/);
    if (skuMatch) {
      artwork.sku = skuMatch[1];
      // Remove SKU from details line for easier parsing
      detailsLine = detailsLine.substring(0, detailsLine.lastIndexOf(skuMatch[1])).trim();
    }
    
    // Extract dimensions (two patterns of "num x num")
    const dimensionPattern = /([\d.]+)\s*x\s*([\d.]+)/g;
    const dimensions = [];
    let dimMatch;
    while ((dimMatch = dimensionPattern.exec(detailsLine)) !== null) {
      dimensions.push(`${dimMatch[1]} x ${dimMatch[2]}`);
    }
    
    if (dimensions.length > 0) {
      artwork.originalSize = dimensions[0];
      // Remove dimensions from details line
      detailsLine = detailsLine.replace(/[\d.]+\s*x\s*[\d.]+/g, '').trim();
    }
    
    // Remove year from details line
    if (yearMatch) {
      detailsLine = detailsLine.replace(yearMatch[0], '').trim();
    }
    
    // What's left should be the artist name (after removing Unknown words)
    detailsLine = detailsLine.replace(/\bUnknown\b/g, '').trim();
    detailsLine = detailsLine.replace(/\s+/g, ' ').trim();
    
    if (detailsLine) {
      artwork.artist = detailsLine;
    }
    
    artworks.push(artwork);
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
      
      // Extract artworks
      const artworks = extractArtworks(text, letter);
      allArtworks[letter] = artworks;
      
      console.log(`Found ${artworks.length} artworks for letter ${letter}`);
      
      // Save parsed artworks
      const outputPath = path.join(__dirname, `${letter.toLowerCase()}_parsed_artworks_v2.json`);
      fs.writeFileSync(outputPath, JSON.stringify(artworks, null, 2), 'utf-8');
      console.log(`Parsed artworks saved to: ${outputPath}`);
      
      // Show first few
      if (artworks.length > 0) {
        console.log('\nFirst 3 artworks:');
        artworks.slice(0, 3).forEach((art, idx) => {
          console.log(`  ${idx + 1}. ${art.title}`);
          console.log(`     Artist: ${art.artist}, Year: ${art.year}, SKU: ${art.sku}`);
        });
      }
      
    } catch (error) {
      console.error(`Error processing ${letter}:`, error.message);
    }
  }
  
  // Create summary
  console.log('\n=== Summary ===');
  for (const [letter, artworks] of Object.entries(allArtworks)) {
    console.log(`${letter}: ${artworks.length} artworks`);
  }
  
  // Save combined output
  const combinedPath = path.join(__dirname, 'hij_all_artworks_v2.json');
  fs.writeFileSync(combinedPath, JSON.stringify(allArtworks, null, 2), 'utf-8');
  console.log(`\nCombined artworks saved to: ${combinedPath}`);
}

main().catch(console.error);
