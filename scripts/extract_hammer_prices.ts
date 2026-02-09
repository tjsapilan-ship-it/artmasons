import * as fs from 'fs';
import * as path from 'path';

interface HammerPriceEntry {
  name: string;
  artist: string;
  location: string;
  hammerPrice: string;
  slug: string;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function parseHammerPriceFile(filePath: string): Map<string, string> {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Handle both \r\n and \n line endings
  const lines = content.split(/\r?\n/).map(line => line.trim()).filter(line => line);
  
  console.log(`Total lines after filtering: ${lines.length}`);
  console.log(`First 20 lines:`);
  for (let j = 0; j < Math.min(20, lines.length); j++) {
    console.log(`  ${j}: "${lines[j]}"`);
  }
  
  const hammerPriceMap = new Map<string, string>();
  const entries: HammerPriceEntry[] = [];
  
  // Skip header lines - look for "FAMOUS ART" marker
  let i = 0;
  while (i < lines.length && !lines[i].includes('FAMOUS ART')) {
    i++;
  }
  i++; // Skip the "FAMOUS ART" line itself
  
  console.log(`\nStarting to parse from line ${i}`);
  
  // Now parse entries in groups of 4
  while (i < lines.length) {
    const artName = lines[i]?.trim();
    const artist = lines[i + 1]?.trim();
    const location = lines[i + 2]?.trim();
    const hammerPrice = lines[i + 3]?.trim();
    
    if (i < i + 20 && entries.length < 5) {
      console.log(`\nChecking lines ${i}-${i+3}:`);
      console.log(`  Art: "${artName}"`);
      console.log(`  Artist: "${artist}"`);
      console.log(`  Location: "${location}"`);
      console.log(`  Price: "${hammerPrice}"`);
    }
    
    if (artName && artist && location && hammerPrice) {
      const slug = generateSlug(artName);
      
      // Store the entry
      entries.push({
        name: artName,
        artist,
        location,
        hammerPrice,
        slug
      });
      
      // Only add to map if not already present (keeps first occurrence)
      if (!hammerPriceMap.has(slug)) {
        hammerPriceMap.set(slug, hammerPrice);
      }
      
      i += 4;
    } else {
      i++;
    }
  }
  
  console.log(`\nParsed ${hammerPriceMap.size} unique artworks with hammer prices`);
  console.log('\nSample entries:');
  let count = 0;
  for (const [slug, price] of hammerPriceMap.entries()) {
    if (count < 10) {
      console.log(`  "${slug}": "${price}"`);
      count++;
    }
  }
  
  return hammerPriceMap;
}

function generateTypeScriptMapping(hammerPriceMap: Map<string, string>): string {
  const entries = Array.from(hammerPriceMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([slug, price]) => `  "${slug}": "${price}"`)
    .join(',\n');
  
  return `const POPULAR_ART_HAMMER_PRICE_BY_SLUG: Record<string, string> = {\n${entries}\n};`;
}

// Main execution
const hammerPriceFilePath = path.join(__dirname, '..', 'data', 'HAMMER PRICE.txt');
const outputFilePath = path.join(__dirname, 'hammer_price_mapping.txt');

console.log('Extracting hammer prices from:', hammerPriceFilePath);

const hammerPriceMap = parseHammerPriceFile(hammerPriceFilePath);
const tsMapping = generateTypeScriptMapping(hammerPriceMap);

fs.writeFileSync(outputFilePath, tsMapping, 'utf-8');
console.log(`\nMapping written to: ${outputFilePath}`);
console.log(`Total entries: ${hammerPriceMap.size}`);
