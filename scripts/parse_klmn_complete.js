const fs = require('fs');
const path = require('path');

// Parse the PDF text into artwork objects
function parseArtworksFromText(text, letter) {
  const artworks = [];
  const lines = text.split('\n').map(l => l.trim());
  
  // Combine multi-line entries into single blocks
  // Each artwork block ends with a life dates line (YYYY-YYYY or YYYY-)
  let currentBlock = [];
  let blocks = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip empty lines and the letter header
    if (!line || line === letter) continue;
    
    // Check if this is a life dates line
    if (line.match(/^\d{4}\s*-\s*\d{0,4}\s*$/) || line.match(/^\d{4}-\d{4}$/)) {
      // This ends a block
      if (currentBlock.length > 0) {
        blocks.push({ data: currentBlock.join(' '), artistLife: line.replace(/\s+/g, '') });
      }
      currentBlock = [];
    } else {
      currentBlock.push(line);
    }
  }
  
  // Process any remaining block
  if (currentBlock.length > 0) {
    blocks.push({ data: currentBlock.join(' '), artistLife: '' });
  }
  
  // Parse each block
  for (const block of blocks) {
    const artwork = parseBlock(block.data, block.artistLife, letter);
    if (artwork && artwork.title) {
      artworks.push(artwork);
    }
  }
  
  return artworks;
}

function parseBlock(dataStr, artistLife, letter) {
  // Clean up
  dataStr = dataStr.replace(/\s+/g, ' ').trim();
  if (!dataStr) return null;
  
  // Pattern: Title Artist Year Dim1 Dim2 SKU
  // Example: "Still Life With Drinking Horn Willem Kalf 1653 86.4 x 102.2 86.4 x 102.2 10105"
  
  // Extract SKU (last number, possibly with comma or spaces)
  let sku = '';
  const skuMatch = dataStr.match(/([\d,]+)\s*$/);
  if (skuMatch) {
    sku = skuMatch[1].replace(/,/g, '');
    dataStr = dataStr.substring(0, dataStr.lastIndexOf(skuMatch[1])).trim();
  }
  
  // Extract all dimension patterns
  const dimensions = [];
  const dimRegex = /([\d.]+)\s*[xX]\s*([\d.]+)/g;
  let dimMatch;
  while ((dimMatch = dimRegex.exec(dataStr)) !== null) {
    dimensions.push(`${dimMatch[1]} x ${dimMatch[2]}`);
  }
  
  // Remove dimensions and "Unknown" from dataStr
  let remaining = dataStr.replace(/[\d.]+\s*[xX]\s*[\d.]+/g, '').replace(/\bUnknown\b/gi, '').trim();
  
  // Extract year (4-digit number)
  const yearMatch = remaining.match(/\b(\d{4})\b/);
  const year = yearMatch ? yearMatch[1] : '';
  if (yearMatch) {
    remaining = remaining.replace(yearMatch[0], '').trim();
  }
  
  remaining = remaining.replace(/\s+/g, ' ').trim();
  
  // Now remaining should be "Title Artist" - need to split them
  // Use heuristics: look for common artist name patterns
  const words = remaining.split(' ');
  
  // Find where artist name likely starts
  // Look for patterns like "Sir", "Von", "De", or consecutive capitalized words at end
  let artistStart = words.length;
  
  // Common artist prefixes
  const prefixes = ['Sir', 'Von', 'De', 'Van', 'Le', 'La', 'Du', 'Den', 'Der'];
  
  // Find last sequence of capitalized words as artist
  for (let i = words.length - 1; i >= 0; i--) {
    if (words[i] && words[i][0] === words[i][0].toUpperCase() && words[i].length > 1) {
      artistStart = i;
      // Continue if we find artist prefix
      if (i > 0 && prefixes.includes(words[i-1])) {
        artistStart = i - 1;
      }
    } else {
      break;
    }
  }
  
  // Ensure we have at least 2-3 words for artist
  if (words.length - artistStart < 2) {
    artistStart = Math.max(0, words.length - 2);
  }
  
  // Ensure we have a title
  if (artistStart === 0 && words.length > 2) {
    artistStart = Math.max(1, words.length - 3);
  }
  
  const title = words.slice(0, artistStart).join(' ').trim();
  const artist = words.slice(artistStart).join(' ').trim();
  
  const artwork = {
    title: title || remaining,
    year: year,
    artist: artist,
    artistLife: artistLife,
    location: '',
    originalSize: dimensions.length > 1 ? dimensions[1] : (dimensions[0] || ''),
    description: '',
    sku: sku,
    basePrice: parseInt(sku) || 0,
    currency: 'AED',
    image: `/${letter.toLowerCase()}/${title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ')}.jpg`,
    options: [
      { id: 'opt1', width: 0, height: 0, price: parseInt(sku) || 0, label: 'Original Size' }
    ]
  };
  
  return artwork;
}

