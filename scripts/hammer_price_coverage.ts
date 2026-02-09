import { ARTWORKS } from '../data/artworks';

console.log('Hammer Price Coverage Report\n');
console.log('='.repeat(60));

const withHammerPrice = ARTWORKS.filter(art => art.hammerPrice);
const withoutHammerPrice = ARTWORKS.filter(art => !art.hammerPrice);

console.log(`Total artworks: ${ARTWORKS.length}`);
console.log(`With hammer prices: ${withHammerPrice.length}`);
console.log(`Without hammer prices: ${withoutHammerPrice.length}`);
console.log(`Coverage: ${((withHammerPrice.length / ARTWORKS.length) * 100).toFixed(2)}%`);

console.log('\n' + '='.repeat(60));
console.log('\nSample artworks with hammer prices:');
console.log('='.repeat(60));

withHammerPrice.slice(0, 20).forEach(art => {
  console.log(`${art.name} by ${art.artist}: ${art.hammerPrice}`);
});

console.log('\n' + '='.repeat(60));
console.log('\nKey verification (from HAMMER PRICE.txt):');
console.log('='.repeat(60));

const keyArtworks = [
  { name: 'Starry Night', expected: '$800M - $1 Billion' },
  { name: 'Irises', expected: '$450M - $600M' },
  { name: 'Portrait Of Adele Bloch-Bauer I', expected: '$350M - $450M' },
  { name: 'The Scream', expected: '$800M' },
  { name: 'Olympia', expected: '$400M - $500M' }
];

keyArtworks.forEach(({ name, expected }) => {
  const art = ARTWORKS.find(a => a.name === name);
  if (art && art.hammerPrice) {
    const match = art.hammerPrice === expected ? '✓' : '✗';
    console.log(`${match} ${name}: ${art.hammerPrice} ${match === '✓' ? '' : `(expected: ${expected})`}`);
  } else {
    console.log(`✗ ${name}: Not found or no hammer price`);
  }
});
