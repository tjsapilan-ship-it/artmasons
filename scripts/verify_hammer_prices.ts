import { ARTWORKS } from '../data/artworks';

const checks = [
  ['starry-night', '$800M - $1 Billion'],
  ['irises', '$450M - $600M'],
  ['the-girl-with-a-pearl-earring', '$750M - $1 Billion'],
  ['the-kiss', '$600M - $800M'],
  ['portrait-of-adele-bloch-bauer-i', '$350M - $450M'],
  ['mona-lisa', '$1 Billion - $2 Billion'],
  ['the-scream', '$800M'],
  ['the-birth-of-venus', '$800M - $1 Billion'],
  ['olympia', '$400M - $500M'],
  ['the-japanese-bridge-pond-with-water-lilies', '$90M - $110M']
];

let correct = 0;
let incorrect = 0;

console.log('Verifying Hammer Prices:\n');

checks.forEach(([slug, expected]) => {
  const art = ARTWORKS.find(a => a.slug === slug);
  if (art) {
    if (art.hammerPrice === expected) {
      console.log(`✓ ${art.name}: ${art.hammerPrice}`);
      correct++;
    } else {
      console.log(`✗ ${art.name}: Got '${art.hammerPrice || 'NO PRICE'}' but expected '${expected}'`);
      incorrect++;
    }
  } else {
    console.log(`✗ ${slug}: Not found in ARTWORKS`);
    incorrect++;
  }
});

console.log(`\n${'='.repeat(60)}`);
console.log(`Results: ${correct} correct, ${incorrect} incorrect`);
console.log(`${'='.repeat(60)}`);

if (correct === checks.length) {
  console.log('\n✓ All hammer prices are correct!');
} else {
  console.log('\n✗ Some hammer prices are still incorrect.');
}
