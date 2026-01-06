import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read artworks data
const artworksPath = path.join(__dirname, '..', 'data', 'artworks.ts');
const artworksContent = fs.readFileSync(artworksPath, 'utf-8');

// Extract ARTWORKS array
const artworksMatch = artworksContent.match(/export const ARTWORKS[^=]*=\s*(\[[\s\S]*?\n\]);/);
const ARTWORKS = eval(artworksMatch[1]);

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

const monet = byArtist('monet');
const vanGogh = byArtist('van gogh');

// Get all image files
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
    // Directory doesn't exist
  }
}

scanDirectory(publicImagePath);

console.log('========================================');
console.log('MISSING IMAGES - DETAILED ANALYSIS');
console.log('========================================\n');

function analyzeMissing(artworks, categoryName) {
  console.log(`\n--- ${categoryName} ---\n`);
  
  const missing = [];
  for (const artwork of artworks) {
    const imagePath = artwork.image;
    const fullPath = path.join(__dirname, '..', 'public', imagePath);
    
    if (!fs.existsSync(fullPath)) {
      missing.push({
        title: artwork.title,
        artist: artwork.artist,
        expectedPath: imagePath,
        slug: getArtworkSlug(artwork),
      });
    }
  }
  
  for (const item of missing) {
    console.log(`Title: ${item.title}`);
    console.log(`Expected: ${item.expectedPath}`);
    
    // Search for similar filenames
    const titleWords = generateSlug(item.title).split('-').filter(w => w.length > 3);
    const searchWords = titleWords.slice(0, 4); // Use first 4 significant words
    
    const matches = allImageFiles.filter(img => {
      const imgNameLower = img.name.toLowerCase();
      return searchWords.length > 0 && searchWords.every(word => imgNameLower.includes(word));
    });
    
    if (matches.length > 0) {
      console.log(`Exact/Close matches:`);
      matches.forEach(match => {
        console.log(`  ✓ ${match.relativePath}`);
      });
    } else {
      // Try partial matches
      const partialMatches = allImageFiles.filter(img => {
        const imgNameLower = img.name.toLowerCase();
        return searchWords.length > 0 && searchWords.some(word => imgNameLower.includes(word));
      });
      
      if (partialMatches.length > 0 && partialMatches.length < 10) {
        console.log(`Partial matches:`);
        partialMatches.slice(0, 5).forEach(match => {
          console.log(`  ? ${match.relativePath}`);
        });
      } else {
        console.log(`  ✗ No matches found`);
      }
    }
    console.log('');
  }
  
  return missing.length;
}

const monetMissing = analyzeMissing(monet, 'MONET');
const vanGoghMissing = analyzeMissing(vanGogh, 'VAN GOGH');

console.log('\n========================================');
console.log(`Monet Missing: ${monetMissing}`);
console.log(`Van Gogh Missing: ${vanGoghMissing}`);
console.log('========================================\n');
