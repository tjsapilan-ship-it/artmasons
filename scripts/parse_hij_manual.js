const fs = require('fs');
const path = require('path');

// Manually parse the raw text files that were already extracted
function parseRawText(rawText, letter) {
  const lines = rawText.split('\n');
  const artworks = [];
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    i++;
    
    // Skip empty lines, the letter header, or standalone numbers
    if (!line || line === letter || line.match(/^\d+$/)) {
      continue;
    }
    
    // Check if this is a life dates line (YYYY-YYYY format)
    if (line.match(/^\d{4}-\d{0,4}$/)) {
      continue; // Skip, we'll get it on the next iteration
    }
    
    // This should be a data line with: Title Artist Year Dim1 Dim2 SKU
    const dataLine = line;
    
    // Get the next non-empty line which should be the artist life dates
    let artistLife = '';
    while (i < lines.length) {
      const nextLine = lines[i].trim();
      if (!nextLine) {
        i++;
        continue;
      }
      if (nextLine.match(/^\d{4}-\d{0,4}$/) || nextLine.match(/^Unknown-\d{4}$/)) {
        artistLife = nextLine;
        i++;
        break;
      }
      // If it's not a life date, break (might be next artwork)
      break;
    }
    
    // Parse the data line
    const artwork = parseDataLine(dataLine, artistLife, letter);
    if (artwork) {
      artworks.push(artwork);
    }
  }
  
  return artworks;
}

function parseDataLine(line, artistLife, letter) {
  // Format: Title Artist Year Dim1 Dim2 SKU
  // Example: "Italian Landscape Jacob Philippe Hackett 1795 64.5 x 96 64.5 x 96 9091"
  
  // Extract SKU (last token, might have comma like "21,423")
  const tokens = line.trim().split(/\s+/);
  if (tokens.length < 2) return null;
  
  const sku = tokens[tokens.length - 1].replace(/,/g, '');
  
  // Remove SKU from line
  let remaining = line.substring(0, line.lastIndexOf(tokens[tokens.length - 1])).trim();
  
  // Extract dimensions - look for patterns like "64.5 x 96" or "Unknown"
  const dimensions = [];
  let dimMatch;
  const dimRegex = /([\d.]+)\s*x\s*([\d.]+)/g;
  
  // Count how many dimension patterns we have
  const dimMatches = [];
  while ((dimMatch = dimRegex.exec(remaining)) !== null) {
    dimMatches.push({
      full: dimMatch[0],
      value: `${dimMatch[1]} x ${dimMatch[2]}`,
      index: dimMatch.index
    });
  }
  
  // Remove dimensions from remaining (remove from end backwards)
  for (let i = dimMatches.length - 1; i >= 0; i--) {
    const dm = dimMatches[i];
    remaining = remaining.substring(0, dm.index) + remaining.substring(dm.index + dm.full.length);
    dimensions.unshift(dm.value);
  }
  
  // Remove "Unknown" keywords
  remaining = remaining.replace(/\bUnknown\b/g, '').trim();
  
  // Extract year (4-digit number)
  const yearMatch = remaining.match(/\b(\d{4})\b/);
  const year = yearMatch ? yearMatch[1] : '';
  
  if (yearMatch) {
    remaining = remaining.substring(0, yearMatch.index) + remaining.substring(yearMatch.index + 4);
  }
  
  remaining = remaining.replace(/\s+/g, ' ').trim();
  
  // Now remaining should be "Title Artist"
  // We need to split this intelligently
  // Strategy: Artist names are typically 2-3 words at the end
  
  const words = remaining.split(/\s+/);
  
  // Find where the artist name likely starts
  // Look for a sequence of capitalized words at the end
  let artistStartIdx = Math.max(0, words.length - 3);
  
  // Adjust based on common patterns
  // If we see "Von", "De", "Van", etc., include them in artist name
  for (let i = words.length - 1; i >= 0; i--) {
    if (['Von', 'Van', 'De', 'La', 'Le'].includes(words[i])) {
      artistStartIdx = Math.min(artistStartIdx, i);
    }
  }
  
  // Ensure we have at least something for the title
  if (artistStartIdx === 0 && words.length > 3) {
    artistStartIdx = words.length - 2;
  }
  
  const titleWords = words.slice(0, artistStartIdx);
  const artistWords = words.slice(artistStartIdx);
  
  let title = titleWords.join(' ').trim();
  let artist = artistWords.join(' ').trim();
  
  // If title is empty, use first part
  if (!title && words.length > 1) {
    title = words.slice(0, -1).join(' ');
    artist = words[words.length - 1];
  }
  
  const artwork = {
    title: title || line,
    year: year,
    artist: artist,
    artistLife: artistLife,
    location: '',
    originalSize: dimensions[0] || '',
    description: '',
    sku: sku,
    basePrice: 0,
    currency: 'GBP',
    image: `${letter.toLowerCase()}/${(title || line).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.jpg`,
    options: [
      { id: 'small', width: 12, height: 16, price: 49, label: 'Small (12" x 16")' },
      { id: 'medium', width: 18, height: 24, price: 79, label: 'Medium (18" x 24")' },
      { id: 'large', width: 24, height: 36, price: 119, label: 'Large (24" x 36")' },
      { id: 'xlarge', width: 32, height: 48, price: 179, label: 'Extra Large (32" x 48")' }
    ]
  };
  
  return artwork;
}

