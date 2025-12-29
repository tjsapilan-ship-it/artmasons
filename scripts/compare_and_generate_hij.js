const fs = require('fs');
const path = require('path');

// Read and parse a TypeScript output file
function parseOutputFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract artworks using regex (simple approach)
  // Find the array content between [ and ]
  const arrayMatch = content.match(/export const \w+Artworks = \[([\s\S]*)\];/);
  if (!arrayMatch) {
    console.error(`Could not find artworks array in ${filePath}`);
    return [];
  }
  
  const arrayContent = arrayMatch[1];
  
  // Convert to proper JSON by wrapping in brackets
  // We need to be careful about trailing commas
  const jsonContent = `[${arrayContent}]`;
  
  try {
    const artworks = eval(jsonContent); // Using eval since it's TypeScript syntax
    return artworks;
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return [];
  }
}

// Read existing artworks.ts
function getExistingArtworks() {
  const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
  const content = fs.readFileSync(artworksPath, 'utf-8');
  
  // Extract all titles
  const titleRegex = /title:\s*"([^"]+)"/g;
  const titles = new Set();
  let match;
  
  while ((match = titleRegex.exec(content)) !== null) {
    titles.add(match[1].toLowerCase());
  }
  
  return titles;
}

// Convert artwork to TypeScript format
function artworkToTS(artwork, indent = '  ') {
  const lines = [];
  lines.push(`${indent}{`);
  lines.push(`${indent}  title: "${artwork.title}",`);
  if (artwork.year) lines.push(`${indent}  year: "${artwork.year}",`);
  if (artwork.artist) lines.push(`${indent}  artist: "${artwork.artist}",`);
  if (artwork.artistLife) lines.push(`${indent}  artistLife: "${artwork.artistLife}",`);
  if (artwork.location) lines.push(`${indent}  location: "${artwork.location}",`);
  if (artwork.originalSize) lines.push(`${indent}  originalSize: "${artwork.originalSize}",`);
  if (artwork.description) lines.push(`${indent}  description: "${artwork.description}",`);
  if (artwork.sku) lines.push(`${indent}  sku: "${artwork.sku}",`);
  if (artwork.basePrice) lines.push(`${indent}  basePrice: ${artwork.basePrice},`);
  if (artwork.currency) lines.push(`${indent}  currency: "${artwork.currency}",`);
  lines.push(`${indent}  image: "${artwork.image}",`);
  
  // Options
  if (artwork.options && artwork.options.length > 0) {
    lines.push(`${indent}  options: [`);
    artwork.options.forEach((opt, idx) => {
      const isLast = idx === artwork.options.length - 1;
      lines.push(`${indent}    { id: '${opt.id}', width: ${opt.width}, height: ${opt.height}, price: ${opt.price}, label: '${opt.label}' }${isLast ? '' : ','}`);
    });
    lines.push(`${indent}  ],`);
  }
  
  lines.push(`${indent}},`);
  
  return lines.join('\n');
}

async function main() {
  const letters = ['H', 'I', 'J'];
  const allNewArtworks = {};
  const existingTitles = getExistingArtworks();
  
  console.log(`\nExisting artworks in artworks.ts: ${existingTitles.size}`);
  
  for (const letter of letters) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing letter ${letter}`);
    console.log('='.repeat(60));
    
    const outputPath = path.join(__dirname, `${letter.toLowerCase()}_artworks_output.ts`);
    
    if (!fs.existsSync(outputPath)) {
      console.log(`Output file not found: ${outputPath}`);
      continue;
    }
    
    const artworks = parseOutputFile(outputPath);
    console.log(`Found ${artworks.length} artworks in output file`);
    
    // Find which ones are missing
    const missing = artworks.filter(art => {
      return !existingTitles.has(art.title.toLowerCase());
    });
    
    console.log(`Missing from artworks.ts: ${missing.length}`);
    
    if (missing.length > 0) {
      console.log('\nMissing artworks:');
      missing.forEach((art, idx) => {
        console.log(`  ${idx + 1}. ${art.title} by ${art.artist}`);
      });
      
      allNewArtworks[letter] = missing;
    } else {
      console.log('All artworks already in artworks.ts!');
    }
  }
  
  // Generate TypeScript code to add
  console.log(`\n${'='.repeat(60)}`);
  console.log('GENERATING CODE TO ADD');
  console.log('='.repeat(60));
  
  let totalToAdd = 0;
  const allCode = [];
  
  for (const [letter, artworks] of Object.entries(allNewArtworks)) {
    if (artworks.length === 0) continue;
    
    totalToAdd += artworks.length;
    
    allCode.push(`\n  // === Letter ${letter} - ${artworks.length} artworks ===`);
    artworks.forEach(artwork => {
      allCode.push(artworkToTS(artwork));
    });
  }
  
  if (totalToAdd > 0) {
    const outputCodePath = path.join(__dirname, 'hij_artworks_to_add.ts');
    fs.writeFileSync(outputCodePath, allCode.join('\n'), 'utf-8');
    console.log(`\nGenerated code for ${totalToAdd} artworks`);
    console.log(`Saved to: ${outputCodePath}`);
    console.log(`\nYou can copy this code and paste it into artworks.ts`);
  } else {
    console.log('\nNo artworks to add - all are already in artworks.ts!');
  }
  
  // Also save as JSON for reference
  const jsonPath = path.join(__dirname, 'hij_artworks_to_add.json');
  fs.writeFileSync(jsonPath, JSON.stringify(allNewArtworks, null, 2), 'utf-8');
  console.log(`\nAlso saved as JSON: ${jsonPath}`);
}

main().catch(console.error);
