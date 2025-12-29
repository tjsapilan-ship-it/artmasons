const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

// Parse a single PDF file
async function parsePDF(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdf(dataBuffer);
  return data.text;
}

// Extract artwork data from text (pattern-based version)
function extractArtworks(rawText, letter) {
  const artworks = [];
  
  // Clean and split into lines
  const allLines = rawText.split('\n').map(line => line.trim());
  
  // Find blocks of artwork data
  // Pattern: After each life-dates line (YYYY-YYYY or YYYY-), the next non-empty line is a new artwork
  let i = 0;
  let currentBlock = [];
  
  for (let line of allLines) {
    if (!line || line === letter) continue;
    
    // Check if this is a life-dates line (YYYY-YYYY or YYYY-)
    if (line.match(/^\d{4}-\d{0,4}$/)) {
      // Process the currentBlock if it has data
      if (currentBlock.length > 0) {
        const artwork = parseArtworkBlock(currentBlock, letter, line);
        if (artwork) artworks.push(artwork);
      }
      currentBlock = [];
    } else {
      currentBlock.push(line);
    }
  }
  
  // Process last block
  if (currentBlock.length > 0) {
    const artwork = parseArtworkBlock(currentBlock, letter, '');
    if (artwork) artworks.push(artwork);
  }
  
  return artworks;
}

function parseArtworkBlock(lines, letter, lifeDates) {
  if (lines.length === 0) return null;
  
  // Combine all lines into one string
  const fullText = lines.join(' ').replace(/\s+/g, ' ').trim();
  
  if (!fullText) return null;
  
  // Pattern to match: Title Artist Year Dimensions1 Dimensions2 SKU
  // Extract SKU (last number, possibly with comma)
  const skuMatch = fullText.match(/([\d,]+)\s*$/);
  const sku = skuMatch ? skuMatch[1] : '';
  
  let remaining = skuMatch ? fullText.substring(0, fullText.lastIndexOf(skuMatch[1])).trim() : fullText;
  
  // Extract dimensions (patterns like "64.5 x 96" or "Unknown")
  const dimensionMatches = [];
  const dimRegex = /([\d.]+)\s*x\s*([\d.]+)/g;
  let match;
  while ((match = dimRegex.exec(remaining)) !== null) {
    dimensionMatches.push(`${match[1]} x ${match[2]}`);
  }
  
  // Remove dimensions from remaining
  remaining = remaining.replace(/[\d.]+\s*x\s*[\d.]+/g, '').replace(/\bUnknown\b/g, '').trim();
  
  // Extract year (4-digit number)
  const yearMatch = remaining.match(/\b(\d{4})\b/);
  const year = yearMatch ? yearMatch[1] : '';
  
  if (yearMatch) {
    remaining = remaining.replace(yearMatch[0], '').trim();
  }
  
  // What's left: "Title Artist"
  // Artist names are usually proper names (capitalized words)
  // We need to split title from artist
  
  // Strategy: Find the last sequence of capitalized words (likely the artist name)
  // Common artist name patterns: "FirstName LastName" or "FirstName Middle LastName"
  
  const words = remaining.split(/\s+/);
  let titleWords = [];
  let artistWords = [];
  
  // Try to find where title ends and artist begins
  // Look for patterns like "Von", "De", etc. or multiple capitalized words at the end
  let artistStartIdx = words.length;
  
  // Find last 2-4 capitalized words as potential artist name
  for (let i = words.length - 1; i >= 0; i--) {
    const word = words[i];
    if (word && word.length > 0 && word[0] === word[0].toUpperCase()) {
      artistStartIdx = i;
      // If we have 2-3 words for artist, that's probably enough
      if (words.length - artistStartIdx >= 2 && words.length - artistStartIdx <= 4) {
        break;
      }
    } else {
      break;
    }
  }
  
  // If we didn't find a good split, try a different approach
  if (artistStartIdx >= words.length - 1) {
    // Assume last 2 words are artist if available
    artistStartIdx = Math.max(0, words.length - 2);
  }
  
  titleWords = words.slice(0, artistStartIdx);
  artistWords = words.slice(artistStartIdx);
  
  const title = titleWords.join(' ').trim();
  const artist = artistWords.join(' ').trim();
  
  const artwork = {
    title: title || fullText,
    year: year,
    artist: artist,
    artistLife: lifeDates,
    location: '',
    originalSize: dimensionMatches[0] || '',
    description: '',
    sku: sku,
    basePrice: 0,
    currency: 'GBP',
    image: `${letter.toLowerCase()}/${(title || fullText).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.jpg`,
    options: [
      { id: 'small', width: 12, height: 16, price: 49, label: 'Small (12" x 16")' },
      { id: 'medium', width: 18, height: 24, price: 79, label: 'Medium (18" x 24")' },
      { id: 'large', width: 24, height: 36, price: 119, label: 'Large (24" x 36")' },
      { id: 'xlarge', width: 32, height: 48, price: 179, label: 'Extra Large (32" x 48")' }
    ]
  };
  
  return artwork;
}

