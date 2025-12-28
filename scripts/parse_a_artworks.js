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
  const dataBuffer = fs.readFileSync('data/ART_DETAILS_A.pdf');
  const data = await pdf(dataBuffer);
  const text = data.text;

  console.log('Extracted text from PDF:');
  console.log(text);
  console.log('\n===================\n');

  // Get list of available images
  const imageFiles = fs.readdirSync('public/image/a/').filter(f => f.endsWith('.jpg') || f.endsWith('.webp'));
  console.log('Available images:', imageFiles);
  console.log('\n===================\n');

  // Manual parsing based on the PDF structure - exact data from ART_DETAILS_A.pdf
  const entries = [
    // John Otis Adams
    { title: "In Poppyland (Poppy field)", artist: "John Otis Adams", year: "1901", width: 56, height: 81.6, price: 3200, artistLife: "1851-1927", image: "in poppyland (poppy field).jpg" },
    { title: "Gleaners At Rest", artist: "John Otis Adams", year: "1886", width: 73, height: 99.1, price: 4300, artistLife: "1851-1927", image: "gleaners at rest.jpg" },
    { title: "Iridesence Of A Shallow Stream", artist: "John Otis Adams", year: "1902", width: 71, height: 106.8, price: 4350, artistLife: "1851-1927", image: "iridesence of a shallow stream.jpg" },
    { title: "Wheatwain A Field", artist: "John Otis Adams", year: "1894", width: 62.2, height: 88.9, price: 4100, artistLife: "1851-1927", image: "wheatwain a field.jpg" },
    
    // Wilem Van Aelst
    { title: "Glass Vase With Branches Bearing Fruit", artist: "Wilem Van Aelst", year: "1664", width: 67.3, height: 52.1, price: 9080, artistLife: "1627-1683", image: "glass vase with branches bearing fruit.jpg" },
    { title: "Still Life With A Basket Of Fruit On A Marble Edge", artist: "Wilem Van Aelst", year: "1650", width: 38, height: 50, price: 7029, artistLife: "1627-1683", image: "still life with a basket of fruit on a marble edge.jpg" },
    { title: "Still Life Fruit And Crystal Vase", artist: "Wilem Van Aelst", year: "1652", width: 73, height: 58, price: 9227, artistLife: "1627-1683", image: "still life fruit and crystal vase.jpg" },
    { title: "Still Life Grapes, A Roemer, A Silver Ewer And A Plate", artist: "Wilem Van Aelst", year: "1659", width: 70.1, height: 45.4, price: 9930, artistLife: "1627-1683", image: "still life grapes, a roemer, a silver ewer and a plate.jpg" },
    { title: "The Breakfast", artist: "Wilem Van Aelst", year: "1679", width: 57.5, height: 46, price: 7325, artistLife: "1627-1683", image: "the breakfast.jpg" },
    { title: "Still Life of a Silver Tazza with a Wine Glass, Crab, Herring, Bread and Onion on Pewter Dishes with Grapes Arranged on a Ledge", artist: "Wilem Van Aelst", year: "1682", width: 58, height: 46.5, price: 6980, artistLife: "1627-1683", image: "Still Life of a Silver Tazza with a Wine Glass, Crab, Herring, Bread and Onion on Pewter Dishes with Grapes Arranged on a Ledge.jpg" },
    { title: "Still Life Herring, Cherries And Glassware", artist: "Wilem Van Aelst", year: "1680", width: 50.2, height: 42.5, price: 6560, artistLife: "1627-1683", image: "still life herring, cherries and glassware.jpg" },
    { title: "Still Life A Velvet Bag On A Marble Edge", artist: "Wilem Van Aelst", year: "1665", width: 67.3, height: 54, price: 7900, artistLife: "1627-1683", image: "still life a velvet bag on a marble ledge.jpg" },
    { title: "Still Life With Dead Birds And Game Bag", artist: "Wilem Van Aelst", year: "1674", width: 45.1, height: 36.8, price: 7029, artistLife: "1627-1683", image: "still life with dead birds and game bag.jpg" },
    
    // Pieter Aertsen
    { title: "The Market Scene", artist: "Pieter Aertsen", year: "1569", width: 83.5, height: 169.5, price: 9200, artistLife: "1508-1575", image: "the market scene.jpg" },
    { title: "The Egg Dance", artist: "Pieter Aertsen", year: "1552", width: 84, height: 172, price: 9250, artistLife: "1508-1575", image: "the egg dance.jpg" },
    { title: "Butchers Stall With The Flight In To Egypt", artist: "Pieter Aertsen", year: "1551", width: 123, height: 175, price: 10300, artistLife: "1508-1575", image: "butches stall with the flight in to egypt.jpg" },
    { title: "The Cook", artist: "Pieter Aertsen", year: "1569", width: 66, height: 32, price: 3521, artistLife: "1508-1575", image: "the cook.jpg" },
    { title: "Vendor Of Fowl", artist: "Pieter Aertsen", year: "1560", width: 137, height: 95, price: 8700, artistLife: "1508-1575", image: "vendor of fowl.jpg" },
    { title: "Market Woman At A Vegetable Stand", artist: "Pieter Aertsen", year: "1567", width: 111.2, height: 111.6, price: 7890, artistLife: "1508-1575", image: "marketwoman at a vegetable stand.jpg" },
    
    // Jaques-Laurent Agasse
    { title: "The Nubian Giraffe", artist: "Jaques-Laurent Agasse", year: "1827", width: 127.3, height: 101.7, price: 10635, artistLife: "1767-1849", image: "the nubian giraffe.jpg" },
    { title: "A Pointer In Landscape", artist: "Jaques-Laurent Agasse", year: "1825", width: 48, height: 60, price: 4088, artistLife: "1767-1849", image: "a pointer in landscape.jpg" },
    { title: "Deperture To The Hunt", artist: "Jaques-Laurent Agasse", year: "1803", width: 68, height: 81, price: 5100, artistLife: "1767-1849", image: "deperture to the hunt.jpg" },
    { title: "The Playground", artist: "Jaques-Laurent Agasse", year: "1830", width: 70, height: 90, price: 5100, artistLife: "1767-1849", image: "the playground.jpg" },
    
    // Ivan Konstantinovich Aivazovsky
    { title: "The Rainbow", artist: "Ivan Konstantinovich Aivazovsky", year: "1873", width: 102, height: 132, price: 4450, artistLife: "1817-1900", image: "the rainbow.jpg" },
    { title: "Boat On The Nile With Pyramids Of Gizeh", artist: "Ivan Konstantinovich Aivazovsky", year: "1872", width: 73, height: 92, price: 5335, artistLife: "1817-1900", image: "boat on the nile with pyramids of gizeh.jpg" },
    { title: "Sunrise In Yalta", artist: "Ivan Konstantinovich Aivazovsky", year: "1878", width: 102, height: 132, price: 6590, artistLife: "1817-1900", image: "sunrise in yalta.jpg" },
    { title: "The Ninth Wave", artist: "Ivan Konstantinovich Aivazovsky", year: "1850", width: 221, height: 332, price: 59000, artistLife: "1817-1900", image: "the ninth wave.jpg" },
    
    // John White Alexander
    { title: "Repose", artist: "John White Alexander", year: "1895", width: 132.7, height: 161.6, price: 3142, artistLife: "1856-1915", image: "repose.jpg" },
    { title: "Repose (Lady Reading A Book)", artist: "John White Alexander", year: "1895", width: 31, height: 39, price: 3486, artistLife: "1856-1915", image: "repose (lady reading book).jpg" },
    { title: "Study In Green And Black", artist: "John White Alexander", year: "1906", width: 127, height: 101.9, price: 5200, artistLife: "1856-1915", image: "study in green and black.jpg" },
    { title: "Isabella Pot Of Basil", artist: "John White Alexander", year: "1897", width: 192.09, height: 91.76, price: 10100, artistLife: "1856-1915", image: "isabella pot of basil.jpg" },
    
    // Sir Lawreance Alma-Tadema
    { title: "The favourite Poet", artist: "Sir Lawreance Alma-Tadema", year: "1889", width: 36.9, height: 49.6, price: 5840, artistLife: "1836-1912", image: "the favourite poet.jpg" },
    { title: "The Coign Of Vantage", artist: "Sir Lawreance Alma-Tadema", year: "1895", width: 64.2, height: 45, price: 5662, artistLife: "1836-1912", image: "the coign of vantage.jpg" },
    { title: "The Years At Spring. All's Right With The World", artist: "Sir Lawreance Alma-Tadema", year: "1902", width: 70, height: 50, price: 5600, artistLife: "1836-1912", image: "the years at spring. all's right with the world.jpg" },
    { title: "Under The Roof Of The Blue Ionion Weather", artist: "Sir Lawreance Alma-Tadema", year: "1901", width: 55, height: 120.5, price: 7588, artistLife: "1836-1912", image: "under the roof of the blue ionion weather.jpg" },
  ];

  // Generate TypeScript code
  let tsCode = 'export const aArtworks = [\n';
  let skuCounter = 1;

  // Track artists for proper SKU generation
  const artistSKUMap = {
    'John Otis Adams': 'JOA',
    'Wilem Van Aelst': 'WVA',
    'Pieter Aertsen': 'PA',
    'Jaques-Laurent Agasse': 'JLA',
    'Ivan Konstantinovich Aivazovsky': 'IKA',
    'John White Alexander': 'JWA',
    'Sir Lawreance Alma-Tadema': 'SLT',
  };

  const artistCounters = {};

  for (const entry of entries) {
    const normalizedFilename = entry.image.toLowerCase();
    const imagePath = `/image/a/${entry.image}`;

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

    const artistCode = artistSKUMap[entry.artist] || 'A';
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

  tsCode += '];\n\nexport default aArtworks;\n';

  console.log('Generated TypeScript code:');
  console.log(tsCode);

  fs.writeFileSync('scripts/a_artworks_output.ts', tsCode);
  console.log('\n✓ Output saved to scripts/a_artworks_output.ts');
  console.log('\n✓ Total artworks processed:', entries.length);
  console.log('\n✓ Images matched:', entries.filter(e => {
    const normalized = e.image.toLowerCase();
    return imageFiles.some(f => f.toLowerCase() === normalized);
  }).length);
})();
