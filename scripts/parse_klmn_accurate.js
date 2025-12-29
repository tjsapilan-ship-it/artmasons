const fs = require('fs');
const path = require('path');

// Parse artworks from raw PDF text
function parseArtworksFromRawText(text, letter) {
  const artworks = [];
  const lines = text.split('\n');
  
  // Find artwork records by looking for life dates pattern
  // Each artwork ends with a life dates line like "1866-\n1944" or "1802-\n1873" or "b.1976"
  const lifePattern = /^(\d{4}|\s*b\.\d{4})[\s\-]*$/;
  const lifePattern2 = /^(\d{4}|\s*b\.\d{4})$/;
  
  // Find all line indices that contain life date endings (the year part)
  const lifeEndIndices = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Match patterns like "1944", "1926", "1873", etc. (4-digit year alone on a line)
    if (line.match(/^\d{4}\s*$/) || line.match(/^b\.\d{4}\s*$/)) {
      // Check if previous line starts with a year or dash (e.g., "1866-" or "18040-")
      if (i > 0) {
        const prevLine = lines[i-1].trim();
        if (prevLine.match(/^\d{4,5}-?\s*$/) || prevLine.match(/^b\.\d{4}$/)) {
          lifeEndIndices.push(i);
        }
      }
    }
  }
  
  // Now parse blocks between life date endings
  let startIdx = 0;
  for (const endIdx of lifeEndIndices) {
    // Skip the letter header
    const blockLines = lines.slice(startIdx, endIdx + 1)
      .map(l => l.trim())
      .filter(l => l && l !== letter);
    
    if (blockLines.length > 0) {
      const artwork = parseArtworkBlock(blockLines);
      if (artwork && artwork.title) {
        artworks.push(artwork);
      }
    }
    
    startIdx = endIdx + 1;
  }
  
  return artworks;
}

function parseArtworkBlock(lines) {
  // Combine lines into a single block for analysis
  const text = lines.join(' ').replace(/\s+/g, ' ').trim();
  
  // Extract artist life from end (pattern like "1866-1944" or "b.1976")
  let artistLife = '';
  const lifeMatch = text.match(/(\d{4,5}-?\s*\d{0,4})\s*$/);
  const bornMatch = text.match(/(b\.\d{4})\s*$/);
  
  if (bornMatch) {
    artistLife = bornMatch[1];
  } else if (lifeMatch) {
    artistLife = lifeMatch[1].replace(/\s+/g, '');
    // Fix the typo "18040-1926" should be "1840-1926"
    if (artistLife.startsWith('18040')) {
      artistLife = artistLife.replace('18040', '1840');
    }
  }
  
  // Remove life from text
  let remaining = text;
  if (artistLife) {
    remaining = text.substring(0, text.lastIndexOf(artistLife.split('-')[0])).trim();
  }
  
  // Extract SKU (number with possible commas at end)
  let sku = '';
  const skuMatch = remaining.match(/(\d[\d,]*)\s*$/);
  if (skuMatch) {
    sku = skuMatch[1].replace(/,/g, '');
    remaining = remaining.substring(0, remaining.lastIndexOf(skuMatch[1])).trim();
  }
  
  // Extract dimensions (format: "W x H" appears twice - original and display)
  const dimPattern = /([\d.]+)\s*[xX]\s*([\d.]+)/g;
  const dims = [];
  let dimMatch;
  while ((dimMatch = dimPattern.exec(remaining)) !== null) {
    dims.push(`${dimMatch[1]} x ${dimMatch[2]}`);
  }
  
  // Remove dimensions and "Unknown" from remaining text
  remaining = remaining.replace(/([\d.]+)\s*[xX]\s*([\d.]+)/g, ' ').trim();
  remaining = remaining.replace(/\bUnknown\b/gi, ' ').trim();
  remaining = remaining.replace(/\s+/g, ' ').trim();
  
  // Extract year (4-digit number, may be range like 1907-1908)
  let year = '';
  const yearMatch = remaining.match(/\b(\d{4}(-\d{2,4})?)\b/);
  if (yearMatch) {
    year = yearMatch[1];
    remaining = remaining.replace(yearMatch[0], ' ').trim();
  }
  
  remaining = remaining.replace(/\s+/g, ' ').trim();
  
  // Now remaining should be "Title Artist Name"
  // Need to split title from artist
  const artwork = splitTitleAndArtist(remaining);
  
  return {
    title: artwork.title,
    year: year,
    artist: artwork.artist,
    artistLife: artistLife,
    originalSize: dims.length > 0 ? dims[0] : '',
    sku: sku,
    basePrice: parseInt(sku) || 0,
  };
}

