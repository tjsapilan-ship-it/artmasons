import { ARTWORKS } from '../data/artworks';

console.log('Popular Art Hammer Price Verification\n');
console.log('='.repeat(80));

// Test specific artworks that were incorrect
const tests = [
  { name: 'Water Lilies', slug: 'water-lilies', expected: '$20 - $30 M' },
  { name: 'The Japanese Bridge', slug: 'the-japanese-bridge-pond-with-water-lilies', expected: '$20 - $70 M' },
  { name: 'Hay Stacks, Sun In The Mist', slug: 'hay-stacks-sun-in-the-mist', expected: '$115 - $130M' },
  { name: 'The Hunt', slug: 'the-hunt', expected: '$110M' },
  { name: 'The Houses Of Parliament Sunset', slug: 'the-houses-of-parliament-sunset', expected: '$60 - $100M' },
  { name: 'Portrait Of Adele Bloch-Bauer I', slug: 'portrait-of-adele-bloch-bauer-i', expected: '$250 - $350 M' },
  { name: 'Judith I', slug: 'judith-i', expected: '$300 M' },
  { name: 'The Dance', slug: 'the-dance', expected: '$150 - $200 M' },
  { name: 'The Red Room, Harmony In Red', slug: 'the-red-room-harmony-in-red', expected: '$350 - $450 M' },
  { name: 'Goldfish', slug: 'goldfish', expected: '$250 - $350 M' },
];

// Test new additions
const newTests = [
  { name: 'Grand Canal', slug: 'grand-canal', expected: '$56.6 M' },
  { name: 'Near Monte Carlo', slug: 'near-monte-carlo', expected: '$60 - $100M' },
  { name: 'Waterloo Bridge Gray Day', slug: 'waterloo-bridge-gray-day', expected: '$60 - $70M' },
];

let correct = 0;
let incorrect = 0;
let missing = 0;

console.log('CORRECTED PRICES (previously wrong):');
console.log('='.repeat(80));
tests.forEach(test => {
  const artwork = ARTWORKS.find(a => a.slug === test.slug);
  if (!artwork) {
    console.log(`✗ ${test.name}: NOT FOUND`);
    missing++;
  } else if (!artwork.hammerPrice) {
    console.log(`✗ ${test.name}: NO HAMMER PRICE`);
    missing++;
  } else if (artwork.hammerPrice === test.expected) {
    console.log(`✓ ${test.name}: ${artwork.hammerPrice}`);
    correct++;
  } else {
    console.log(`✗ ${test.name}: Got '${artwork.hammerPrice}' but expected '${test.expected}'`);
    incorrect++;
  }
});

console.log('\n' + '='.repeat(80));
console.log('NEWLY ADDED PRICES (previously missing):');
console.log('='.repeat(80));
newTests.forEach(test => {
  const artwork = ARTWORKS.find(a => a.slug === test.slug);
  if (!artwork) {
    console.log(`✗ ${test.name}: NOT FOUND IN DATABASE`);
    missing++;
  } else if (!artwork.hammerPrice) {
    console.log(`✗ ${test.name}: NO HAMMER PRICE`);
    missing++;
  } else if (artwork.hammerPrice === test.expected) {
    console.log(`✓ ${test.name}: ${artwork.hammerPrice}`);
    correct++;
  } else {
    console.log(`✗ ${test.name}: Got '${artwork.hammerPrice}' but expected '${test.expected}'`);
    incorrect++;
  }
});

console.log('\n' + '='.repeat(80));
console.log('RESULTS:');
console.log('='.repeat(80));
console.log(`✓ Correct: ${correct}`);
console.log(`✗ Incorrect: ${incorrect}`);
console.log(`✗ Missing: ${missing}`);

if (correct === tests.length + newTests.length) {
  console.log('\n✓ All Popular Art hammer prices are now correct!');
} else {
  console.log('\n⚠️  Some hammer prices still need attention.');
}

// Overall stats
const artworksWithHammerPrice = ARTWORKS.filter(a => a.hammerPrice);
console.log('\n' + '='.repeat(80));
console.log('OVERALL STATISTICS:');
console.log('='.repeat(80));
console.log(`Total artworks: ${ARTWORKS.length}`);
console.log(`With hammer prices: ${artworksWithHammerPrice.length}`);
console.log(`Coverage: ${((artworksWithHammerPrice.length / ARTWORKS.length) * 100).toFixed(2)}%`);
