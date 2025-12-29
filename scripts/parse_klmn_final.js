const fs = require('fs');
const path = require('path');

// Known artists to help with parsing
const KNOWN_ARTISTS = [
  // K
  'Frederick Hendrik Kraemmerer',
  'Willem Kalf',
  'Wassily Kadinsky',
  'Isidor Kauffman',
  'Nikolay Kermov',
  'Theodore Severin Kittlesen',
  'Paul Klee',
  'Gustav Klimt',
  'Godfrey Kneller',
  'Barbara Kraftt',
  'Peter Severin Kroyer',
  // L
  'Sir Edwin Henry Landseer',
  'Sir John Lavery',
  'Henri Lebasque',
  'Jules Joseph Lefebvre',
  'Lord Frederick Leighton',
  'John Frederick Lewis',
  // M
  'Rene Magritte',
  'Cornelis de Man',
  'Edouard Manet',
  'Jan Matejko',
  'Henri Matisse',
  'Piet Mondrian',
  'Claude Monet',
  'Peder Monsted',
  'James Wilson Morrice',
  'William Sydney Mount',
  // N
  'Friedich Von Nerly',
];

function parseRawText(text, letter) {
  const artworks = [];
  const lines = text.split('\n');
  
  // Find all lines that are life dates (pattern: YYYY-YYYY or b.YYYY on single line, or YYYY followed by line with YYYY)
  const lifePatterns = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Pattern 1: Full life date on one line "1807-1878"
    if (line.match(/^\d{4}-\d{4}$/)) {
      lifePatterns.push({ index: i, life: line, type: 'single' });
    }
    // Pattern 2: Born pattern "b.1976"
    else if (line.match(/^b\.\d{4}$/)) {
      lifePatterns.push({ index: i, life: line, type: 'single' });
    }
    // Pattern 3: Split across lines "YYYY-\nYYYY" or "YYYY- \n YYYY"
    else if (line.match(/^\d{4}$/) && i > 0) {
      const prevLine = lines[i-1].trim();
      if (prevLine.match(/^\d{4,5}-?\s*$/)) {
        let startYear = prevLine.replace(/[-\s]/g, '');
        // Fix Claude Monet typo
        if (startYear === '18040') startYear = '1840';
        lifePatterns.push({ index: i, life: `${startYear}-${line}`, type: 'split', startIndex: i-1 });
      }
    }
  }
  
  // Now extract artwork blocks between life patterns
  let dataStart = 0;
  for (let p = 0; p < lifePatterns.length; p++) {
    const pattern = lifePatterns[p];
    const dataEnd = pattern.type === 'split' ? pattern.startIndex - 1 : pattern.index - 1;
    
    // Get all data lines for this artwork
    const dataLines = [];
    for (let i = dataStart; i <= dataEnd; i++) {
      const line = lines[i].trim();
      // Skip empty lines and letter header
      if (line && line !== letter) {
        dataLines.push(line);
      }
    }
    
    if (dataLines.length > 0) {
      const artwork = parseArtworkData(dataLines.join(' '), pattern.life);
      if (artwork && artwork.title) {
        artworks.push(artwork);
      }
    }
    
    dataStart = pattern.index + 1;
  }
  
  return artworks;
}