function splitTitleAndArtist(text) {
  // Known artists in the K, L, M, N PDFs
  const knownArtists = [
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
    'Sir Edwin Henry Landseer',
    'Sir John Lavery',
    'Henri Lebasque',
    'Jules Joseph Lefebvre',
    'Lord Frederick Leighton',
    'John Frederick Lewis',
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
    'Friedich Von Nerly',
  ];
  
  // Try to match known artist
  for (const artist of knownArtists) {
    const idx = text.lastIndexOf(artist);
    if (idx > 0) {
      return {
        title: text.substring(0, idx).trim(),
        artist: artist
      };
    }
  }
  
  // Fallback: try to split on common patterns
  const words = text.split(' ');
  
  // Look for "Sir", "Lord", "Von", "de" as start of artist name
  for (let i = 1; i < words.length - 1; i++) {
    if (['Sir', 'Lord', 'Von', 'De', 'Van'].includes(words[i])) {
      return {
        title: words.slice(0, i).join(' '),
        artist: words.slice(i).join(' ')
      };
    }
  }
  
  // Look for all-caps initials pattern (e.g., "Gustav Klimt" where both start with caps)
  // Assume last 2-4 words are artist name
  if (words.length >= 3) {
    return {
      title: words.slice(0, -2).join(' '),
      artist: words.slice(-2).join(' ')
    };
  }
  
  return { title: text, artist: '' };
}

// More accurate approach: read each PDF and parse line by line
function parseAccurateArtworks(text, letter) {
  const artworks = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l && l !== letter);
  
  // Artwork structure:
  // Line 1: Title (may span multiple lines)
  // Line N: Artist Name
  // Line N+1: Year (4-digit, may be range)
  // Line N+2: Original Size (W x H) or "Unknown"
  // Line N+3: Display Size (W x H) 
  // Line N+4: SKU (number)
  // Empty line
  // Life dates (YYYY- on one line, YYYY on next) or "b.YYYY"
  
  let i = 0;
  while (i < lines.length) {
    const artwork = extractNextArtwork(lines, i);
    if (artwork.artwork) {
      artworks.push(artwork.artwork);
      i = artwork.nextIndex;
    } else {
      i++;
    }
  }
  
  return artworks;
}

