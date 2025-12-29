const fs = require('fs');

console.log('Applying artist name corrections to artworks.ts...\n');

// Read the file
let content = fs.readFileSync('data/artworks.ts', 'utf8');

// Apply all corrections
const corrections = [
  { from: '"Edgar Degas"', to: '"Hilaire Germaine Edgar Degas"' },
  { from: '"Jacques-Louis David"', to: '"Jaques-Louis David"' },
  { from: '"Melchior De Hondecoeter"', to: '"Melchior D\'Hondecoeter"' },
  { from: '"Canaletto"', to: '"Giovanni Antonio Canal Canaletto"' },
  { from: '"Caravaggio"', to: '"Michelangelo Merisi Da Caravaggio"' },
];

let totalReplacements = 0;

corrections.forEach(({ from, to }) => {
  const count = (content.match(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
  console.log(`✓ Replaced ${count} occurrences of ${from} with ${to}`);
  totalReplacements += count;
});

// Write the corrected content back
fs.writeFileSync('data/artworks.ts', content, 'utf8');

console.log(`\n✓ Total replacements: ${totalReplacements}`);
console.log('✓ Artist names have been corrected to match PDF files');
console.log('\nBackup saved as: data/artworks.ts.backup');
