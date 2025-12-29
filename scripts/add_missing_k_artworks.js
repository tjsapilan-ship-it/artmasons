const fs = require('fs');

// Missing artworks to add based on image files in /public/image/k/
const missingArtworks = [
  // Frida Kahlo artworks
  {
    title: "A Few Small Nips (Passionately In Love)",
    year: "1935",
    originalSize: "30 x 40 cm",
    artist: "Frida Kahlo",
    artistLife: "1907-1954",
    image: "/image/k/a few small nips (passionately in love).jpg",
  },
  {
    title: "Roots",
    year: "1943",
    originalSize: "30 x 50 cm",
    artist: "Frida Kahlo",
    artistLife: "1907-1954",
    image: "/image/k/roots.jpg",
  },
  {
    title: "Self Portrait In Velvet",
    year: "1926",
    originalSize: "80 x 60 cm",
    artist: "Frida Kahlo",
    artistLife: "1907-1954",
    image: "/image/k/self portrait in velvet.jpg",
  },
  {
    title: "Self Portrait With A Monkey",
    year: "1938",
    originalSize: "40 x 30 cm",
    artist: "Frida Kahlo",
    artistLife: "1907-1954",
    image: "/image/k/self portrait with a monkey.jpg",
  },
  {
    title: "The Suicide Of Dorothy Hale",
    year: "1939",
    originalSize: "60 x 48 cm",
    artist: "Frida Kahlo",
    artistLife: "1907-1954",
    image: "/image/k/the suicide of dorothy hale.jpg",
  },
  {
    title: "Marxism Will Give Health To The Sick",
    year: "1954",
    originalSize: "76 x 61 cm",
    artist: "Frida Kahlo",
    artistLife: "1907-1954",
    image: "/image/k/mrxism will give health to the sick.jpg",
  },
  
  // Gustav Klimt artworks
  {
    title: "Expectation",
    year: "1905",
    originalSize: "193 x 115 cm",
    artist: "Gustav Klimt",
    artistLife: "1862-1918",
    image: "/image/k/expectation.jpg",
  },
  {
    title: "Lady With A Fan",
    year: "1917",
    originalSize: "100 x 100 cm",
    artist: "Gustav Klimt",
    artistLife: "1862-1918",
    image: "/image/k/lady with a fan.jpg",
  },
  {
    title: "Lady With A Hat And Featherboa",
    year: "1909",
    originalSize: "69 x 55 cm",
    artist: "Gustav Klimt",
    artistLife: "1862-1918",
    image: "/image/k/lady with a hat and featherboa.jpg",
  },
  {
    title: "Nuda Veritas",
    year: "1899",
    originalSize: "252 x 56 cm",
    artist: "Gustav Klimt",
    artistLife: "1862-1918",
    image: "/image/k/nuda veritas.jpg",
  },
  {
    title: "Portrait Of Adele Bloch-Bauer II",
    year: "1912",
    originalSize: "190 x 120 cm",
    artist: "Gustav Klimt",
    artistLife: "1862-1918",
    image: "/image/k/portrait of adele bloch-bauer ii.jpg",
  },
  {
    title: "Ria Munk On Her Death Bed",
    year: "1912",
    originalSize: "50 x 50 cm",
    artist: "Gustav Klimt",
    artistLife: "1862-1918",
    image: "/image/k/ria munk on her death bed.jpg",
  },
  {
    title: "The Polecat Fur",
    year: "1916",
    originalSize: "140 x 80 cm",
    artist: "Gustav Klimt",
    artistLife: "1862-1918",
    image: "/image/k/the polecat fur.jpg",
  },
  {
    title: "The Sunflower",
    year: "1907",
    originalSize: "110 x 110 cm",
    artist: "Gustav Klimt",
    artistLife: "1862-1918",
    image: "/image/k/the sunflower.jpg",
  },
  {
    title: "The Virgins",
    year: "1913",
    originalSize: "190 x 200 cm",
    artist: "Gustav Klimt",
    artistLife: "1862-1918",
    image: "/image/k/the virgins.jpg",
  },
  {
    title: "University Of Vienna Ceiling (Medicine) Detail Showing Hygieia",
    year: "1901",
    originalSize: "430 x 300 cm",
    artist: "Gustav Klimt",
    artistLife: "1862-1918",
    image: "/image/k/university of vienna ceiling (medicine) detail showing hygiiegia.jpg",
  },
  
  // Paul Klee artworks
  {
    title: "Senecio",
    year: "1922",
    originalSize: "40 x 38 cm",
    artist: "Paul Klee",
    artistLife: "1879-1940",
    image: "/image/k/senicio.jpg",
  },
  {
    title: "Flower Myth",
    year: "1918",
    originalSize: "29 x 15 cm",
    artist: "Paul Klee",
    artistLife: "1879-1940",
    image: "/image/k/flower myth.jpg",
  },
  {
    title: "Landscape With Setting Sun",
    year: "1919",
    originalSize: "21 x 29 cm",
    artist: "Paul Klee",
    artistLife: "1879-1940",
    image: "/image/k/landscape with sunset.jpg",
  },
  {
    title: "With The Setting Sun",
    year: "1919",
    originalSize: "21 x 29 cm",
    artist: "Paul Klee",
    artistLife: "1879-1940",
    image: "/image/k/with the setting sun.jpg",
  },
  {
    title: "Struck From The List",
    year: "1933",
    originalSize: "31 x 24 cm",
    artist: "Paul Klee",
    artistLife: "1879-1940",
    image: "/image/k/struck from the list.jpg",
  },
  
  // Kandinsky - also fixing existing misspellings
  {
    title: "Bavarian Landscape With A Church",
    year: "1907",
    originalSize: "55 x 74 cm",
    artist: "Wassily Kandinsky",
    artistLife: "1866-1944",
    image: "/image/k/bavarian landscape with a church.jpg",
  },
  
  // Nikolay Kermov - fixing image paths
  {
    title: "Untitled (The Edge Of Tomorrow)",
    year: "Unknown",
    originalSize: "16.9 x 11.5 cm",
    artist: "Nikolay Kermov",
    artistLife: "b.1976",
    image: "/image/k/untitled (the edge of tomorrow).jpg",
  },
  {
    title: "Untitled V (Resurrection)",
    year: "Unknown",
    originalSize: "22.8 x 17.4 cm",
    artist: "Nikolay Kermov",
    artistLife: "b.1976",
    image: "/image/k/untitled V (resurrection).jpg",
  },
  
  // Peter Severin Kroyer - fixing image path
  {
    title: "Hip Hip Hooray Artist Festival At Skagen",
    year: "1888",
    originalSize: "134.4 x 165.5 cm",
    artist: "Peter Severin Kroyer",
    artistLife: "1851-1909",
    image: "/image/k/hip hip hooray artist festival at skagen.jpg",
  },
  
  // Winter Landcape (different image - typo in filename)
  {
    title: "Winter Landcape",
    year: "1909",
    originalSize: "75.5 x 97.5 cm",
    artist: "Wassily Kandinsky",
    artistLife: "1866-1944",
    image: "/image/k/winter landcape.jpg",
  },
];

