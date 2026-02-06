const fs = require('fs');
const path = require('path');

const locationsFile = path.resolve(__dirname, 'data/ART LOCATIONS.txt');
const artworksFile = path.resolve(__dirname, 'data/artworks.ts');
const artworksNZFile = path.resolve(__dirname, 'data/artworksNZ.ts');

function normalize(text) {
    if (!text) return '';
    return text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function parseLocations(content) {
    const lines = content.split(/\r\n|\n|\r/).map(l => l.trim()).filter(l => l.length > 0);
    const locations = [];

    let i = 0;
    while (i < lines.length) {
        if (lines[i].length <= 2 || lines[i] === 'X NONE') {
            i++;
            continue;
        }

        const artwork = lines[i];
        const artist = lines[i + 1];
        const location = lines[i + 2];

        if (artwork && artist && location) {
            locations.push({ artwork, artist, location });
        }
        i += 3;
    }
    return locations;
}

function getExistingArtworks() {
    const contentA = fs.readFileSync(artworksFile, 'utf8');
    const contentB = fs.readFileSync(artworksNZFile, 'utf8');
    const allContent = contentA + contentB;

    const artworkRegex = /name:\s*"([\s\S]*?)",[\s\S]*?artist:\s*"([\s\S]*?)"/g;
    const existingKeys = new Set();
    let match;
    while ((match = artworkRegex.exec(allContent)) !== null) {
        existingKeys.add(`${normalize(match[1])}|${normalize(match[2])}`);
    }
    return existingKeys;
}

const locationsContent = fs.readFileSync(locationsFile, 'utf8');
const allLocations = parseLocations(locationsContent);
const existingKeys = getExistingArtworks();

const unmatched = allLocations.filter(loc => {
    const key = `${normalize(loc.artwork)}|${normalize(loc.artist)}`;
    return !existingKeys.has(key);
});

console.log(`Summary:`);
console.log(`Total locations in text file: ${allLocations.length}`);
console.log(`Unmatched: ${unmatched.length}`);
console.log(`\n--- UNMATCHED ARTWORKS ---`);
unmatched.forEach(loc => {
    console.log(`Artwork: ${loc.artwork}`);
    console.log(`Artist:  ${loc.artist}`);
    console.log(`Location: ${loc.location}`);
    console.log('---');
});