function extractNextArtwork(lines, startIdx) {
  // Look for life date pattern to find end of artwork
  // Life dates are "YYYY-\nYYYY" or "b.YYYY"
  
  let endIdx = -1;
  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    // Check for end year of life dates
    if (line.match(/^\d{4}$/) && i > startIdx) {
      const prevLine = lines[i-1];
      if (prevLine && prevLine.match(/^\d{4,5}-?$/)) {
        endIdx = i;
        break;
      }
    }
    if (line.match(/^b\.\d{4}$/)) {
      endIdx = i;
      break;
    }
  }
  
  if (endIdx === -1) {
    return { artwork: null, nextIndex: lines.length };
  }
  
  // Extract artist life
  const endLine = lines[endIdx];
  const prevLine = lines[endIdx - 1];
  let artistLife = '';
  
  if (endLine.match(/^b\.\d{4}$/)) {
    artistLife = endLine;
    endIdx--; // adjust for b.YYYY format (single line)
  } else if (prevLine && prevLine.match(/^\d{4,5}-?$/)) {
    let start = prevLine.replace('-', '');
    // Fix typo in Claude Monet dates
    if (start === '18040') start = '1840';
    artistLife = start + '-' + endLine;
    endIdx = endIdx - 2; // Skip life date lines
  }
  
  // Now extract artwork data from startIdx to endIdx
  const blockLines = lines.slice(startIdx, endIdx + 1).filter(l => l);
  
  if (blockLines.length === 0) {
    return { artwork: null, nextIndex: endIdx + 3 };
  }
  
  // Parse the block
  const blockText = blockLines.join(' ').replace(/\s+/g, ' ').trim();
  
  // Extract SKU (last number)
  let sku = '';
  const skuMatch = blockText.match(/([\d,]+)\s*$/);
  if (skuMatch) {
    sku = skuMatch[1].replace(/,/g, '');
  }
  
  // Extract dimensions
  const dimPattern = /([\d.]+)\s*[xX]\s*([\d.]+)/g;
  const dims = [];
  let dimMatch;
  let textForDims = blockText;
  while ((dimMatch = dimPattern.exec(textForDims)) !== null) {
    dims.push(`${dimMatch[1]} x ${dimMatch[2]}`);
  }
  
  // Extract year
  let year = '';
  // Remove dimensions and SKU first
  let cleaned = blockText.replace(/([\d.]+)\s*[xX]\s*([\d.]+)/g, ' ').trim();
  cleaned = cleaned.replace(/\bUnknown\b/gi, ' ').trim();
  if (sku) {
    cleaned = cleaned.replace(new RegExp(sku.replace(/,/g, ',?') + '\\s*$'), '').trim();
  }
  
  const yearMatch = cleaned.match(/\b(\d{4}(-\d{2,4})?)\b/);
  if (yearMatch) {
    year = yearMatch[1];
    cleaned = cleaned.replace(yearMatch[0], ' ').trim();
  }
  
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Split title and artist
  const { title, artist } = splitTitleAndArtist(cleaned);
  
  const artwork = {
    title: title,
    year: year,
    artist: artist,
    artistLife: artistLife,
    originalSize: dims.length > 0 ? dims[0] : '',
    sku: sku,
    basePrice: parseInt(sku) || 0,
  };
  
  // Calculate next index (skip past life dates)
  let nextIdx = endIdx + 1;
  // Skip life date lines
  while (nextIdx < lines.length && (lines[nextIdx].match(/^\d{4,5}-?$/) || lines[nextIdx].match(/^\d{4}$/))) {
    nextIdx++;
  }
  
  return { artwork: artwork, nextIndex: nextIdx };
}

// Get existing artworks from artworks.ts
function getExistingArtworks() {
  const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
  const content = fs.readFileSync(artworksPath, 'utf-8');
  
  // Extract all titles
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
  const existingTitles = getExistingArtworks();
  
  console.log('='.repeat(80));
  console.log('ACCURATE KLMN PDF PARSER');
  console.log('='.repeat(80));
  console.log(`Existing titles in artworks.ts: ${existingTitles.size}`);
  
  const allArtworks = {};
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
    const artworks = parseAccurateArtworks(text, letter);
    
    console.log(`Parsed ${artworks.length} artworks from PDF\n`);
    
    // Check each artwork
    const missing = [];
    for (let i = 0; i < artworks.length; i++) {
      const art = artworks[i];
      const exists = existingTitles.has(art.title.toLowerCase().trim());
      const status = exists ? '✓' : '✗';
      console.log(`${status} ${i+1}. "${art.title}" by ${art.artist} (${art.year}) [SKU: ${art.sku}] [Life: ${art.artistLife}]`);
      
      if (!exists) {
        missing.push({ ...art, letter });
      }
    }
    
    console.log(`\nMissing: ${missing.length} of ${artworks.length}`);
    
    allArtworks[letter] = artworks;
    allMissing.push(...missing);
    
    // Save parsed artworks
    const outputPath = path.join(__dirname, `${letter.toLowerCase()}_parsed_artworks.json`);
    fs.writeFileSync(outputPath, JSON.stringify(artworks, null, 2), 'utf-8');
  }
  
  // Summary
  console.log(`\n${'='.repeat(80)}`);
  console.log('SUMMARY');
  console.log('='.repeat(80));
  
  let totalParsed = 0;
  let totalMissing = 0;
  
  for (const letter of letters) {
    const artworks = allArtworks[letter] || [];
    const missing = artworks.filter(a => !existingTitles.has(a.title.toLowerCase().trim()));
    console.log(`${letter}: ${artworks.length} parsed, ${missing.length} missing`);
    totalParsed += artworks.length;
    totalMissing += missing.length;
  }
  
  console.log(`\nTotal parsed: ${totalParsed}`);
  console.log(`Total missing: ${totalMissing}`);
  
  // Save all missing
  const missingPath = path.join(__dirname, 'klmn_missing_final.json');
  fs.writeFileSync(missingPath, JSON.stringify(allMissing, null, 2), 'utf-8');
  console.log(`\nMissing artworks saved to: ${missingPath}`);
}

main();
