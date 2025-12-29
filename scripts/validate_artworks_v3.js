const fs = require('fs');
const path = require('path');

// Read all image files with exact paths
function getAllImages() {
  const imageDir = path.join(__dirname, '..', 'public', 'image');
  const images = new Set();
  const imageList = [];
  
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  
  for (const letter of letters) {
    const letterDir = path.join(imageDir, letter);
    if (fs.existsSync(letterDir)) {
      try {
        const files = fs.readdirSync(letterDir);
        for (const file of files) {
          if (file.match(/\.(jpg|png)$/i)) {
            const imagePath = `/image/${letter}/${file}`;
            images.add(imagePath);
            imageList.push(imagePath);
          }
        }
      } catch (e) {}
    }
  }
  
  return { set: images, list: imageList };
}

// Read current artworks.ts properly
function getCurrentArtworks() {
  const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
  const content = fs.readFileSync(artworksPath, 'utf8');
  
  const artworks = [];
  
  // Find all artwork objects between { and }
  let depth = 0;
  let start = -1;
  let inArray = false;
  
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '[' && content.slice(i-8, i).includes('ARTWORKS')) {
      inArray = true;
    }
    if (!inArray) continue;
    
    if (content[i] === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (content[i] === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        const objStr = content.slice(start, i + 1);
        
        // Extract title
        const titleMatch = objStr.match(/title:\s*["'](.+?)["']/s);
        // Extract image - be more careful with quotes
        const imageMatch = objStr.match(/image:\s*["'](.+?)["']/s);
        
        if (titleMatch && imageMatch) {
          artworks.push({
            title: titleMatch[1],
            image: imageMatch[2],
            raw: objStr.substring(0, 200)
          });
        }
        start = -1;
      }
    }
  }
  
  return artworks;
}

console.log('='.repeat(80));
console.log('ACCURATE ARTWORK VALIDATION V3');
console.log('='.repeat(80));
console.log();

const { set: imageSet, list: imageList } = getAllImages();
console.log(`Total images found: ${imageList.length}`);

const artworks = getCurrentArtworks();
console.log(`Total artworks in artworks.ts: ${artworks.length}`);

// Check each artwork has its image
const missingImages = [];
const validArtworks = [];

for (const artwork of artworks) {
  if (imageSet.has(artwork.image)) {
    validArtworks.push(artwork);
  } else {
    missingImages.push(artwork);
  }
}

console.log(`\nArtworks with valid images: ${validArtworks.length}`);
console.log(`Artworks with MISSING images: ${missingImages.length}`);

if (missingImages.length > 0) {
  console.log('\n' + '='.repeat(80));
  console.log('ARTWORKS WITH MISSING IMAGES (add these images)');
  console.log('='.repeat(80) + '\n');
  
  missingImages.forEach((a, i) => {
    console.log(`${i + 1}. Title: "${a.title}"`);
    console.log(`   Expected image: ${a.image}`);
    console.log();
  });
}

// Check for images that don't have artworks
const usedImages = new Set(artworks.map(a => a.image));
const unusedImages = imageList.filter(img => !usedImages.has(img));

// Filter to only show non-famous-art unused images
const relevantUnusedImages = unusedImages.filter(img => !img.includes('famous-art') && !img.includes('icons'));

console.log('='.repeat(80));
console.log(`UNUSED IMAGES (${relevantUnusedImages.length} images without artworks)`);
console.log('='.repeat(80));

if (relevantUnusedImages.length > 0) {
  relevantUnusedImages.forEach((img, i) => {
    console.log(`${i + 1}. ${img}`);
  });
}

// Write detailed report
const report = {
  summary: {
    totalImages: imageList.length,
    totalArtworks: artworks.length,
    validArtworks: validArtworks.length,
    missingImages: missingImages.length,
    unusedImages: relevantUnusedImages.length
  },
  artworksWithMissingImages: missingImages.map(a => ({ title: a.title, image: a.image })),
  unusedImages: relevantUnusedImages
};

fs.writeFileSync(
  path.join(__dirname, 'final_validation_report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\nReport saved to scripts/final_validation_report.json');