// Get existing titles from artworks.ts
function getExistingTitles() {
  const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
  const content = fs.readFileSync(artworksPath, 'utf-8');
  
  const titleRegex = /title:\s*"([^"]+)"/g;
  const titles = new Set();
  let match;
  
  while ((match = titleRegex.exec(content)) !== null) {
    titles.add(match[1].toLowerCase());
  }
  
  return titles;
}

function main() {
  const letters = ['K', 'L', 'M', 'N'];
  const existingTitles = getExistingTitles();
  const allArtworks = {};
  const allMissing = [];
  
  console.log('='.repeat(70));
  console.log('PARSING KLMN PDF TEXT FILES');
  console.log('='.repeat(70));
  console.log(`Existing artworks in artworks.ts: ${existingTitles.size}`);
  
  for (const letter of letters) {
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`Letter ${letter}`);
    console.log('─'.repeat(70));
    
    const rawPath = path.join(__dirname, `${letter.toLowerCase()}_pdf_raw_text.txt`);
    if (!fs.existsSync(rawPath)) {
      console.log(`File not found: ${rawPath}`);
      continue;
    }
    
    const text = fs.readFileSync(rawPath, 'utf-8');
    const artworks = parseArtworksFromText(text, letter);
    
    console.log(`Extracted: ${artworks.length} artworks`);
    
    // Show all artworks
    console.log('\nAll artworks from PDF:');
    artworks.forEach((art, idx) => {
      const exists = existingTitles.has(art.title.toLowerCase());
      const status = exists ? '✓' : '✗';
      console.log(`  ${status} ${idx + 1}. "${art.title}" by ${art.artist} (${art.year})`);
    });
    
    // Find missing
    const missing = artworks.filter(art => !existingTitles.has(art.title.toLowerCase()));
    console.log(`\nMissing from artworks.ts: ${missing.length}`);
    
    allArtworks[letter] = artworks;
    allMissing.push(...missing.map(m => ({ ...m, letter })));
    
    // Save extracted artworks
    const outputPath = path.join(__dirname, `${letter.toLowerCase()}_extracted_artworks.json`);
    fs.writeFileSync(outputPath, JSON.stringify(artworks, null, 2), 'utf-8');
  }
  
  console.log(`\n${'='.repeat(70)}`);
  console.log('SUMMARY');
  console.log('='.repeat(70));
  
  let totalPDF = 0;
  let totalMissing = 0;
  for (const [letter, artworks] of Object.entries(allArtworks)) {
    const missing = artworks.filter(art => !existingTitles.has(art.title.toLowerCase()));
    console.log(`${letter}: ${artworks.length} in PDF, ${missing.length} missing`);
    totalPDF += artworks.length;
    totalMissing += missing.length;
  }
  
  console.log(`\nTotal in PDFs: ${totalPDF}`);
  console.log(`Total missing: ${totalMissing}`);
  
  // Save all missing
  const missingPath = path.join(__dirname, 'klmn_missing_artworks.json');
  fs.writeFileSync(missingPath, JSON.stringify(allMissing, null, 2), 'utf-8');
  console.log(`\nMissing artworks saved to: ${missingPath}`);
}

main();
