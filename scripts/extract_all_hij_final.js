const fs = require('fs');
const path = require('path');

// Manually parse PDF text to extract all artworks
function parseManually(letter) {
  const rawPath = path.join(__dirname, `${letter.toLowerCase()}_pdf_raw_text.txt`);
  if (!fs.existsSync(rawPath)) {
    console.error(`File not found: ${rawPath}`);
    return [];
  }
  
  const text = fs.readFileSync(rawPath, 'utf-8');
  const lines = text.split('\n').map(l => l.trim());
  
  const artworks = [];
  let currentData = [];
  let artistLife = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip empty lines or the letter header
    if (!line || line === letter) continue;
    
    // Check if this is an artist life line
    if (line.match(/^\d{4}\s*-\s*\d{0,4}$/) || line.match(/^Unknown-\d{4}$/)) {
      // Process the accumulated data
      if (currentData.length > 0) {
        const artwork = parseArtworkData(currentData.join(' '), line, letter);
        if (artwork) artworks.push(artwork);
      }
      currentData = [];
      continue;
    }
    
    // Accumulate data lines
    currentData.push(line);
  }
  
  // Process last artwork if any
  if (currentData.length > 0) {
    const artwork = parseArtworkData(currentData.join(' '), '', letter);
    if (artwork) artworks.push(artwork);
  }
  
  return artworks;
}

function parseArtworkData(dataStr, artistLife, letter) {
  // Clean up the data
  dataStr = dataStr.replace(/\s+/g, ' ').trim();
  
  if (!dataStr) return null;
  
  // Extract SKU (last number sequence, may have comma)
  const skuMatch = dataStr.match(/([\d,]+)\s*$/);
  const sku = skuMatch ? skuMatch[1].replace(/,/g, '') : '';
  
  let remaining = skuMatch ? dataStr.substring(0, dataStr.lastIndexOf(skuMatch[1])).trim() : dataStr;
  
  // Extract dimensions
  const dimensions = [];
  let tempRemaining = remaining;
  const dimRegex = /([\d.]+)\s*x\s*([\d.]+)/g;
  let dimMatch;
  
  while ((dimMatch = dimRegex.exec(tempRemaining)) !== null) {
    dimensions.push(`${dimMatch[1]} x ${dimMatch[2]}`);
  }
  
  // Remove all dimensions from remaining
  remaining = remaining.replace(/[\d.]+\s*x\s*[\d.]+/g, '').replace(/\bUnknown\b/g, '').trim();
  
  // Extract year
  const yearMatch = remaining.match(/\b(\d{4})\b/);
  const year = yearMatch ? yearMatch[1] : '';
  
  if (yearMatch) {
    remaining = remaining.replace(yearMatch[0], '').trim();
  }
  
  remaining = remaining.replace(/\s+/g, ' ').trim();
  
  // Split into title and artist
  // Strategy: Look for common artist patterns
  const words = remaining.split(/\s+/);
  
  let artistStartIdx = -1;
  
  // Look for known artist name patterns or last 2-3 capitalized words
  for (let i = words.length - 1; i >= Math.max(0, words.length - 4); i--) {
    if (i > 0 && words[i] && words[i][0] === words[i][0].toUpperCase()) {
      artistStartIdx = i;
    } else {
      break;
    }
  }
  
  // If we couldn't find a good split, use last 2 words as artist
  if (artistStartIdx < 0 || artistStartIdx === words.length - 1) {
    artistStartIdx = Math.max(0, words.length - 2);
  }
  
  const title = words.slice(0, artistStartIdx).join(' ').trim();
  const artist = words.slice(artistStartIdx).join(' ').trim();
  
  return {
    title: title || remaining,
    year: year,
    artist: artist,
    artistLife: artistLife,
    location: '',
    originalSize: dimensions.length > 1 ? dimensions[1] : (dimensions[0] || ''),
    description: '',
    sku: sku,
    basePrice: parseInt(sku) || 0,
    currency: 'GBP',
    image: `${letter.toLowerCase()}/${(title || remaining).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.jpg`,
    options: [
      { id: 'small', width: 12, height: 16, price: 49, label: 'Small (12" x 16")' },
      { id: 'medium', width: 18, height: 24, price: 79, label: 'Medium (18" x 24")' },
      { id: 'large', width: 24, height: 36, price: 119, label: 'Large (24" x 36")' },
      { id: 'xlarge', width: 32, height: 48, price: 179, label: 'Extra Large (32" x 48")' }
    ]
  };
}

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

