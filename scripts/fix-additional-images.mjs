import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Additional image fixes based on directory scan
const additionalFixes = [
  // Van Gogh from famous-art
  { old: '/image/g/irises.jpg', new: '/image/famous-art/irises.jpg' },
  { old: '/image/g/shoes.jpg', new: '/image/famous-art/shoes.jpg' },
  { old: '/image/g/self portrait with bandaged ear.jpg', new: '/image/famous-art/self portrait with bandaged ear.jpg' },
  { old: '/image/g/portrait of doctor gachet.jpg', new: '/image/famous-art/portrait of doctor gachet.jpg' },
  { old: '/image/g/portrait of the postman joseph roulin.jpg', new: '/image/famous-art/postman joseph roulin.jpg' },
  { old: '/image/g/the cafe terrace on the place du forum aries.jpg', new: '/image/famous-art/the cafe terrace on the place du forum aries.jpg' },
  { old: '/image/g/vase of roses.jpg', new: '/image/famous-art/vase of roses.jpg' },
  { old: '/image/g/vase with irises against yellow background.jpg', new: '/image/famous-art/vase with irises against a yellow background.jpg' },
  { old: '/image/g/blossoming almomd tree.jpg', new: '/image/famous-art/blossoming almod tree.jpg' },
  { old: '/image/g/still life vase with fourteen sunflowers.jpg', new: '/image/famous-art/still life vase with fourteen sunflowers.jpg' },
  
  // Monet from famous-art
  { old: '/image/m/grand canal.jpg', new: '/image/famous-art/grand canal.jpg' },
  { old: '/image/m/impression sunrise soliel levante.jpg', new: '/image/famous-art/impression sunrise (soliel levante).jpg' },
  { old: '/image/m/water lilies.jpg', new: '/image/famous-art/water lilies.jpg' },
  { old: '/image/m/water lily pond symphony in green.jpg', new: '/image/famous-art/water lily pond symphony in green.jpg' },
  { old: '/image/m/the japanese bridge pond with water lilies.jpg', new: '/image/famous-art/the japanese bridge pond with water lilies.jpg' },
  { old: '/image/m/houses of parliament.jpg', new: '/image/famous-art/the houses of parliament sunset.jpg' },
  { old: '/image/m/woman with a parasol madame monet.jpg', new: '/image/famous-art/woman with a parasol madame monet.jpg' },
  { old: '/image/m/dance at bougival.jpg', new: '/image/famous-art/dance at bougival.jpg' },
  { old: '/image/m/luncheon on the boating party.jpg', new: '/image/famous-art/luncheon on the boating party.jpg' },
  { old: '/image/m/two sisters on the terrace.jpg', new: '/image/famous-art/two sisters on the terrace.jpg' },
  { old: '/image/m/the skiff la yole.jpg', new: '/image/famous-art/the skiff (la yole).jpg' },
  
  // Picasso from famous-art
  { old: '/image/p/crouching woman jacqueline.jpg', new: '/image/famous-art/crouching woman (jacqueline).jpg' },
  { old: '/image/p/horses head.jpg', new: '/image/famous-art/horse\'s head.jpg' },
  { old: '/image/p/jacqueline with flowers.jpg', new: '/image/famous-art/jacqueline with flowers.jpg' },
  
  // Da Vinci from famous-art
  { old: '/image/v/lady with an emine cecilia gallerani.jpg', new: '/image/famous-art/lady with an emine (cecilia gallerani).jpg' },
  
  // Matisse from famous-art
  { old: '/image/m/the red room harmony in red.jpg', new: '/image/famous-art/the red room, harmony in red.jpg' },
  
  // Klimt from famous-art
  { old: '/image/k/the dancer.jpg', new: '/image/famous-art/the dancer.jpg' },
];

const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
let content = fs.readFileSync(artworksPath, 'utf-8');

let fixedCount = 0;
let notFoundCount = 0;

for (const fix of additionalFixes) {
  // Check if the new path exists
  const fullPath = path.join(__dirname, '..', 'public', fix.new);
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping - file doesn't exist: ${fix.new}`);
    notFoundCount++;
    continue;
  }
  
  // Create regex pattern to match the image path
  // We need to handle both single and double quotes
  const escapedOld = fix.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern1 = new RegExp(`image:\\s*"${escapedOld}"`, 'g');
  const pattern2 = new RegExp(`image:\\s*'${escapedOld}'`, 'g');
  
  if (content.match(pattern1) || content.match(pattern2)) {
    // Replace with double quotes to avoid apostrophe issues
    content = content.replace(pattern1, `image: "${fix.new}"`);
    content = content.replace(pattern2, `image: "${fix.new}"`);
    console.log(`✓ Fixed: ${fix.old} → ${fix.new}`);
    fixedCount++;
  }
}

// Write back
fs.writeFileSync(artworksPath, content, 'utf-8');

console.log(`\n========================================`);
console.log(`Fixed: ${fixedCount} | Not Found: ${notFoundCount}`);
console.log(`========================================\n`);
