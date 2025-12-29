const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const PDF_PATH = path.join(__dirname, '..', 'data', 'famous art & top 100 paintings.pdf');
const TS_OUTPUT_PATH = path.join(__dirname, '..', 'data', 'famousAndTop100.ts');

function generateSlug(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Generate filename from title
function titleToFilename(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Calculate price based on area (same formula used in other parsing scripts)
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

async function main() {
  if (!fs.existsSync(PDF_PATH)) {
    console.error('PDF not found at', PDF_PATH);
    process.exit(1);
  }

  console.log('Reading PDF from:', PDF_PATH);
  const data = fs.readFileSync(PDF_PATH);
  const textData = await pdf(data);
  const text = textData.text || '';

  // Parse the text more intelligently
  // The pattern seems to be:
  // Title (possibly multi-line) ArtistName Year Width x Height SellingDims Price
  // BirthYear-DeathYear
  
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  
  // Known artists from the PDF
  const knownArtists = [
    'Vincent Van Gogh', 'Van Gogh', 'Jacques-Louis David', 'Gustav Klimt', 
    'Johannes Vermeer Van Delft', 'Caspar David Friedrich', 'Claude Monet',
    'Hieronymus Bosch', 'Edvard Munch', 'Jean Honore Fragonard',
    'Pierre Auguste Renoir', 'Hilaire Germain Edgar Degas', 'Edgar Degas',
    'Van Rijn Rembrandt', 'Rembrandt', 'John William Waterhouse', 
    'Sandro Botticelli', 'Leonardo Da Vinci', 'Wasilly Kadinsky', 'Wassily Kandinsky',
    'Lord Frederick Leighton', 'Henri Matisse', 'Pablo Picasso', 'Rene Magritte',
    'Piet Mondrian', 'Paul Cezanne', 'Edouard Manet', 'Frans Halls',
    'Hippolyte Flandrin', 'Katsushika Hokusai', 'Philippe De Champaigne',
    'William Merrit Chase', 'Rembrandt Von Rijn', 'Pierre-August Renoir',
    'Jehan Georges Vibert', 'Gerder Wegener', 'Jackson Pollock', 'Hilaire Germaine Edgar Degas'
  ];
  
  // Build regex from known artists (sorted by length descending for matching)
  const artistsForRegex = [...knownArtists].sort((a, b) => b.length - a.length);
  const artistPattern = artistsForRegex.map(a => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  
  const artworks = [];
  const seenTitles = new Set();
  
  // Join all lines into a single text for easier parsing
  const fullText = lines.join(' ');
  
  // Pattern to match: Title Artist Year Dimensions Price
  const entryPattern = new RegExp(
    `([A-Z][\\w\\s'\\-,()]+?)\\s+(${artistPattern})\\s+(\\d{4}(?:\\/\\d{4})?)\\s+(\\d+(?:\\.\\d+)?)\\s*[xX×]\\s*(\\d+(?:\\.\\d+)?)(?:[^\\d]*?(\\d{1,3}(?:,\\d{3})*|\\d+))?`,
    'gi'
  );
  
  let match;
  while ((match = entryPattern.exec(fullText)) !== null) {
    let title = match[1].trim();
    const artist = match[2].trim();
    const year = match[3].trim();
    const width = parseFloat(match[4]);
    const height = parseFloat(match[5]);
    let price = match[6] ? parseInt(match[6].replace(/,/g, '')) : null;
    
    // Clean title - remove trailing punctuation and extra spaces
    title = title.replace(/\s+/g, ' ').replace(/[,\s]+$/, '').trim();
    
    // Skip if title is too short or looks like a header
    if (title.length < 4) continue;
    if (/^(ART|ARTIST|YEAR|DIMENSIONS|PRICE|FAMOUS|TOP|CM|AED)$/i.test(title)) continue;
    
    // Calculate price if not found
    if (!price || price < 100) {
      price = calculatePrice(width, height);
    }
    
    // Skip duplicates (we only want unique artworks)
    const titleKey = generateSlug(title);
    if (!seenTitles.has(titleKey)) {
      seenTitles.add(titleKey);
      
      artworks.push({
        title,
        artist: normalizeArtistName(artist),
        year,
        width,
        height,
        price
      });
    }
  }
  
  console.log(`\nExtracted ${artworks.length} unique artworks`);
  
  // Print extracted artworks
  console.log('\n=== Extracted Artworks ===');
  artworks.forEach((a, idx) => {
    console.log(`${idx + 1}. "${a.title}" by ${a.artist} (${a.year}) - ${a.width} x ${a.height} cm - AED ${a.price}`);
  });
  
  // Generate TypeScript file
  generateTypeScriptFile(artworks);
}

function normalizeArtistName(name) {
  // Normalize various artist name formats
  const normalizations = {
    'van gogh': 'Vincent Van Gogh',
    'wasilly kadinsky': 'Wassily Kandinsky',
    'van rijn rembrandt': 'Rembrandt van Rijn',
    'rembrandt von rijn': 'Rembrandt van Rijn',
    'hilaire germain edgar degas': 'Edgar Degas',
    'hilaire germaine edgar degas': 'Edgar Degas',
    'pierre-august renoir': 'Pierre-Auguste Renoir',
    'pierre august renoir': 'Pierre-Auguste Renoir',
  };
  
  const lowerName = name.toLowerCase();
  for (const [key, value] of Object.entries(normalizations)) {
    if (lowerName === key) return value;
  }
  return name;
}

function generateTypeScriptFile(entries) {
  // Determine split between Famous Art and Top 100
  // Based on the PDF structure, first ~60 entries are Famous Art, rest are Top 100
  const famousArtCount = Math.min(60, entries.length);
  const famousArt = entries.slice(0, famousArtCount);
  const top100 = entries.slice(famousArtCount);

  const tsContent = `// Famous Art and Top 100 Paintings data
// Auto-generated from: famous art & top 100 paintings.pdf
// Generated on: ${new Date().toISOString().split('T')[0]}

export interface FamousArtwork {
  title: string;
  artist: string;
  year: string;
  originalSize: string;
  artistLife?: string;
  sku: string;
  basePrice: number;
  currency: string;
  image: string;
  options: Array<{ id: string; width: number; height: number; price: number; label: string }>;
}

// Famous Art Collection
export const FAMOUS_ART: FamousArtwork[] = [
${famousArt.map((e, idx) => {
  const slug = titleToFilename(e.title);
  return `  {
    title: ${JSON.stringify(e.title)},
    artist: ${JSON.stringify(e.artist)},
    year: ${JSON.stringify(e.year)},
    originalSize: "${e.width} x ${e.height} cm",
    sku: "AM-FA-${String(idx + 1).padStart(3, '0')}",
    basePrice: ${e.price},
    currency: "AED",
    image: "/image/famous-art/${slug}.jpg",
    options: [{ id: 'opt1', width: ${e.width}, height: ${e.height}, price: ${e.price}, label: 'Original Size' }],
  }`; 
}).join(',\n\n')}
];

// Top 100 Paintings Collection  
export const TOP_100_PAINTINGS: FamousArtwork[] = [
${top100.map((e, idx) => {
  const slug = titleToFilename(e.title);
  return `  {
    title: ${JSON.stringify(e.title)},
    artist: ${JSON.stringify(e.artist)},
    year: ${JSON.stringify(e.year)},
    originalSize: "${e.width} x ${e.height} cm",
    sku: "AM-T100-${String(idx + 1).padStart(3, '0')}",
    basePrice: ${e.price},
    currency: "AED",
    image: "/image/top-100/${slug}.jpg",
    options: [{ id: 'opt1', width: ${e.width}, height: ${e.height}, price: ${e.price}, label: 'Original Size' }],
  }`;
}).join(',\n\n')}
];

// Helper to generate slug from title
export function getArtworkSlug(artwork: FamousArtwork): string {
  return artwork.title
    .toLowerCase()
    .replace(/[^\\w\\s-]/g, '')
    .replace(/\\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default { FAMOUS_ART, TOP_100_PAINTINGS };
`;

  fs.writeFileSync(TS_OUTPUT_PATH, tsContent, 'utf8');
  console.log(`\nGenerated TypeScript file: ${TS_OUTPUT_PATH}`);
  console.log(`  - FAMOUS_ART: ${famousArt.length} entries`);
  console.log(`  - TOP_100_PAINTINGS: ${top100.length} entries`);
}

function titleToFilename(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
