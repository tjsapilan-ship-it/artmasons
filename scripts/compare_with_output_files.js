const fs = require('fs');

// Get all titles from the parsed output files
function getTitlesFromOutputFiles() {
  const letters = ['a', 'b', 'c', 'd', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 't', 'u', 'v', 'w', 'y', 'z'];
  const allTitles = new Set();
  
  for (const letter of letters) {
    const filename = `c:/xampp/htdocs/artmasons/scripts/${letter}_artworks_output.ts`;
    if (!fs.existsSync(filename)) {
      console.log(`Warning: ${filename} not found`);
      continue;
    }
    
    const content = fs.readFileSync(filename, 'utf8');
    const titleRegex = /title:\s*["']([^"']+)["']/g;
    let match;
    let count = 0;
    
    while ((match = titleRegex.exec(content)) !== null) {
      allTitles.add(match[1]);
      count++;
    }
    
    console.log(`Letter ${letter.toUpperCase()}: ${count} artworks`);
  }
  
  return allTitles;
}

// Get all titles from artworks.ts
function getTitlesFromArtworksTS() {
  const content = fs.readFileSync('c:/xampp/htdocs/artmasons/data/artworks.ts', 'utf8');
  const titleRegex = /title:\s*["']([^"']+)["']/g;
  const titles = [];
  let match;
  
  while ((match = titleRegex.exec(content)) !== null) {
    titles.push(match[1]);
  }
  
  return titles;
}

console.log('=== EXTRACTING TITLES FROM OUTPUT FILES ===\n');
const outputTitles = getTitlesFromOutputFiles();
console.log(`\nTotal unique titles in output files: ${outputTitles.size}\n`);

console.log('=== EXTRACTING TITLES FROM artworks.ts ===\n');
const tsTitles = getTitlesFromArtworksTS();
console.log(`Total titles in artworks.ts: ${tsTitles.length}\n`);

console.log('=== COMPARING ===\n');
const titlesToRemove = tsTitles.filter(title => !outputTitles.has(title));
console.log(`Titles to remove: ${titlesToRemove.length}\n`);

if (titlesToRemove.length > 0) {
  console.log('Sample titles to remove (first 20):');
  titlesToRemove.slice(0, 20).forEach((title, idx) => {
    console.log(`${idx + 1}. "${title}"`);
  });
}

// Save full list
fs.writeFileSync(
  'c:/xampp/htdocs/artmasons/scripts/verified_titles_to_remove.json',
  JSON.stringify(titlesToRemove, null, 2)
);

console.log(`\n✓ Full list saved to scripts/verified_titles_to_remove.json`);

console.log(`\n=== SUMMARY ===`);
console.log(`Output files contain: ${outputTitles.size} unique artworks`);
console.log(`artworks.ts contains: ${tsTitles.length} artworks`);
console.log(`To remove: ${titlesToRemove.length} artworks`);
console.log(`Will remain: ${tsTitles.length - titlesToRemove.length} artworks`);
