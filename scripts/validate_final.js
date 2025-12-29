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

// Read current artworks.ts properly using simpler regex
function getCurrentArtworks() {
  const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
  const content = fs.readFileSync(artworksPath, 'utf8');
  
  const artworks = [];
  
  // Split by { to get each artwork block
  const blocks = content.split(/\n\s*\{/);
  
  for (const block of blocks) {
    // Check if this block has both title and image
    const titleMatch = block.match(/title:\s*"([^"]+)"/);
    const imageMatch = block.match(/image:\s*"([^"]+)"/);
    
    if (titleMatch && imageMatch) {
      artworks.push({
        title: titleMatch[1],
        image: imageMatch[1]
      });
    }
  }
  
  return artworks;
}

console.log('='.repeat(80));
console.log('FINAL ARTWORK VALIDATION');
console.log('='.repeat(80));
console.log();

const { set: imageSet, list: imageList } = getAllImages();
console.log(`Total images found in public/image: ${imageList.length}`);

const artworks = getCurrentArtworks();
console.log(`Total artworks extracted from artworks.ts: ${artworks.length}`);

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
  console.log('ARTWORKS WITH MISSING IMAGES - NEED TO ADD THESE IMAGES');
  console.log('='.repeat(80) + '\n');
  
  missingImages.forEach((a, i) => {
    console.log(`${i + 1}. Title: "${a.title}"`);
    console.log(`   Expected path: ${a.image}`);
    console.log();
  });
}

// Check for images that don't have artworks
const usedImages = new Set(artworks.map(a => a.image));
const unusedImages = imageList.filter(img => !usedImages.has(img));

// Filter to only show non-famous-art/icons unused images
const relevantUnusedImages = unusedImages.filter(img => !img.includes('famous-art') && !img.includes('icons'));

console.log('='.repeat(80));
console.log(`UNUSED IMAGES (${relevantUnusedImages.length} images without artworks)`);
console.log('='.repeat(80));

if (relevantUnusedImages.length > 0 && relevantUnusedImages.length <= 100) {
  relevantUnusedImages.forEach((img, i) => {
    console.log(`${i + 1}. ${img}`);
  });
} else if (relevantUnusedImages.length > 100) {
  console.log(`Too many to list (${relevantUnusedImages.length}).`);
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
  artworksWithMissingImages: missingImages,
  unusedImages: relevantUnusedImages
};

fs.writeFileSync(
  path.join(__dirname, 'final_validation_report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`Total images in public/image: ${imageList.length}`);
console.log(`Total artworks in artworks.ts: ${artworks.length}`);
console.log(`Valid artworks (have images): ${validArtworks.length}`);
console.log(`Missing images (need to add): ${missingImages.length}`);
console.log(`Unused images: ${relevantUnusedImages.length}`);
console.log('\nReport saved to scripts/final_validation_report.json');