console.log('Generating artwork entries...\n');

// Get the current highest SKU number
const artworksContent = fs.readFileSync('./data/artworks.ts', 'utf-8');
const skuMatches = artworksContent.match(/sku: "AM-K-(\d+)"/g) || [];
const skuNumbers = skuMatches.map(s => {
  const match = s.match(/AM-K-(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
});
let nextSku = Math.max(...skuNumbers) + 1;

console.log('Current highest K SKU:', Math.max(...skuNumbers));
console.log('Starting from SKU:', nextSku);
console.log('');

// Generate TypeScript entries
const entries = missingArtworks.map(art => {
  const sizeMatch = art.originalSize.match(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/);
  const width = sizeMatch ? parseFloat(sizeMatch[1]) : 50;
  const height = sizeMatch ? parseFloat(sizeMatch[2]) : 50;
  const basePrice = Math.round(width * height * 1.08);
  const skuNum = String(nextSku++).padStart(3, '0');
  
  return `  {
    title: "${art.title}",
    year: "${art.year}",
    originalSize: "${art.originalSize}",
    artist: "${art.artist}",
    artistLife: "${art.artistLife}",
    sku: "AM-K-${skuNum}",
    basePrice: ${basePrice},
    currency: "AED",
    image: "${art.image}",
    options: [{ id: 'opt1', width: ${width}, height: ${height}, price: ${basePrice}, label: 'Original Size' }],
  },`;
}).join('\n\n');

console.log('Generated entries:');
console.log(entries);

// Save to file
fs.writeFileSync('./scripts/k_new_entries.txt', entries);
console.log('\nSaved to scripts/k_new_entries.txt');