// Read existing artworks.ts and find titles starting with letter
function getExistingTitles(letter) {
  const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
  const content = fs.readFileSync(artworksPath, 'utf-8');
  
  const titleRegex = /title:\s*"([^"]+)"/g;
  const titles = new Set();
  let match;
  
  while ((match = titleRegex.exec(content)) !== null) {
    const title = match[1];
    if (title[0].toUpperCase() === letter.toUpperCase()) {
      titles.add(title.toLowerCase());
    }
  }
  
  return titles;
}

function main() {
  const letters = ['H', 'I', 'J'];
  const allResults = [];
  
  console.log('='.repeat(70));
  console.log('PARSING PDF TEXT AND COMPARING WITH ARTWORKS.TS');
  console.log('='.repeat(70));
  
  for (const letter of letters) {
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`Letter ${letter}`);
    console.log('─'.repeat(70));
    
    const rawTextPath = path.join(__dirname, `${letter.toLowerCase()}_pdf_raw_text.txt`);
    
    if (!fs.existsSync(rawTextPath)) {
      console.log(`Raw text file not found: ${rawTextPath}`);
      continue;
    }
    
    // Parse the raw text
    const rawText = fs.readFileSync(rawTextPath, 'utf-8');
    const artworks = parseRawText(rawText, letter);
    
    console.log(`\nParsed ${artworks.length} artworks from PDF`);
    
    // Show first few
    if (artworks.length > 0) {
      console.log('\nFirst 3 artworks:');
      artworks.slice(0, 3).forEach((art, idx) => {
        console.log(`  ${idx + 1}. "${art.title}"`);
        console.log(`     by ${art.artist} (${art.artistLife}), ${art.year}`);
        console.log(`     Size: ${art.originalSize}, SKU: ${art.sku}`);
      });
    }
    
    // Get existing titles
    const existing = getExistingTitles(letter);
    console.log(`\nExisting ${letter} artworks in artworks.ts: ${existing.size}`);
    
    // Find missing
    const missing = artworks.filter(art => {
      return !existing.has(art.title.toLowerCase());
    });
    
    console.log(`Missing artworks: ${missing.length}`);
    
    if (missing.length > 0) {
      console.log('\nMissing artworks:');
      missing.forEach((art, idx) => {
        console.log(`  ${idx + 1}. "${art.title}" by ${art.artist}`);
      });
    }
    
    // Save results
    const outputPath = path.join(__dirname, `${letter.toLowerCase()}_all_artworks_final.json`);
    fs.writeFileSync(outputPath, JSON.stringify(artworks, null, 2), 'utf-8');
    
    const missingPath = path.join(__dirname, `${letter.toLowerCase()}_missing_final.json`);
    fs.writeFileSync(missingPath, JSON.stringify(missing, null, 2), 'utf-8');
    
    allResults.push({
      letter,
      total: artworks.length,
      existing: existing.size,
      missing: missing.length,
      missingArtworks: missing,
      allArtworks: artworks
    });
  }
  
  console.log(`\n${'='.repeat(70)}`);
  console.log('SUMMARY');
  console.log('='.repeat(70));
  
  let totalInPDF = 0;
  let totalExisting = 0;
  let totalMissing = 0;
  
  allResults.forEach(result => {
    console.log(`\n${result.letter}:`);
    console.log(`  Total in PDF:           ${result.total}`);
    console.log(`  Already in artworks.ts: ${result.existing}`);
    console.log(`  Missing:                ${result.missing}`);
    
    totalInPDF += result.total;
    totalExisting += result.existing;
    totalMissing += result.missing;
  });
  
  console.log(`\nTOTAL:`);
  console.log(`  Artworks in PDFs:       ${totalInPDF}`);
  console.log(`  Already in artworks.ts: ${totalExisting}`);
  console.log(`  Need to add:            ${totalMissing}`);
  
  // Save combined missing artworks
  const allMissing = {};
  allResults.forEach(result => {
    if (result.missingArtworks.length > 0) {
      allMissing[result.letter] = result.missingArtworks;
    }
  });
  
  const combinedMissingPath = path.join(__dirname, 'hij_all_missing_artworks.json');
  fs.writeFileSync(combinedMissingPath, JSON.stringify(allMissing, null, 2), 'utf-8');
  console.log(`\nAll missing artworks saved to: ${combinedMissingPath}`);
  
  // Save all artworks
  const allArtworks = {};
  allResults.forEach(result => {
    allArtworks[result.letter] = result.allArtworks;
  });
  
  const combinedAllPath = path.join(__dirname, 'hij_all_artworks_combined.json');
  fs.writeFileSync(combinedAllPath, JSON.stringify(allArtworks, null, 2), 'utf-8');
  console.log(`All artworks saved to: ${combinedAllPath}`);
}

main();