function artworkToTS(artwork) {
  const parts = [];
  parts.push(`  {`);
  parts.push(`    title: "${artwork.title}",`);
  if (artwork.year) parts.push(`    year: "${artwork.year}",`);
  if (artwork.artist) parts.push(`    artist: "${artwork.artist}",`);
  if (artwork.artistLife) parts.push(`    artistLife: "${artwork.artistLife}",`);
  if (artwork.location) parts.push(`    location: "${artwork.location}",`);
  if (artwork.originalSize) parts.push(`    originalSize: "${artwork.originalSize}",`);
  if (artwork.description) parts.push(`    description: "${artwork.description}",`);
  if (artwork.sku) parts.push(`    sku: "${artwork.sku}",`);
  if (artwork.basePrice) parts.push(`    basePrice: ${artwork.basePrice},`);
  if (artwork.currency) parts.push(`    currency: "${artwork.currency}",`);
  parts.push(`    image: "${artwork.image}",`);
  
  parts.push(`    options: [`);
  artwork.options.forEach((opt, idx) => {
    const comma = idx < artwork.options.length - 1 ? ',' : '';
    parts.push(`      { id: '${opt.id}', width: ${opt.width}, height: ${opt.height}, price: ${opt.price}, label: '${opt.label}' }${comma}`);
  });
  parts.push(`    ],`);
  
  parts.push(`  },`);
  
  return parts.join('\n');
}

function main() {
  const letters = ['H', 'I', 'J'];
  const existingTitles = getExistingTitles();
  const allMissing = [];
  
  console.log('='.repeat(70));
  console.log('EXTRACTING ALL ARTWORKS FROM PDFs');
  console.log('='.repeat(70));
  
  for (const letter of letters) {
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`Letter ${letter}`);
    console.log('─'.repeat(70));
    
    const artworks = parseManually(letter);
    console.log(`Total artworks extracted: ${artworks.length}`);
    
    // Find missing
    const missing = artworks.filter(art => !existingTitles.has(art.title.toLowerCase()));
    
    console.log(`Already in artworks.ts: ${artworks.length - missing.length}`);
    console.log(`Missing from artworks.ts: ${missing.length}`);
    
    if (missing.length > 0) {
      console.log('\nMissing artworks:');
      missing.forEach((art, idx) => {
        console.log(`  ${idx + 1}. "${art.title}" by ${art.artist} (${art.year})`);
      });
      
      allMissing.push(...missing);
    }
    
    // Save all extracted artworks
    const allPath = path.join(__dirname, `${letter.toLowerCase()}_all_extracted.json`);
    fs.writeFileSync(allPath, JSON.stringify(artworks, null, 2), 'utf-8');
    console.log(`\nAll extracted artworks saved to: ${allPath}`);
  }
  
  console.log(`\n${'='.repeat(70)}`);
  console.log('SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total missing artworks: ${allMissing.length}`);
  
  if (allMissing.length > 0) {
    console.log('\nGenerating TypeScript code...');
    
    const tsCode = allMissing.map(art => artworkToTS(art)).join('\n\n');
    const outputPath = path.join(__dirname, 'missing_artworks_to_add.ts');
    fs.writeFileSync(outputPath, `// Missing artworks to add to artworks.ts\n\n${tsCode}`, 'utf-8');
    console.log(`Code saved to: ${outputPath}`);
    
    const jsonPath = path.join(__dirname, 'missing_artworks_to_add.json');
    fs.writeFileSync(jsonPath, JSON.stringify(allMissing, null, 2), 'utf-8');
    console.log(`JSON saved to: ${jsonPath}`);
  }
}

main();
