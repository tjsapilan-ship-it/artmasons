import { ARTWORKS, POPULAR_ARTWORKS, getArtworkSlug, generateSlug } from '../data/artworks';
import { POPULAR_CATEGORY_MAP } from '../data/popularCategories';

console.log('=== Slug Generation Test ===\n');

// Test 1: Check ARTWORKS is properly combined
console.log('Test 1: Array Structure');
console.log(`  Total ARTWORKS: ${ARTWORKS.length}`);
console.log(`  POPULAR_ARTWORKS: ${POPULAR_ARTWORKS.length}`);
console.log(`  Expected: 984 total (309 popular + 675 regular)`);

// Test 2: Check if the first popular artwork is in the combined array
const firstPopular = POPULAR_ARTWORKS[0];
console.log('\nTest 2: First Popular Artwork');
console.log(`  Title: ${firstPopular.title}`);
console.log(`  Artist: ${firstPopular.artist}`);

// Test 3: Try to get slug for artwork from POPULAR_ARTWORKS
console.log('\nTest 3: Slug from POPULAR_ARTWORKS');
const slug1 = getArtworkSlug(firstPopular);
console.log(`  Slug: ${slug1}`);
console.log(`  ${slug1 && slug1.length > 0 ? '✅' : '❌'} Slug generated`);

// Test 4: Try to get slug for artwork from combined ARTWORKS
console.log('\nTest 4: Slug from combined ARTWORKS');
const firstCombined = ARTWORKS[0];
console.log(`  Title: ${firstCombined.title}`);
console.log(`  Artist: ${firstCombined.artist}`);
const slug2 = getArtworkSlug(firstCombined);
console.log(`  Slug: ${slug2}`);
console.log(`  ${slug2 && slug2.length > 0 ? '✅' : '❌'} Slug generated`);

// Test 5: Check if they're the same object reference
console.log('\nTest 5: Object Reference Check');
console.log(`  Same reference? ${firstPopular === firstCombined ? 'YES' : 'NO'}`);
console.log(`  Same content? ${firstPopular.title === firstCombined.title && firstPopular.artist === firstCombined.artist ? 'YES' : 'NO'}`);

// Test 6: Check popular category slugs
console.log('\nTest 6: Popular Category Map');
const monetSlugs = POPULAR_CATEGORY_MAP['monet'] || [];
console.log(`  Monet category: ${monetSlugs.length} slugs`);
if (monetSlugs.length > 0) {
  console.log(`  First 3 slugs: ${monetSlugs.slice(0, 3).join(', ')}`);
  console.log(`  ${monetSlugs.every(s => s && s.length > 0) ? '✅' : '❌'} All slugs valid`);
} else {
  console.log('  ❌ No slugs found!');
}

// Test 7: Check all categories
console.log('\nTest 7: All Category Slugs');
for (const [category, slugs] of Object.entries(POPULAR_CATEGORY_MAP)) {
  const valid = Array.isArray(slugs) && slugs.length > 0 && slugs.every(s => s && s.length > 0);
  console.log(`  ${category}: ${slugs.length} slugs - ${valid ? '✅' : '❌'}`);
}

console.log('\n=== End of Test ===');
