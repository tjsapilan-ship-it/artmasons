const fs = require('fs');

const artworksContent = fs.readFileSync('./data/artworks.ts', 'utf-8');

// Extract all Kandinsky artworks
const kandinskys = [];
const regex = /\{[^}]*artist:\s*"Wassily Kandinsky"[^}]*title:\s*"([^"]+)"[^}]*sku:\s*"([^"]+)"[^}]*image:\s*"([^"]+)"[^}]*\}/gs;

let match;
const lines = artworksContent.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('artist: "Wassily Kandinsky"')) {
    // Look back and forward to find title, sku, image
    let title = '';
    let sku = '';
    let image = '';
    
    for (let j = Math.max(0, i - 10); j < Math.min(lines.length, i + 15); j++) {
      if (lines[j].includes('title:')) {
        title = lines[j].match(/title:\s*"([^"]+)"/)?.[1] || '';
      }
      if (lines[j].includes('sku:')) {
        sku = lines[j].match(/sku:\s*"([^"]+)"/)?.[1] || '';
      }
      if (lines[j].includes('image:')) {
        image = lines[j].match(/image:\s*"([^"]+)"/)?.[1] || '';
      }
    }
    
    if (title && sku) {
      kandinskys.push({ title, sku, image, line: i + 1 });
    }
  }
}

console.log(`Found ${kandinskys.length} Kandinsky artworks:\n`);

// Group by title to find duplicates
const titleMap = {};
kandinskys.forEach(k => {
  if (!titleMap[k.title]) {
    titleMap[k.title] = [];
  }
  titleMap[k.title].push(k);
});

// Show all
kandinskys.forEach(k => {
  console.log(`${k.sku.padEnd(15)} ${k.title}`);
});

// Show duplicates
console.log('\n\nDUPLICATES:');
Object.entries(titleMap).forEach(([title, artworks]) => {
  if (artworks.length > 1) {
    console.log(`\n"${title}" appears ${artworks.length} times:`);
    artworks.forEach(a => {
      console.log(`  Line ${a.line}: ${a.sku} - ${a.image}`);
    });
  }
});
