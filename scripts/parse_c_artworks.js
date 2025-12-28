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
  const dataBuffer = fs.readFileSync('data/ART_DETAILS_C.pdf');
  const data = await pdf(dataBuffer);
  const text = data.text;

  console.log('Extracted text from PDF:');
  console.log(text);
  console.log('\n===================\n');

  // Get list of available images
  const imageFiles = fs.readdirSync('public/image/c/').filter(f => f.endsWith('.jpg') || f.endsWith('.webp') || f.endsWith('.png'));
  console.log('Available images:', imageFiles);
  console.log('\n===================\n');

  // Manual parsing based on the PDF structure - exact data from ART_DETAILS_C.pdf
  const entries = [
    // Canaletto
    { title: "Entrance To The Grand Canal Looking West", artist: "Canaletto", year: "1730", width: 49.5, height: 72.4, price: 5500, artistLife: "1697-1768", image: "entrance to the grand canal looking west.jpg" },
    { title: "Venice Facade", artist: "Canaletto", year: "1735", width: 143, height: 199.5, price: 18500, artistLife: "1697-1768", image: "venice facade.jpg" },
    { title: "Piazza San Marco With The Cathedral", artist: "Canaletto", year: "1730", width: 68.5, height: 93.5, price: 8500, artistLife: "1697-1768", image: "piazza san marco with the cathedral.jpg" },
    { title: "Grand Canal From Palazzo Balbi", artist: "Canaletto", year: "1724", width: 144.8, height: 207.6, price: 22000, artistLife: "1697-1768", image: "grand canal from palazzo balbi.jpg" },
    { title: "The Entrance To Grand Canal Venice", artist: "Canaletto", year: "1730", width: 49.2, height: 72.7, price: 5600, artistLife: "1697-1768", image: "the entrance to grand canal venice.jpg" },
    { title: "Venice The Ineerior Of St Marco By Day", artist: "Canaletto", year: "1755", width: 37, height: 38.5, price: 3800, artistLife: "1697-1768", image: "venice the ineerior of st marco by day.jpg" },
    { title: "Capriccio With Colonnade In The Interior Of The Palace", artist: "Canaletto", year: "1765", width: 131, height: 93, price: 11000, artistLife: "1697-1768", image: "capriccio with colonnade in the interior of the palace.jpg" },
    { title: "View Of Grand Canal From San Vio Venice", artist: "Canaletto", year: "1723", width: 140.5, height: 204.5, price: 21000, artistLife: "1697-1768", image: "view of grand canal from san vio venice.jpg" },
    { title: "Piazetta And The Doge's Palace", artist: "Canaletto", year: "1730", width: 50, height: 70, price: 5400, artistLife: "1697-1768", image: "piazetta and the doge's palace.jpg" },
    { title: "View Of Rialto Bridge At Venice South", artist: "Canaletto", year: "1730", width: 144.8, height: 207.6, price: 22000, artistLife: "1697-1768", image: "view of rialto bridge at venice south.jpg" },
    
    // Caravaggio
    { title: "Bacchus", artist: "Caravaggio", year: "1596", width: 95, height: 85, price: 9500, artistLife: "1571-1610", image: "bacchus.jpg" },
    { title: "The Calling Of Saint Matthew", artist: "Caravaggio", year: "1600", width: 322, height: 340, price: 65000, artistLife: "1571-1610", image: "the calling of saint matthew.jpg" },
    { title: "Judith Beheading Holofernes", artist: "Caravaggio", year: "1599", width: 145, height: 195, price: 22000, artistLife: "1571-1610", image: "judith beheading holofernes.jpg" },
    { title: "The Supper At Emmaus", artist: "Caravaggio", year: "1601", width: 141, height: 196.2, price: 21000, artistLife: "1571-1610", image: "the supper at emmaus.jpg" },
    { title: "David With The Head Of Goliath", artist: "Caravaggio", year: "1610", width: 125, height: 101, price: 11000, artistLife: "1571-1610", image: "david with the head of goliath.jpg" },
    { title: "The Conversion Of Saint Paul", artist: "Caravaggio", year: "1601", width: 230, height: 175, price: 28000, artistLife: "1571-1610", image: "the conversion of saint paul.jpg" },
    
    // Gustave Caillebotte
    { title: "Paris Street Rainy Weather", artist: "Gustave Caillebotte", year: "1877", width: 212.2, height: 276.2, price: 42000, artistLife: "1848-1894", image: "paris street rainy weather.jpg" },
    { title: "Young Man At His Window", artist: "Gustave Caillebotte", year: "1876", width: 116.2, height: 80.9, price: 10500, artistLife: "1848-1894", image: "young man at his window.jpg" },
    { title: "The Floor Scrapers", artist: "Gustave Caillebotte", year: "1875", width: 102, height: 146.5, price: 13500, artistLife: "1848-1894", image: "the floor scrapers.jpg" },
    { title: "The Yerres Rain (Riverbank In The Rain)", artist: "Gustave Caillebotte", year: "1875", width: 81, height: 59, price: 6800, artistLife: "1848-1894", image: "the yerres rain (riverbank in the rain).jpg" },
    { title: "View Of The Roof Snow Effect", artist: "Gustave Caillebotte", year: "1878", width: 65, height: 82, price: 7200, artistLife: "1848-1894", image: "view of the roof snow effect.jpg" },
    
    // Paul Cezanne
    { title: "Monte Sainte-Victoire", artist: "Paul Cezanne", year: "1887", width: 67, height: 92, price: 8500, artistLife: "1839-1906", image: "monte sainte-victoire.jpg" },
    { title: "The Card Players", artist: "Paul Cezanne", year: "1895", width: 47.5, height: 57, price: 4800, artistLife: "1839-1906", image: "the card players.jpg" },
    { title: "The Bathers", artist: "Paul Cezanne", year: "1900", width: 127.2, height: 196.1, price: 19000, artistLife: "1839-1906", image: "the bathers.jpg" },
    { title: "View Through The Tress L' Estaque", artist: "Paul Cezanne", year: "1879", width: 71, height: 58.3, price: 6200, artistLife: "1839-1906", image: "view through the tress l' estaque.jpg" },
    { title: "Still Life With Apples", artist: "Paul Cezanne", year: "1895", width: 68.8, height: 92.7, price: 8600, artistLife: "1839-1906", image: "still life with apples.jpg" },
    
    // Philippe de Champaigne
    { title: "Portrait Of Cardinal Richelieu", artist: "Philippe de Champaigne", year: "1637", width: 260, height: 178, price: 35000, artistLife: "1602-1674", image: "portrait of cardinal richelieu.jpg" },
    { title: "Triple Portrait Of Cardinal Richelieu", artist: "Philippe de Champaigne", year: "1642", width: 58.7, height: 72.4, price: 6500, artistLife: "1602-1674", image: "triple portrait of cardinal richelieu.jpg" },
    
    // Jean-Baptiste-Simeon Chardin
    { title: "Still Life Bread And Eggs", artist: "Jean-Baptiste-Simeon Chardin", year: "1760", width: 47, height: 56, price: 4800, artistLife: "1699-1779", image: "still life bread and eggs.jpg" },
    { title: "Glass Of Water And Coffee Pot", artist: "Jean-Baptiste-Simeon Chardin", year: "1760", width: 32.5, height: 41, price: 3500, artistLife: "1699-1779", image: "glass of water and coffee pot.jpg" },
    { title: "Still Life Asparagus And Red Currants", artist: "Jean-Baptiste-Simeon Chardin", year: "1750", width: 49, height: 57, price: 5000, artistLife: "1699-1779", image: "still life asparagus and red currants.jpg" },
    { title: "Basket Of Wild Strawberries", artist: "Jean-Baptiste-Simeon Chardin", year: "1761", width: 38, height: 46, price: 4200, artistLife: "1699-1779", image: "basket of wild strawberries.jpg" },
    { title: "A Breakfast Still Life With Strawberries And Cherries", artist: "Jean-Baptiste-Simeon Chardin", year: "1750", width: 38, height: 46, price: 4200, artistLife: "1699-1779", image: "a breakfast still life with strawberries and cherries.jpg" },
    
    // Pieter Claesz
    { title: "Vanitas Still Life (Violin)", artist: "Pieter Claesz", year: "1628", width: 36, height: 59, price: 4000, artistLife: "1597-1660", image: "vanitas still life (violin).jpg" },
    { title: "Still Life With Crab", artist: "Pieter Claesz", year: "1644", width: 61.5, height: 46, price: 5200, artistLife: "1597-1660", image: "still life with crab.jpg" },
    { title: "Still Life With Oysters", artist: "Pieter Claesz", year: "1640", width: 38.5, height: 56, price: 4100, artistLife: "1597-1660", image: "still life with oysters.jpg" },
    { title: "Still Life With Large Roemer, Lemon And Grapes", artist: "Pieter Claesz", year: "1642", width: 62, height: 82, price: 7000, artistLife: "1597-1660", image: "still life with large roemer, lemon and grapes.jpg" },
    { title: "Tabletop Still Life Pigeon Pie And Delfware Jug", artist: "Pieter Claesz", year: "1627", width: 46, height: 62, price: 5100, artistLife: "1597-1660", image: "tabletop still life pigeon pie and delfware jug.jpg" },
    
    // Francois Clouet
    { title: "Portrait Of Catherine De Medici", artist: "Francois Clouet", year: "1555", width: 32, height: 23.5, price: 2800, artistLife: "1510-1572", image: "portrait of catherine de medici.jpg" },
    { title: "Portrait Of Francis I Roi De France", artist: "Francois Clouet", year: "1530", width: 96, height: 74, price: 8500, artistLife: "1510-1572", image: "portrait of francis I roi de france.jpg" },
    { title: "Portrait Of Elizabeth Of Austria", artist: "Francois Clouet", year: "1571", width: 36, height: 26, price: 3000, artistLife: "1510-1572", image: "portrait of elizabeth of austria.jpg" },
    { title: "Portrait Of Charles IX", artist: "Francois Clouet", year: "1570", width: 32.5, height: 23, price: 2800, artistLife: "1510-1572", image: "portrait of charles IX.jpg" },
    { title: "Portrait Of King Charles IX Of France", artist: "Francois Clouet", year: "1566", width: 53.5, height: 41, price: 4200, artistLife: "1510-1572", image: "portrait of king charles IX of france.jpg" },
    { title: "Portrait Of Henri II King Of France", artist: "Francois Clouet", year: "1559", width: 33.5, height: 22.2, price: 2700, artistLife: "1510-1572", image: "portrait of henri II king of france.jpg" },
    { title: "Portrait Of Elizabeth Of Austris Queen Of France", artist: "Francois Clouet", year: "1571", width: 32, height: 22, price: 2600, artistLife: "1510-1572", image: "portrait of elizabeth of austris queen of france.jpg" },
    { title: "Portrait Of Louise De Lorraine", artist: "Francois Clouet", year: "1575", width: 32, height: 24, price: 2700, artistLife: "1510-1572", image: "portrait of louise de lorraine.jpg" },
    { title: "Portrait Of Mary Queen Of Scots", artist: "Francois Clouet", year: "1558", width: 35, height: 27.5, price: 3000, artistLife: "1510-1572", image: "portrait of mary queen of scots.jpg" },
    { title: "Portrait Of Odet De Coligny Cardinal Of Chatillon", artist: "Francois Clouet", year: "1560", width: 29.2, height: 23, price: 2600, artistLife: "1510-1572", image: "portrait of odet de coligny cardinal of chatillon.jpg" },
    
    // Osias Beert the Elder
    { title: "Fish And Still Life", artist: "Osias Beert the Elder", year: "1615", width: 44, height: 60, price: 4800, artistLife: "1580-1624", image: "fish and still life.jpg" },
    { title: "Gooseberries On A Table", artist: "Osias Beert the Elder", year: "1608", width: 35.2, height: 48.8, price: 4000, artistLife: "1580-1624", image: "gooseberries on a table.jpg" },
    { title: "Four Apircots On A Stone Plinth", artist: "Osias Beert the Elder", year: "1608", width: 32.6, height: 46.5, price: 3800, artistLife: "1580-1624", image: "four apircots on a stone plinth.jpg" },
    { title: "Three Peaches On A Stone Plinth", artist: "Osias Beert the Elder", year: "1610", width: 33.3, height: 44, price: 3700, artistLife: "1580-1624", image: "three peaches on a stone plinth.jpg" },
    { title: "Still Life Lobster", artist: "Osias Beert the Elder", year: "1615", width: 43, height: 58, price: 4700, artistLife: "1580-1624", image: "still life lobster.jpg" },
    { title: "Fruit Still Life With Basket Of Cheese", artist: "Osias Beert the Elder", year: "1610", width: 41, height: 56, price: 4500, artistLife: "1580-1624", image: "fruit still life with basket of cheese.jpg" },
    { title: "Still Life Leg Of Mutton Bread", artist: "Osias Beert the Elder", year: "1618", width: 41.9, height: 57, price: 4600, artistLife: "1580-1624", image: "still life leg of mutton bread.jpg" },
    { title: "Still Life Books Burning Candle", artist: "Osias Beert the Elder", year: "1615", width: 38, height: 50.2, price: 4200, artistLife: "1580-1624", image: "still life books burning candle.jpg" },
    
    // Giovanni Paolo Panini
    { title: "Rome A Caprice View With Ruins Based On The Forum", artist: "Giovanni Paolo Panini", year: "1735", width: 99, height: 137, price: 12000, artistLife: "1691-1765", image: "rome a caprice view with ruins based on the forum.jpg" },
    { title: "The Coloseum", artist: "Giovanni Paolo Panini", year: "1747", width: 99, height: 135, price: 11800, artistLife: "1691-1765", image: "the coloseum.jpg" },
    
    // Carolus-Duran
    { title: "Marie-Anne Caralus Duran (The Artists Daughter)", artist: "Carolus-Duran", year: "1873", width: 46, height: 38, price: 4100, artistLife: "1837-1917", image: "marie-anne caralus duran (the artists daughter).jpg" },
    
    // Georges Clairin
    { title: "Portrait Of Sarah Bernhardt", artist: "Georges Clairin", year: "1876", width: 250, height: 200, price: 38000, artistLife: "1843-1919", image: "portrait of sarah bernhardt.jpg" },
    
    // Other artists
    { title: "The Annunciation", artist: "Unknown", year: "Unknown", width: 122, height: 180, price: 17000, artistLife: "Unknown", image: "the annunciation.jpg" },
    { title: "Head Of A Man", artist: "Unknown", year: "Unknown", width: 47, height: 38, price: 4100, artistLife: "Unknown", image: "head of a man.jpg" },
    { title: "Portrait Of A Man Possibly Of Robert Arnauld Of Andilly", artist: "Unknown", year: "Unknown", width: 78, height: 63, price: 7000, artistLife: "Unknown", image: "portrait of a man possibly of robert arnauld of andilly.jpg" },
    { title: "The Moorish Chief", artist: "Unknown", year: "Unknown", width: 50, height: 40, price: 4300, artistLife: "Unknown", image: "the moorish chief.jpg" },
    { title: "A Corner Of My Studio", artist: "Unknown", year: "Unknown", width: 67.3, height: 82, price: 7400, artistLife: "Unknown", image: "a corner of my studio.jpg" },
    { title: "The Antiquary Shop", artist: "Unknown", year: "Unknown", width: 67.3, height: 82, price: 7400, artistLife: "Unknown", image: "the antiquary shop.jpg" },
    { title: "Dora Wheler", artist: "Unknown", year: "Unknown", width: 182.9, height: 92.7, price: 15000, artistLife: "Unknown", image: "dora wheler.jpg" },
    { title: "I Think I Am Ready Now", artist: "Unknown", year: "Unknown", width: 95, height: 74, price: 8500, artistLife: "Unknown", image: "i think i am ready now.jpg" },
    { title: "Quai Du Louvre In Winter", artist: "Unknown", year: "Unknown", width: 36.8, height: 46, price: 4000, artistLife: "Unknown", image: "quai du louvre in winter.jpg" },
    { title: "St Paul's Cathedral", artist: "Unknown", year: "Unknown", width: 87.6, height: 69.9, price: 8000, artistLife: "Unknown", image: "st paul's cathedral.jpg" },
    { title: "Austrian", artist: "Unknown", year: "Unknown", width: 62.2, height: 51.4, price: 5200, artistLife: "Unknown", image: "austrian.jpg" },
  ];

  // Generate TypeScript code
  let tsCode = 'export const cArtworks = [\n';

  // Track artists for proper SKU generation
  const artistSKUMap = {
    'Canaletto': 'CAN',
    'Caravaggio': 'CAR',
    'Gustave Caillebotte': 'GC',
    'Paul Cezanne': 'PC',
    'Philippe de Champaigne': 'PDC',
    'Jean-Baptiste-Simeon Chardin': 'JBSC',
    'Pieter Claesz': 'PCL',
    'Francois Clouet': 'FC',
    'Osias Beert the Elder': 'OBE',
    'Giovanni Paolo Panini': 'GPP',
    'Carolus-Duran': 'CD',
    'Georges Clairin': 'GCL',
    'Unknown': 'C-UNK',
  };

  const artistCounters = {};

  for (const entry of entries) {
    const normalizedFilename = entry.image.toLowerCase();
    const imagePath = `/image/c/${entry.image}`;

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

    const artistCode = artistSKUMap[entry.artist] || 'C';
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

  tsCode += '];\n\nexport default cArtworks;\n';

  console.log('Generated TypeScript code preview (first 2000 chars):');
  console.log(tsCode.substring(0, 2000));
  
  fs.writeFileSync('scripts/c_artworks_output.ts', tsCode);
  console.log('\n✓ Output saved to scripts/c_artworks_output.ts');
  console.log('\n✓ Total artworks processed:', entries.length);
  console.log('\n✓ Images matched:', entries.filter(e => {
    const normalized = e.image.toLowerCase();
    return imageFiles.some(f => f.toLowerCase() === normalized);
  }).length);
})();
