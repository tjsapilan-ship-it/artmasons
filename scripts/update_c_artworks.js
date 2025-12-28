const fs = require('fs');

// Read the current artworks.ts file
const artworksContent = fs.readFileSync('data/artworks.ts', 'utf8');

// Read the generated C artworks
const cArtworksOutput = fs.readFileSync('scripts/c_artworks_output.ts', 'utf8');

// Extract just the array content (without the export statement and array declaration)
const cArtworksMatch = cArtworksOutput.match(/export const cArtworks = \[([\s\S]*)\];/);
if (!cArtworksMatch) {
  console.error('Failed to extract C artworks array content');
  process.exit(1);
}
const cArtworksArrayContent = cArtworksMatch[1].trim();

// Split the artworks.ts into lines
const lines = artworksContent.split('\n');

// Find the start and end of Letter C section
let startLine = -1;
let endLine = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('// --- Letter C artworks')) {
    startLine = i;
  }
  if (startLine !== -1 && lines[i].includes('// --- Letter E artworks')) {
    endLine = i;
    break;
  }
}

if (startLine === -1) {
  console.error('Could not find Letter C section start');
  process.exit(1);
}

console.log(`Found Letter C section: lines ${startLine + 1} to ${endLine}`);

// Create new content with the C section replaced
const beforeC = lines.slice(0, startLine).join('\n');
const afterE = lines.slice(endLine).join('\n');

// Format the new C section with proper indentation
const newCArtworks = `  // --- Letter C artworks (images located in /image/c/) ---
${cArtworksArrayContent.split('\n').map(line => line ? '  ' + line : '').join('\n')}

`;

const newContent = beforeC + '\n' + newCArtworks + afterE;

// Write the updated content back to artworks.ts
fs.writeFileSync('data/artworks.ts', newContent, 'utf8');

console.log('✓ Successfully updated Letter C artworks in data/artworks.ts');
console.log(`✓ Replaced ${endLine - startLine} old lines with new C artwork data`);
