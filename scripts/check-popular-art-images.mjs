import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read artworks data
const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
const artworksContent = fs.readFileSync(artworksPath, 'utf-8');

// Read popular categories
const popularCategoriesPath = path.join(__dirname, '..', 'data', 'popularCategories.ts');
const popularContent = fs.readFileSync(popularCategoriesPath, 'utf-8');

// Extract ARTWORKS array from artworks.ts
const artworksMatch = artworksContent.match(/export const ARTWORKS[^=]*=\s*(\[[\s\S]*?\n\]);/);
if (!artworksMatch) {
  console.error('Could not find ARTWORKS array');
  process.exit(1);
}

// Parse the artworks (simple eval approach)
const artworksArrayStr = artworksMatch[1];
const ARTWORKS = eval(artworksArrayStr);

console.log(`\nTotal artworks: ${ARTWORKS.length}`);

// Get all popular category slugs
const categoryMapMatch = popularContent.match(/export const POPULAR_CATEGORY_MAP[^=]*=\s*({[\s\S]*?\n};)/);
const categories = ['monet', 'klimt', 'matisse', 'van-gogh', 'picasso', 'da-vinci', 'portraits', 'still-lifes', 'landscapes'];

// Helper function to get artwork slug
function generateSlug(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getArtworkSlug(artwork) {
  if (artwork.slug) return artwork.slug;
  const artistSlug = generateSlug(artwork.artist || '');
  const titleSlug = generateSlug(artwork.title || '');
  return `${artistSlug}-${titleSlug}`;
}

// Get artworks for each category
function byArtist(nameFragment) {
  const frag = nameFragment.toLowerCase();
  return ARTWORKS.filter((a) => (a.artist || '').toLowerCase().includes(frag));
}

function byTitleKeywords(...keywords) {
  const keys = keywords.map((k) => k.toLowerCase());
  return ARTWORKS.filter((a) => {
    const t = (a.title || '').toLowerCase();
    return keys.some((k) => t.includes(k));
  });
}

const categoryArtworks = {
  'monet': byArtist('monet'),
  'klimt': byArtist('klimt'),
  'matisse': byArtist('matisse'),
  'van-gogh': byArtist('van gogh'),
  'picasso': byArtist('picasso'),
  'da-vinci': byArtist('leonardo'),
  'portraits': byTitleKeywords('portrait', 'portrait of'),
  'still-lifes': byTitleKeywords('still life', 'still-life', 'stilllife', 'still'),
  'landscapes': ARTWORKS.filter((a) => {
    const t = (a.title || '').toLowerCase();
    const kws = ['landscape', 'valley', 'sea', 'view', 'nile', 'bay', 'river', 'field', 'sunrise', 'wheat', 'beach', 'shore', 'harbor', 'yosemite'];
    return kws.some((k) => t.includes(k));
  }),
};

// Get all image files from public/image directory
const publicImagePath = path.join(__dirname, '..', 'public', 'image');
const allImageFiles = [];

function scanDirectory(dir, prefix = '') {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        scanDirectory(path.join(dir, entry.name), prefix + entry.name + '/');
      } else if (entry.isFile() && /\.(jpg|jpeg|png|webp|gif)$/i.test(entry.name)) {
        allImageFiles.push({
          fullPath: path.join(dir, entry.name),
          relativePath: '/image/' + prefix + entry.name,
          name: entry.name.toLowerCase(),
        });
      }
    }
  } catch (err) {
    // Directory doesn't exist or can't be read
  }
}

scanDirectory(publicImagePath);
console.log(`\nTotal image files found: ${allImageFiles.length}`);

// Check each category
console.log('\n========================================');
console.log('POPULAR ART CATEGORIES - IMAGE CHECK');
console.log('========================================\n');

let totalMissing = 0;
let totalFound = 0;
const missingImages = [];
const suggestions = [];

for (const [category, artworks] of Object.entries(categoryArtworks)) {
  console.log(`\n--- ${category.toUpperCase()} (${artworks.length} artworks) ---`);
  
  let categoryMissing = 0;
  let categoryFound = 0;
  
  for (const artwork of artworks) {
    const imagePath = artwork.image;
    const fullPath = path.join(__dirname, '..', 'public', imagePath);
    
    if (!fs.existsSync(fullPath)) {
      categoryMissing++;
      totalMissing++;
      
      console.log(`\n❌ MISSING: ${artwork.title} by ${artwork.artist}`);
      console.log(`   Expected: ${imagePath}`);
      console.log(`   Slug: ${getArtworkSlug(artwork)}`);
      
      missingImages.push({
        category,
        title: artwork.title,
        artist: artwork.artist,
        expectedPath: imagePath,
        slug: getArtworkSlug(artwork),
      });
      
      // Try to find similar image files
      const titleWords = generateSlug(artwork.title || '').split('-').filter(w => w.length > 3);
      const artistWords = generateSlug(artwork.artist || '').split('-').filter(w => w.length > 3);
      const searchWords = [...titleWords, ...artistWords];
      
      const matches = allImageFiles.filter(img => {
        const imgNameLower = img.name.toLowerCase();
        return searchWords.some(word => imgNameLower.includes(word));
      });
      
      if (matches.length > 0) {
        console.log(`   Possible matches found:`);
        matches.slice(0, 5).forEach(match => {
          console.log(`     • ${match.relativePath}`);
          suggestions.push({
            artwork: `${artwork.title} by ${artwork.artist}`,
            expectedPath: imagePath,
            suggestedPath: match.relativePath,
            slug: getArtworkSlug(artwork),
          });
        });
      } else {
        console.log(`   No similar images found in directory`);
      }
    } else {
      categoryFound++;
      totalFound++;
    }
  }
  
  console.log(`\n✓ Found: ${categoryFound}, ❌ Missing: ${categoryMissing}`);
}

// Summary
console.log('\n========================================');
console.log('SUMMARY');
console.log('========================================\n');
console.log(`Total artworks checked: ${totalFound + totalMissing}`);
console.log(`✓ Images found: ${totalFound}`);
console.log(`❌ Images missing: ${totalMissing}`);

if (suggestions.length > 0) {
  console.log('\n========================================');
  console.log('SUGGESTED FIXES');
  console.log('========================================\n');
  
  // Group suggestions by artwork
  const grouped = {};
  for (const sugg of suggestions) {
    if (!grouped[sugg.artwork]) {
      grouped[sugg.artwork] = sugg;
    }
  }
  
  for (const [artwork, sugg] of Object.entries(grouped)) {
    console.log(`\nArtwork: ${artwork}`);
    console.log(`  Slug: ${sugg.slug}`);
    console.log(`  Expected: ${sugg.expectedPath}`);
    console.log(`  Suggested: ${sugg.suggestedPath}`);
  }
}

console.log('\n========================================\n');
