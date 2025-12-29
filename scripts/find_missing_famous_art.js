const fs = require('fs');
const path = require('path');

// Get all images from folder
const imagesInFolder = fs.readdirSync('./public/image/famous-art').filter(f => f.endsWith('.jpg'));

// Read the TypeScript file
const fileContent = fs.readFileSync('./data/famousAndTop100.ts', 'utf8');

// Extract image filenames from the file
const imageMatches = fileContent.match(/image: "\/image\/famous-art\/([^"]+)"/g);
const imagesInFile = imageMatches ? imageMatches.map(m => m.match(/famous-art\/(.+)"/)[1]) : [];

// Find missing images
const missing = imagesInFolder.filter(img => !imagesInFile.includes(img));

console.log('Images in folder:', imagesInFolder.length);
console.log('Images in file:', imagesInFile.length);
console.log('\nMissing from file:');
missing.forEach(img => console.log('  -', img));

console.log('\nExtra in file (not in folder):');
const extra = imagesInFile.filter(img => !imagesInFolder.includes(img));
extra.forEach(img => console.log('  -', img));