function parseArtworkData(text, artistLife) {
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  // Extract SKU (last number, may have commas)
  let sku = '';
  const skuMatch = text.match(/([\d,]+)\s*$/);
  if (skuMatch) {
    sku = skuMatch[1].replace(/,/g, '');
    text = text.substring(0, text.lastIndexOf(skuMatch[1])).trim();
  }
  
  // Extract dimensions (W x H patterns)
  const dims = [];
  const dimPattern = /([\d.]+)\s*[xX]\s*([\d.]+)/g;
  let dimMatch;
  while ((dimMatch = dimPattern.exec(text)) !== null) {
    dims.push(`${dimMatch[1]} x ${dimMatch[2]}`);
  }
  
  // Remove dimensions
  text = text.replace(/([\d.]+)\s*[xX]\s*([\d.]+)/g, ' ').trim();
  text = text.replace(/\bUnknown\b/gi, ' ').trim();
  text = text.replace(/\s+/g, ' ').trim();
  
  // Extract year
  let year = '';
  const yearMatch = text.match(/\b(\d{4}(-\d{2,4})?)\b/);
  if (yearMatch) {
    year = yearMatch[1];
    text = text.replace(yearMatch[0], ' ').trim();
  }
  
  text = text.replace(/\s+/g, ' ').trim();
  
  // Find artist by matching known artists
  let title = text;
  let artist = '';
  
  for (const knownArtist of KNOWN_ARTISTS) {
    const idx = text.lastIndexOf(knownArtist);
    if (idx >= 0) {
      title = text.substring(0, idx).trim();
      artist = knownArtist;
      break;
    }
  }
  
  // If no known artist found, try to split
  if (!artist) {
    const words = text.split(' ');
    // Look for prefixes
    for (let i = 1; i < words.length - 1; i++) {
      if (['Sir', 'Lord', 'Von', 'De', 'Van', 'Le', 'La', 'Du'].includes(words[i])) {
        title = words.slice(0, i).join(' ');
        artist = words.slice(i).join(' ');
        break;
      }
    }
    // Fallback: last 2-3 words as artist
    if (!artist && words.length >= 4) {
      title = words.slice(0, -3).join(' ');
      artist = words.slice(-3).join(' ');
    } else if (!artist && words.length >= 3) {
      title = words.slice(0, -2).join(' ');
      artist = words.slice(-2).join(' ');
    }
  }
  
  return {
    title: title,
    year: year,
    artist: artist,
    artistLife: artistLife,
    originalSize: dims.length > 0 ? dims[0] : '',
    displaySize: dims.length > 1 ? dims[1] : dims[0] || '',
    sku: sku,
    basePrice: parseInt(sku) || 0,
  };
}

function getExistingTitles() {
  const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
  const content = fs.readFileSync(artworksPath, 'utf-8');
  
  const titleRegex = /title:\s*"([^"]+)"/g;
  const titles = new Set();
  let match;
  while ((match = titleRegex.exec(content)) !== null) {
    titles.add(match[1].toLowerCase().trim());
  }
  return titles;
}

function main() {
  const letters = ['K', 'L', 'M', 'N'];
  const existingTitles = getExistingTitles();
  
  console.log('='.repeat(80));
  console.log('KLMN PARSER - FINAL VERSION');
  console.log('='.repeat(80));
  console.log(`Existing artworks: ${existingTitles.size}`);
  
  const allParsed = {};
  const allMissing = [];
  
  for (const letter of letters) {
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`LETTER ${letter}`);
    console.log('─'.repeat(80));
    
    const rawPath = path.join(__dirname, `${letter.toLowerCase()}_pdf_raw_text.txt`);
    if (!fs.existsSync(rawPath)) {
      console.log(`File not found: ${rawPath}`);
      continue;
    }
    
    const text = fs.readFileSync(rawPath, 'utf-8');
    const artworks = parseRawText(text, letter);
    
    console.log(`Parsed: ${artworks.length} artworks\n`);
    
    const missing = [];
    for (let i = 0; i < artworks.length; i++) {
      const art = artworks[i];
      const exists = existingTitles.has(art.title.toLowerCase().trim());
      const status = exists ? '✓' : '✗';
      console.log(`${status} ${i+1}. "${art.title}" by ${art.artist} (${art.year}) [SKU: ${art.sku}]`);
      
      if (!exists) {
        missing.push({ ...art, letter });
      }
    }
    
    console.log(`\nMissing: ${missing.length}`);
    allParsed[letter] = artworks;
    allMissing.push(...missing);
    
    // Save
    const savePath = path.join(__dirname, `${letter.toLowerCase()}_final_parsed.json`);
    fs.writeFileSync(savePath, JSON.stringify(artworks, null, 2), 'utf-8');
  }
  
  // Summary
  console.log(`\n${'='.repeat(80)}`);
  console.log('SUMMARY');
  console.log('='.repeat(80));
  
  let total = 0, totalMissing = 0;
  for (const letter of letters) {
    const arts = allParsed[letter] || [];
    const miss = arts.filter(a => !existingTitles.has(a.title.toLowerCase().trim())).length;
    console.log(`${letter}: ${arts.length} parsed, ${miss} missing`);
    total += arts.length;
    totalMissing += miss;
  }
  
  console.log(`\nTotal: ${total} parsed, ${totalMissing} missing`);
  
  // Save all missing
  fs.writeFileSync(
    path.join(__dirname, 'klmn_all_missing.json'),
    JSON.stringify(allMissing, null, 2),
    'utf-8'
  );
}

main();
