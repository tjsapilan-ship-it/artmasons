const fs = require('fs');
const path = require('path');

// Read all image files
function getAllImages() {
  const imageDir = path.join(__dirname, '..', 'public', 'image');
  const images = new Map();
  
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  
  for (const letter of letters) {
    const letterDir = path.join(imageDir, letter);
    if (fs.existsSync(letterDir)) {
      try {
        const files = fs.readdirSync(letterDir);
        for (const file of files) {
          if (file.endsWith('.jpg') || file.endsWith('.png')) {
            const imagePath = `/image/${letter}/${file}`;
            const normalizedName = file.toLowerCase().replace(/\.(jpg|png)$/, '');
            images.set(imagePath.toLowerCase(), { path: imagePath, normalizedName });
          }
        }
      } catch (e) {}
    }
  }
  
  return images;
}

// Extract artworks from output files
function getArtworksFromOutputFiles() {
  const scriptsDir = __dirname;
  const allArtworks = [];
  
  const files = fs.readdirSync(scriptsDir).filter(f => f.match(/^[a-z]_artworks_output\.ts$/));
  
  for (const file of files) {
    const filePath = path.join(scriptsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract title entries
    const titleRegex = /title:\s*["']([^"']+)["']/g;
    let match;
    while ((match = titleRegex.exec(content)) !== null) {
      allArtworks.push({
        title: match[1],
        source: file.charAt(0).toUpperCase()
      });
    }
  }
  
  return allArtworks;
}

// Read current artworks.ts
function getCurrentArtworks() {
  const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
  const content = fs.readFileSync(artworksPath, 'utf8');
  
  const artworks = [];
  
  // Match artwork entries
  const regex = /\{\s*title:\s*["']([^"']+)["'][^}]*image:\s*["']([^"']+)["'][^}]*\}/gs;
  let match;
  while ((match = regex.exec(content)) !== null) {
    artworks.push({
      title: match[1],
      image: match[2]
    });
  }
  
  return artworks;
}

// Read all artwork titles from the _output.ts files (these are from PDFs)
function getPDFArtworkTitles() {
  const scriptsDir = __dirname;
  const titles = new Set();
  
  const files = fs.readdirSync(scriptsDir).filter(f => f.match(/^[a-z]_artworks_output\.ts$/));
  
  for (const file of files) {
    const filePath = path.join(scriptsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const titleRegex = /title:\s*["']([^"']+)["']/g;
    let match;
    while ((match = titleRegex.exec(content)) !== null) {
      titles.add(match[1].toLowerCase().trim());
    }
  }
  
  return titles;
}

// Main analysis
console.log('='.repeat(80));
console.log('ARTWORK VALIDATION ANALYSIS');
console.log('='.repeat(80));
console.log();

const images = getAllImages();
console.log(`Total images found in public/image: ${images.size}`);

const pdfTitles = getPDFArtworkTitles();
console.log(`Total artwork titles from PDF output files: ${pdfTitles.size}`);

const currentArtworks = getCurrentArtworks();
console.log(`Total artworks in artworks.ts: ${currentArtworks.length}`);

console.log();
console.log('='.repeat(80));
console.log('ARTWORKS IN artworks.ts BUT NOT IN PDF OUTPUT FILES (TO REMOVE)');
console.log('='.repeat(80));

const toRemove = [];
for (const artwork of currentArtworks) {
  const normalizedTitle = artwork.title.toLowerCase().trim();
  if (!pdfTitles.has(normalizedTitle)) {
    // Double check if image exists
    const hasImage = images.has(artwork.image.toLowerCase());
    toRemove.push({ ...artwork, hasImage });
  }
}

console.log(`\nFound ${toRemove.length} artworks to potentially remove:\n`);
toRemove.forEach((a, i) => {
  console.log(`${i + 1}. "${a.title}" (image: ${a.hasImage ? 'EXISTS' : 'MISSING'}) - ${a.image}`);
});

console.log();
console.log('='.repeat(80));
console.log('ARTWORKS IN PDF OUTPUT FILES BUT MISSING IMAGE');
console.log('='.repeat(80));

const pdfArtworks = getArtworksFromOutputFiles();
const missingImages = [];

for (const artwork of pdfArtworks) {
  // Check if any image matches
  const normalizedTitle = artwork.title.toLowerCase().trim();
  let found = false;
  
  for (const [imgPath, imgData] of images) {
    if (imgData.normalizedName === normalizedTitle || 
        imgData.normalizedName.includes(normalizedTitle) ||
        normalizedTitle.includes(imgData.normalizedName)) {
      found = true;
      break;
    }
  }
  
  if (!found) {
    // Check in current artworks if there's an image path for it
    const current = currentArtworks.find(a => a.title.toLowerCase() === normalizedTitle);
    if (current) {
      const hasImage = images.has(current.image.toLowerCase());
      if (!hasImage) {
        missingImages.push({
          title: artwork.title,
          source: artwork.source,
          expectedImage: current.image
        });
      }
    } else {
      missingImages.push({
        title: artwork.title,
        source: artwork.source,
        expectedImage: 'NOT IN ARTWORKS.TS'
      });
    }
  }
}

console.log(`\nFound ${missingImages.length} artworks from PDFs with missing images:\n`);
missingImages.forEach((a, i) => {
  console.log(`${i + 1}. [${a.source}] "${a.title}" - ${a.expectedImage}`);
});

// Check which images in artworks.ts actually exist
console.log();
console.log('='.repeat(80));
console.log('ARTWORKS IN artworks.ts WITH MISSING IMAGES');
console.log('='.repeat(80));

const artworksWithMissingImages = [];
for (const artwork of currentArtworks) {
  const hasImage = images.has(artwork.image.toLowerCase());
  if (!hasImage) {
    artworksWithMissingImages.push(artwork);
  }
}

console.log(`\nFound ${artworksWithMissingImages.length} artworks with missing images:\n`);
artworksWithMissingImages.forEach((a, i) => {
  console.log(`${i + 1}. "${a.title}" - ${a.image}`);
});

// Summary
console.log();
console.log('='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`Total images: ${images.size}`);
console.log(`PDF output titles: ${pdfTitles.size}`);
console.log(`Current artworks.ts entries: ${currentArtworks.length}`);
console.log(`Artworks to remove (not in PDFs): ${toRemove.length}`);
console.log(`Artworks with missing images: ${artworksWithMissingImages.length}`);

// Write report
const report = {
  summary: {
    totalImages: images.size,
    pdfTitles: pdfTitles.size,
    currentArtworks: currentArtworks.length,
    toRemove: toRemove.length,
    missingImages: artworksWithMissingImages.length
  },
  toRemove,
  missingImages: artworksWithMissingImages
};

fs.writeFileSync(
  path.join(__dirname, 'validation_report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\nReport saved to scripts/validation_report.json');
