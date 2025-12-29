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

// Read current artworks.ts and extract full entries
function getCurrentArtworks() {
  const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
  const content = fs.readFileSync(artworksPath, 'utf8');
  
  const artworks = [];
  
  // Match full artwork entries
  const entryRegex = /\{\s*title:\s*["']([^"']+)["'][^}]+?image:\s*["']([^"']+)["'][^}]*?\}/gs;
  let match;
  while ((match = entryRegex.exec(content)) !== null) {
    artworks.push({
      title: match[1],
      image: match[2]
    });
  }
  
  return artworks;
}

console.log('='.repeat(80));
console.log('ACCURATE ARTWORK VALIDATION');
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
  console.log('ARTWORKS WITH MISSING IMAGES (TO BE FIXED)');
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

console.log('='.repeat(80));
console.log(`UNUSED IMAGES (${unusedImages.length} images without artworks)`);
console.log('='.repeat(80));

if (unusedImages.length > 0 && unusedImages.length < 50) {
  unusedImages.forEach((img, i) => {
    console.log(`${i + 1}. ${img}`);
  });
} else if (unusedImages.length >= 50) {
  console.log(`Too many to list (${unusedImages.length}). First 20:`);
  unusedImages.slice(0, 20).forEach((img, i) => {
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
    unusedImages: unusedImages.length
  },
  artworksWithMissingImages: missingImages,
  unusedImages: unusedImages
};

fs.writeFileSync(
  path.join(__dirname, 'accurate_validation_report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\nReport saved to scripts/accurate_validation_report.json');
