const fs = require('fs');
const pdf = require('pdf-parse');

// Function to convert title to image filename
function titleToFilename(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Function to calculate price based on dimensions
function calculatePrice(width, height) {
  const area = width * height;
  if (area <= 2000) return 1200;
  if (area <= 4000) return 3000;
  if (area <= 6000) return 5000;
  if (area <= 8000) return 7000;
  if (area <= 10000) return 9000;
  if (area <= 15000) return 12000;
  if (area <= 20000) return 15000;
  return Math.ceil(area / 1000) * 800;
}

(async () => {
  const dataBuffer = fs.readFileSync('data/ART_DETAILS_D.pdf');
  const data = await pdf(dataBuffer);
  const text = data.text;

  console.log('Extracted text from PDF:');
  console.log(text);
  console.log('\n===================\n');

  // Get list of available images
  const imageFiles = fs.readdirSync('public/image/d/').filter(f => f.endsWith('.jpg') || f.endsWith('.webp'));
  console.log('Available images:', imageFiles);
  console.log('\n===================\n');

  // Manual parsing based on the PDF structure - exact data from ART_DETAILS_D.pdf
  const entries = [
    // Leonardo Da Vinci
    { title: "Mona Lisa (La Gioconda)", artist: "Leonardo Da Vinci", year: "1503-1519", width: 77, height: 53, price: 4081, artistLife: "1452-1519", image: "mona lisa (la gioconda).jpg" },
    { title: "The Last Supper", artist: "Leonardo Da Vinci", year: "1495-1498", width: 460, height: 880, price: 324800, artistLife: "1452-1519", image: "the last supper.jpg" },
    { title: "Lady With An Emine (Cecilia Gallerani)", artist: "Leonardo Da Vinci", year: "1489-1491", width: 54.8, height: 40.3, price: 2208, artistLife: "1452-1519", image: "lady with an emine (cecilia gallerani).jpg" },
    { title: "Virgin And Child With St Anne", artist: "Leonardo Da Vinci", year: "1503-1519", width: 168, height: 130, price: 21840, artistLife: "1452-1519", image: "virgin and child with st anne.jpg" },
    { title: "St John The Baptist", artist: "Leonardo Da Vinci", year: "1513-1516", width: 69, height: 57, price: 3933, artistLife: "1452-1519", image: "st john the baptist.jpg" },
    { title: "The Virgin On The Rocks", artist: "Leonardo Da Vinci", year: "1483-1486", width: 189.5, height: 120, price: 22740, artistLife: "1452-1519", image: "the virgin on the rocks.jpg" },

    // Jacques-Louis David
    { title: "Death Of Marat", artist: "Jacques-Louis David", year: "1793", width: 165, height: 128, price: 21120, artistLife: "1748-1825", image: "death of marat.jpg" },
    { title: "The Death Of Socrates", artist: "Jacques-Louis David", year: "1787", width: 129.5, height: 196.2, price: 25409, artistLife: "1748-1825", image: "the death of socrates.jpg" },
    { title: "The Coronation Of Napoleon", artist: "Jacques-Louis David", year: "1805-1807", width: 621, height: 979, price: 608059, artistLife: "1748-1825", image: "the coronation of napoleon.jpg" },
    { title: "Lictors Bearing To Brutus The Bodies Of His Sons", artist: "Jacques-Louis David", year: "1789", width: 323, height: 422, price: 136306, artistLife: "1748-1825", image: "lictors bearing to brutus the bodies of his sons.jpg" },
    { title: "Emporer Napoleon I", artist: "Jacques-Louis David", year: "1812", width: 203.9, height: 125.1, price: 25508, artistLife: "1748-1825", image: "emporer napoleon I.jpg" },
    { title: "The Emporer Napoleon In His Study At The Tuileries", artist: "Jacques-Louis David", year: "1812", width: 203.9, height: 125.1, price: 25508, artistLife: "1748-1825", image: "the emporer napoleon in his study at the tuileries.jpg" },
    { title: "Mars Disarmed By Venues And The Three Graces", artist: "Jacques-Louis David", year: "1824", width: 308, height: 265, price: 81620, artistLife: "1748-1825", image: "mars disarmed by venues and the three graces.jpg" },
    { title: "Pompee And Florissant The Dogs Of Lois XV", artist: "Jacques-Louis David", year: "1809", width: 174.6, height: 259.7, price: 45344, artistLife: "1748-1825", image: "pompee and florissant the dogs of lois XV.jpg" },

    // Edgar Degas
    { title: "The Ballet Class", artist: "Edgar Degas", year: "1871-1874", width: 85, height: 75, price: 6375, artistLife: "1834-1917", image: "the ballet class.jpg" },
    { title: "Dancers Practicing At The Barre", artist: "Edgar Degas", year: "1877", width: 75.6, height: 81.3, price: 6146, artistLife: "1834-1917", image: "dancers practicing at the barre.jpg" },
    { title: "The Opera Orchestra", artist: "Edgar Degas", year: "1870", width: 56.5, height: 46.2, price: 2610, artistLife: "1834-1917", image: "the opera orchestra.jpg" },
    { title: "Miss La La At The Cirque Fernando", artist: "Edgar Degas", year: "1879", width: 117, height: 77.5, price: 9067, artistLife: "1834-1917", image: "miss la la at the cirque fernando.jpg" },
    { title: "Blue Dancers", artist: "Edgar Degas", year: "1897", width: 65, height: 65, price: 4225, artistLife: "1834-1917", image: "blue dancers.jpg" },
    { title: "After The Bath Woman Drying Her Neck", artist: "Edgar Degas", year: "1898", width: 62.2, height: 65, price: 4043, artistLife: "1834-1917", image: "after the bath woman drying her neck.jpg" },
    { title: "Dancer Adjusting Her Sandel", artist: "Edgar Degas", year: "1873", width: 62.5, height: 41.5, price: 2593, artistLife: "1834-1917", image: "dancer adjusting her sandel.jpg" },
    { title: "Dancers In Pink", artist: "Edgar Degas", year: "1885", width: 75.6, height: 73.7, price: 5571, artistLife: "1834-1917", image: "dancers in pink.jpg" },
    { title: "Two Dancers On A Stage", artist: "Edgar Degas", year: "1874", width: 61.5, height: 46, price: 2829, artistLife: "1834-1917", image: "two dancers on a stage.jpg" },
    { title: "Dance Opera", artist: "Edgar Degas", year: "1877", width: 34, height: 26, price: 884, artistLife: "1834-1917", image: "dance opera.jpg" },
    { title: "Bathers", artist: "Edgar Degas", year: "1890-1905", width: 115, height: 115, price: 13225, artistLife: "1834-1917", image: "bathers.jpg" },
    { title: "Dancer In Green", artist: "Edgar Degas", year: "1880", width: 66, height: 36, price: 2376, artistLife: "1834-1917", image: "dancer in green.jpg" },
    { title: "Portrait Of Emma Dobigny", artist: "Edgar Degas", year: "1869", width: 31.2, height: 28.6, price: 892, artistLife: "1834-1917", image: "portrait of emma dobigny.jpg" },

    // Raoul Dufy
    { title: "Open Window", artist: "Raoul Dufy", year: "1928", width: 65, height: 54, price: 3510, artistLife: "1877-1953", image: "open window.jpg" },
    { title: "Hommage To Claude Debussy", artist: "Raoul Dufy", year: "1952-1953", width: 245, height: 350, price: 85750, artistLife: "1877-1953", image: "hommage to claude debussy.jpg" },
    { title: "The Red Concert", artist: "Raoul Dufy", year: "1947", width: 54.5, height: 65.5, price: 3569, artistLife: "1877-1953", image: "the red concert.jpg" },
    { title: "Red Quartet", artist: "Raoul Dufy", year: "1942", width: 54, height: 65, price: 3510, artistLife: "1877-1953", image: "red quartet.jpg" },
    { title: "The Yellow Console With A Violin", artist: "Raoul Dufy", year: "1949", width: 65, height: 54, price: 3510, artistLife: "1877-1953", image: "the yellow console with a violin.jpg" },
    { title: "Boats At Martigues", artist: "Raoul Dufy", year: "1908", width: 72.5, height: 59.5, price: 4313, artistLife: "1877-1953", image: "boats at martigues.jpg" },

    // Melchior De Hondecoeter
    { title: "Palaceof Amsterdam With Exotic Birds", artist: "Melchior De Hondecoeter", year: "1686", width: 135, height: 116, price: 15660, artistLife: "1636-1695", image: "palaceof amsterdam with exotic birds.jpg" },
    { title: "Peacocks", artist: "Melchior De Hondecoeter", year: "1683", width: 191, height: 135, price: 25785, artistLife: "1636-1695", image: "peacocks.jpg" },
    { title: "A Cockrel With Other Birds", artist: "Melchior De Hondecoeter", year: "1680", width: 66.5, height: 54.5, price: 3624, artistLife: "1636-1695", image: "a cockrel with other birds.jpg" },
    { title: "Dians Ans Blondie", artist: "Melchior De Hondecoeter", year: "1672", width: 121, height: 186.5, price: 22566, artistLife: "1636-1695", image: "dians ans blondie.jpg" },
  ];

  // Generate TypeScript code
  let tsCode = 'export const dArtworks = [\n';
  let skuCounter = 1;

  // Track artists for proper SKU generation
  const artistSKUMap = {
    'Leonardo Da Vinci': 'LDV',
    'Jacques-Louis David': 'JLD',
    'Edgar Degas': 'ED',
    'Raoul Dufy': 'RD',
    'Melchior De Hondecoeter': 'MDH',
  };

  const artistCounters = {};

  for (const entry of entries) {
    const normalizedFilename = entry.image.toLowerCase();
    const imagePath = `/image/d/${entry.image}`;

    // Check if image exists (case-insensitive)
    const imageExists = imageFiles.some(f => f.toLowerCase() === normalizedFilename);
    if (!imageExists) {
      console.log(`Warning: Image not found for "${entry.title}" (looking for ${entry.image})`);
      continue;
    }

    // Initialize artist counter if needed
    if (!artistCounters[entry.artist]) {
      artistCounters[entry.artist] = 1;
    }

    const artistCode = artistSKUMap[entry.artist] || 'D';
    const sku = `AM-${artistCode}-${String(artistCounters[entry.artist]).padStart(3, '0')}`;
    artistCounters[entry.artist]++;

    const price = entry.price || calculatePrice(entry.width, entry.height);

    tsCode += `  {\n`;
    tsCode += `    title: "${entry.title}",\n`;
    if (entry.year) tsCode += `    year: "${entry.year}",\n`;
    tsCode += `    originalSize: "${entry.width} x ${entry.height} cm",\n`;
    tsCode += `    artist: "${entry.artist}",\n`;
    if (entry.artistLife) tsCode += `    artistLife: "${entry.artistLife}",\n`;
    if (entry.location) tsCode += `    location: "${entry.location}",\n`;
    if (entry.description) tsCode += `    description: "${entry.description}",\n`;
    tsCode += `    sku: "${sku}",\n`;
    tsCode += `    basePrice: ${price},\n`;
    tsCode += `    currency: "AED",\n`;
    tsCode += `    image: "${imagePath}",\n`;
    tsCode += `    options: [{ id: 'opt1', width: ${entry.width}, height: ${entry.height}, price: ${price}, label: 'Original Size' }],\n`;
    tsCode += `  },\n\n`;
  }

  tsCode += '];\n\nexport default dArtworks;\n';

  console.log('Generated TypeScript code:');
  console.log(tsCode);

  fs.writeFileSync('scripts/d_artworks_output.ts', tsCode);
  console.log('\n✓ Output saved to scripts/d_artworks_output.ts');
  console.log('\n✓ Total artworks processed:', entries.length);
  console.log('\n✓ Images matched:', entries.filter(e => {
    const normalized = e.image.toLowerCase();
    return imageFiles.some(f => f.toLowerCase() === normalized);
  }).length);
})();