// Compare with existing artworks.ts
function compareWithExisting(newArtworks, letter) {
  const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
  const content = fs.readFileSync(artworksPath, 'utf-8');
  
  // Extract existing titles that start with the letter
  const titleRegex = /title:\s*"([^"]+)"/g;
  const existingTitles = new Set();
  let match;
  
  while ((match = titleRegex.exec(content)) !== null) {
    const title = match[1];
    if (title[0].toUpperCase() === letter.toUpperCase()) {
      existingTitles.add(title.toLowerCase());
    }
  }
  
  // Find missing artworks
  const missing = newArtworks.filter(art => {
    const normalized = art.title.toLowerCase();
    return !existingTitles.has(normalized);
  });
  
  return { existing: existingTitles.size, missing: missing.length, missingArtworks: missing };
}

// Main function
async function main() {
  const letters = ['H', 'I', 'J'];
  const allResults = {};
  
  for (const letter of letters) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing ART_DETAILS_${letter}.pdf`);
    console.log('='.repeat(60));
    
    const pdfPath = path.join(__dirname, '..', 'data', `ART_DETAILS_${letter}.pdf`);
    
    if (!fs.existsSync(pdfPath)) {
      console.log(`PDF not found: ${pdfPath}`);
      continue;
    }
    
    try {
      const text = await parsePDF(pdfPath);
      const artworks = extractArtworks(text, letter);
      
      console.log(`\nExtracted ${artworks.length} artworks from PDF`);
      
      // Save parsed artworks
      const outputPath = path.join(__dirname, `${letter.toLowerCase()}_parsed_final.json`);
      fs.writeFileSync(outputPath, JSON.stringify(artworks, null, 2), 'utf-8');
      console.log(`Saved to: ${outputPath}`);
      
      // Show first few examples
      if (artworks.length > 0) {
        console.log('\nFirst 5 artworks:');
        artworks.slice(0, 5).forEach((art, idx) => {
          console.log(`  ${idx + 1}. "${art.title}"`);
          console.log(`     Artist: ${art.artist} (${art.artistLife})`);
          console.log(`     Year: ${art.year}, Size: ${art.originalSize}, SKU: ${art.sku}`);
        });
      }
      
      // Compare with existing
      const comparison = compareWithExisting(artworks, letter);
      console.log(`\nComparison with artworks.ts:`);
      console.log(`  Existing ${letter} artworks in file: ${comparison.existing}`);
      console.log(`  Missing artworks: ${comparison.missing}`);
      
      allResults[letter] = {
        total: artworks.length,
        existing: comparison.existing,
        missing: comparison.missing,
        missingArtworks: comparison.missingArtworks,
        allArtworks: artworks
      };
      
    } catch (error) {
      console.error(`Error processing ${letter}:`, error.message);
    }
  }
  
  // Save comprehensive report
  console.log(`\n${'='.repeat(60)}`);
  console.log('FINAL SUMMARY');
  console.log('='.repeat(60));
  
  let totalMissing = 0;
  for (const [letter, result] of Object.entries(allResults)) {
    console.log(`\n${letter}:`);
    console.log(`  Total in PDF: ${result.total}`);
    console.log(`  Already in artworks.ts: ${result.existing}`);
    console.log(`  Missing: ${result.missing}`);
    totalMissing += result.missing;
  }
  
  console.log(`\nTotal missing artworks across all letters: ${totalMissing}`);
  
  // Save all missing artworks to a file
  const allMissing = {};
  for (const [letter, result] of Object.entries(allResults)) {
    if (result.missingArtworks.length > 0) {
      allMissing[letter] = result.missingArtworks;
    }
  }
  
  const missingPath = path.join(__dirname, 'hij_missing_artworks.json');
  fs.writeFileSync(missingPath, JSON.stringify(allMissing, null, 2), 'utf-8');
  console.log(`\nAll missing artworks saved to: ${missingPath}`);
  
  // Save complete results
  const resultsPath = path.join(__dirname, 'hij_complete_results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(allResults, null, 2), 'utf-8');
  console.log(`Complete results saved to: ${resultsPath}`);
}

main().catch(console.error);
