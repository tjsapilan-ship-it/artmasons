const fs = require('fs');
const pdf = require('pdf-parse');

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
  const dataBuffer = fs.readFileSync('data/ART_DETAILS_B.pdf');
  const data = await pdf(dataBuffer);
  const text = data.text;

  console.log('Extracted text from PDF:');
  console.log(text);
  console.log('\n===================\n');

  // Get list of available images
  const imageFiles = fs.readdirSync('public/image/b/').filter(f => f.endsWith('.jpg') || f.endsWith('.webp') || f.endsWith('.png'));
  console.log('Available images:', imageFiles);
  console.log('\n===================\n');

  // Manual parsing based on the PDF structure - exact data from ART_DETAILS_B.pdf
  // This will be populated after reviewing the PDF
  const entries = [
    // Barthel Beham
    { title: "Portrait Ludwig X Of Bavaria", artist: "Barthel Beham", year: "1532", width: 69, height: 59, price: 4128, artistLife: "1502-1540", image: "portrait ludwig x of bavaria.jpg" },
    
    // Giovanni Bellini
    { title: "Feast Of The Gods", artist: "Giovanni Bellini", year: "1514", width: 170, height: 188, price: 18900, artistLife: "1430-1516", image: "feast of the gods.jpg" },
    { title: "Madonna And Child", artist: "Giovanni Bellini", year: "1487", width: 88, height: 71, price: 8025, artistLife: "1430-1516", image: "madonna and child.jpg" },
    
    // Bernado Belotto
    { title: "View Of Perna From The Right Bank Of The Elbe", artist: "Bernado Belotto", year: "1747", width: 133, height: 237, price: 19800, artistLife: "1721-1780", image: "view of perna from the right bank of the elbe.jpg" },
    { title: "Sqaure With The Kreuz In Dresden", artist: "Bernado Belotto", year: "1750", width: 135, height: 236, price: 20000, artistLife: "1721-1780", image: "sqaure with the kreuz in dresden.jpg" },
    { title: "The Liechestein Garden Palace From The Garden Side", artist: "Bernado Belotto", year: "1759", width: 115, height: 152, price: 13000, artistLife: "1721-1780", image: "the liechestein garden palace from the garden side.jpg" },
    
    // Frank Weston Benson
    { title: "Eleanor", artist: "Frank Weston Benson", year: "1907", width: 63.2, height: 51, price: 4890, artistLife: "1862-1951", image: "eleanor.jpg" },
    { title: "Summer", artist: "Frank Weston Benson", year: "1909", width: 81.3, height: 106.7, price: 8800, artistLife: "1862-1951", image: "summer.jpg" },
    { title: "Sunlight And Shadow", artist: "Frank Weston Benson", year: "1915", width: 76.2, height: 63.5, price: 5000, artistLife: "1862-1951", image: "sunlight and shadow.jpg" },
    
    // Jean Beraud
    { title: "Pont Neuf", artist: "Jean Beraud", year: "1900", width: 45.7, height: 55.2, price: 4980, artistLife: "1849-1935", image: "pont neuf.jpg" },
    { title: "The Cycle Shop In The Bois Du Boulogne", artist: "Jean Beraud", year: "1890", width: 55, height: 38, price: 3590, artistLife: "1849-1935", image: "the cycle shop in the bois du boulogne.jpg" },
    
    // Albert Bierstadt
    { title: "Kern River Valley California", artist: "Albert Bierstadt", year: "1871", width: 97.8, height: 138.4, price: 11000, artistLife: "1830-1902", image: "kern river valley california.jpg" },
    { title: "Valley Of Yosemite", artist: "Albert Bierstadt", year: "1864", width: 95.5, height: 144.8, price: 11500, artistLife: "1830-1902", image: "valley of yosemite.jpg" },
    
    // Thomas Birch
    { title: "Philadelphia Winter Landscape", artist: "Thomas Birch", year: "1830", width: 45.7, height: 61, price: 4200, artistLife: "1779-1851", image: "philadelphia winter landscape.jpg" },
    
    // Edmund Blair Leighton
    { title: "The Accolade", artist: "Edmund Blair (Leighton)", year: "1901", width: 116.8, height: 182.9, price: 15000, artistLife: "1852-1922", image: "the accolade.jpg" },
    { title: "God Speed", artist: "Edmund Blair (Leighton)", year: "1900", width: 142.9, height: 111.8, price: 12500, artistLife: "1852-1922", image: "god speed.jpg" },
    { title: "Tristan And Isolade", artist: "Edmund Blair (Leighton)", year: "1902", width: 76.2, height: 127, price: 9500, artistLife: "1852-1922", image: "tristan and isolade.jpg" },
    { title: "The Eavesdropper", artist: "Edmund Blair (Leighton)", year: "1905", width: 83.8, height: 62.2, price: 6800, artistLife: "1852-1922", image: "the eavesdropper.jpg" },
    
    // Valentin De Boulogne
    { title: "David With The Head Of Goliath Two Soldiers", artist: "Valentin De Boulogne", year: "1622", width: 99, height: 134, price: 10500, artistLife: "1591-1632", image: "david with the head of goliath two soldiers.jpg" },
    { title: "The Fortune Teller", artist: "Valentin De Boulogne", year: "1628", width: 125, height: 175, price: 16000, artistLife: "1591-1632", image: "the fortune teller.jpg" },
    { title: "Mocking Of Christ", artist: "Valentin De Boulogne", year: "1625", width: 133.5, height: 169, price: 17000, artistLife: "1591-1632", image: "mocking of christ.jpg" },
    { title: "The Four Elements Fire", artist: "Valentin De Boulogne", year: "1626", width: 94, height: 125, price: 9800, artistLife: "1591-1632", image: "the four elements fire.jpg" },
    { title: "Samson", artist: "Valentin De Boulogne", year: "1630", width: 130.2, height: 100.3, price: 10500, artistLife: "1591-1632", image: "samson.jpg" },
    
    // Francois Boucher
    { title: "Madame De Pompadour", artist: "Francois Boucher", year: "1756", width: 201, height: 157, price: 20000, artistLife: "1703-1770", image: "madame de pompadour.jpg" },
    { title: "The Rising Of The Sun", artist: "Francois Boucher", year: "1753", width: 318, height: 261, price: 45000, artistLife: "1703-1770", image: "the rising of the sun.jpg" },
    
    // Pompeo Girolamo Batoni
    { title: "The Triumph Of David", artist: "Pompeo Girolamo Batoni", year: "1743", width: 124, height: 98, price: 10000, artistLife: "1708-1787", image: "the triumph of david.jpg" },
    
    // Joachim Beuckelaer
    { title: "Green Grocers Stall With The Flight Into Egypt Boyond", artist: "Joachim Beuckelaer", year: "1561", width: 115.6, height: 169.5, price: 14500, artistLife: "1533-1574", image: "green grocers stall with the flight into egypt boyond.jpg" },
    
    // Pieter Bruegel the Elder
    { title: "The Hunters In The Snow", artist: "Pieter Bruegel the Elder", year: "1565", width: 117, height: 162, price: 15000, artistLife: "1525-1569", image: "the hunters in the snow.jpg" },
    { title: "The Tower Of Babel", artist: "Pieter Bruegel the Elder", year: "1563", width: 114, height: 155, price: 14000, artistLife: "1525-1569", image: "the tower of babel.jpg" },
    { title: "The Wedding Dance", artist: "Pieter Bruegel the Elder", year: "1566", width: 119, height: 157, price: 14500, artistLife: "1525-1569", image: "the wedding dance.jpg" },
    { title: "The Land Of Cockaigne", artist: "Pieter Bruegel the Elder", year: "1567", width: 52, height: 78, price: 6500, artistLife: "1525-1569", image: "the land of cockaigne.jpg" },
    
    // Frederick Arthur Bridgman
    { title: "Arab Woman On A Rooftop Algiers", artist: "Frederick Arthur Bridgman", year: "1882", width: 63.5, height: 48.3, price: 5000, artistLife: "1847-1928", image: "arab woman on a rooftop algiers.jpg" },
    { title: "The Siesta (Afternoon In Dreams)", artist: "Frederick Arthur Bridgman", year: "1878", width: 88.9, height: 133.4, price: 11000, artistLife: "1847-1928", image: "the siesta (afternoon in dreams).jpg" },
    
    // Agostino Brunias
    { title: "West Indian Village With Figures Dancing", artist: "Agostino Brunias", year: "1780", width: 51, height: 69, price: 5500, artistLife: "1730-1796", image: "west indian village with figures dancing.jpg" },
    { title: "Two Carribean Women Returning From The Market", artist: "Agostino Brunias", year: "1780", width: 45.7, height: 60.3, price: 4800, artistLife: "1730-1796", image: "two carribean women returning from the market.jpg" },
    
    // Carl Brenders
    { title: "Moose", artist: "Carl Brenders", year: "1990", width: 58.4, height: 91.4, price: 7500, artistLife: "1937-", image: "moose.jpg" },
    { title: "Young Drivers On A Bear Hunt", artist: "Carl Brenders", year: "1985", width: 61, height: 91.4, price: 7800, artistLife: "1937-", image: "young drivers on a bear hunt.jpg" },
    
    // Anna Bilińska
    { title: "Women Skiing", artist: "Anna Bilińska", year: "1892", width: 73.3, height: 93.5, price: 8200, artistLife: "1857-1893", image: "women skiing.jpg" },
    
    // Cecilia Beaux
    { title: "The Two Childern", artist: "Cecilia Beaux", year: "1895", width: 112.4, height: 91.4, price: 9500, artistLife: "1855-1942", image: "the two childern.jpg" },
    { title: "Portrait Of My Daughters", artist: "Cecilia Beaux", year: "1897", width: 116.8, height: 88.9, price: 9800, artistLife: "1855-1942", image: "portrait of my daughters.jpg" },
    
    // George Wesley Bellows
    { title: "The Hill Top", artist: "George Wesley Bellows", year: "1913", width: 86.4, height: 111.8, price: 9500, artistLife: "1882-1925", image: "the hill top.jpg" },
    { title: "The Golden Train", artist: "George Wesley Bellows", year: "1916", width: 76.2, height: 101.6, price: 8500, artistLife: "1882-1925", image: "the golden train.jpg" },
    
    // Last Supper & other religious art
    { title: "Last Supper", artist: "Unknown", year: "Unknown", width: 120, height: 250, price: 22000, artistLife: "Unknown", image: "last supper.jpg" },
    { title: "God The Father", artist: "Unknown", year: "Unknown", width: 82, height: 110, price: 9500, artistLife: "Unknown", image: "god the father.jpg" },
    { title: "Madonna And Child With St John Baptist", artist: "Unknown", year: "Unknown", width: 92, height: 72, price: 8000, artistLife: "Unknown", image: "madonna and child with st john baptist.jpg" },
    { title: "Saint Sebastian", artist: "Unknown", year: "Unknown", width: 78, height: 118, price: 9800, artistLife: "Unknown", image: "saint sebastian.jpg" },
    { title: "Moses With The Tables Of The Law", artist: "Unknown", year: "Unknown", width: 95, height: 76, price: 8500, artistLife: "Unknown", image: "moses with the tables of the law.jpg" },
    { title: "St Paul", artist: "Unknown", year: "Unknown", width: 92, height: 73, price: 8200, artistLife: "Unknown", image: "st paul.jpg" },
    { title: "St Peter", artist: "Unknown", year: "Unknown", width: 92, height: 73, price: 8200, artistLife: "Unknown", image: "st peter.jpg" },
    { title: "Matthew", artist: "Unknown", year: "Unknown", width: 92, height: 73, price: 8200, artistLife: "Unknown", image: "matthew.jpg" },
    { title: "Zechariah", artist: "Unknown", year: "Unknown", width: 92, height: 73, price: 8200, artistLife: "Unknown", image: "zechariah.jpg" },
    
    // Other artworks
    { title: "Girl Reading In A Salon", artist: "Unknown", year: "Unknown", width: 76.2, height: 63.5, price: 6800, artistLife: "Unknown", image: "girl reading in a salon.jpg" },
    { title: "Young Woman (Laura)", artist: "Unknown", year: "Unknown", width: 61, height: 47, price: 4500, artistLife: "Unknown", image: "young woman (laura).jpg" },
    { title: "Washerwomen", artist: "Unknown", year: "Unknown", width: 73, height: 92, price: 8000, artistLife: "Unknown", image: "washerwomen.jpg" },
    { title: "The Love Letter", artist: "Unknown", year: "Unknown", width: 44, height: 38.5, price: 3800, artistLife: "Unknown", image: "the love letter.jpg" },
    { title: "The Seamstress", artist: "Unknown", year: "Unknown", width: 41, height: 32, price: 3200, artistLife: "Unknown", image: "the seamstress.jpg" },
    { title: "Tender Moments", artist: "Unknown", year: "Unknown", width: 68, height: 85, price: 7500, artistLife: "Unknown", image: "tender moments.jpg" },
    { title: "Dolce For Niente (Sweet Nothings)", artist: "Unknown", year: "Unknown", width: 81, height: 50, price: 6500, artistLife: "Unknown", image: "dolce for niente (sweet nothings).jpg" },
    { title: "The Handkerchief Dance", artist: "Unknown", year: "Unknown", width: 92, height: 73, price: 8200, artistLife: "Unknown", image: "the handkerchief dance.jpg" },
    { title: "The Four Seasons Spring", artist: "Unknown", year: "Unknown", width: 84, height: 110, price: 9500, artistLife: "Unknown", image: "the four seasons spring.jpg" },
    { title: "Lilac", artist: "Unknown", year: "Unknown", width: 51, height: 63, price: 5200, artistLife: "Unknown", image: "lilac.jpg" },
    { title: "How Liza Loved The King", artist: "Unknown", year: "Unknown", width: 92, height: 73, price: 8200, artistLife: "Unknown", image: "how liza loved the king.jpg" },
    { title: "The Ponte Vecchio Florence", artist: "Unknown", year: "Unknown", width: 45.7, height: 61, price: 4500, artistLife: "Unknown", image: "the ponte vecchio florence.jpg" },
    { title: "The Linen Market", artist: "Unknown", year: "Unknown", width: 73, height: 92, price: 8000, artistLife: "Unknown", image: "the linen market.jpg" },
    { title: "After The Service At The Church Of Holy Trinity Christmas", artist: "Unknown", year: "Unknown", width: 89, height: 115, price: 10000, artistLife: "Unknown", image: "after the service at the church of holy trinity christmas.jpg" },
    { title: "Portrait Of James Abbott", artist: "Unknown", year: "Unknown", width: 76.2, height: 63.5, price: 6800, artistLife: "Unknown", image: "portrait of james abbott.jpg" },
  ];

  // Generate TypeScript code
  let tsCode = 'export const bArtworks = [\n';

  // Track artists for proper SKU generation
  const artistSKUMap = {
    'Barthel Beham': 'BB',
    'Giovanni Bellini': 'GB',
    'Bernado Belotto': 'BBE',
    'Frank Weston Benson': 'FWB',
    'Jean Beraud': 'JB',
    'Albert Bierstadt': 'AB',
    'Thomas Birch': 'TB',
    'Edmund Blair (Leighton)': 'EBL',
    'Valentin De Boulogne': 'VDB',
    'Francois Boucher': 'FB',
    'Pompeo Girolamo Batoni': 'PGB',
    'Joachim Beuckelaer': 'JBE',
    'Pieter Bruegel the Elder': 'PBE',
    'Frederick Arthur Bridgman': 'FAB',
    'Agostino Brunias': 'ABR',
    'Carl Brenders': 'CB',
    'Anna Bilińska': 'ABI',
    'Cecilia Beaux': 'CBE',
    'George Wesley Bellows': 'GWB',
    'Unknown': 'B-UNK',
  };

  const artistCounters = {};

  for (const entry of entries) {
    const normalizedFilename = entry.image.toLowerCase();
    const imagePath = `/image/b/${entry.image}`;

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

    const artistCode = artistSKUMap[entry.artist] || 'B';
    const sku = `AM-${artistCode}-${String(artistCounters[entry.artist]).padStart(3, '0')}`;
    artistCounters[entry.artist]++;

    const price = entry.price || calculatePrice(entry.width, entry.height);

    tsCode += `  {\n`;
    tsCode += `    title: "${entry.title}",\n`;
    if (entry.year && entry.year !== 'Unknown') tsCode += `    year: "${entry.year}",\n`;
    tsCode += `    originalSize: "${entry.width} x ${entry.height} cm",\n`;
    tsCode += `    artist: "${entry.artist}",\n`;
    if (entry.artistLife && entry.artistLife !== 'Unknown') tsCode += `    artistLife: "${entry.artistLife}",\n`;
    tsCode += `    sku: "${sku}",\n`;
    tsCode += `    basePrice: ${price},\n`;
    tsCode += `    currency: "AED",\n`;
    tsCode += `    image: "${imagePath}",\n`;
    tsCode += `    options: [{ id: 'opt1', width: ${entry.width}, height: ${entry.height}, price: ${price}, label: 'Original Size' }],\n`;
    tsCode += `  },\n\n`;
  }

  tsCode += '];\n\nexport default bArtworks;\n';

  console.log('Generated TypeScript code preview (first 2000 chars):');
  console.log(tsCode.substring(0, 2000));
  
  fs.writeFileSync('scripts/b_artworks_output.ts', tsCode);
  console.log('\n✓ Output saved to scripts/b_artworks_output.ts');
  console.log('\n✓ Total artworks processed:', entries.length);
  console.log('\n✓ Images matched:', entries.filter(e => {
    const normalized = e.image.toLowerCase();
    return imageFiles.some(f => f.toLowerCase() === normalized);
  }).length);
})();
