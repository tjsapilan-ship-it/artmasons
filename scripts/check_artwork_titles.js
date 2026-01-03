const fs = require('fs');
const path = require('path');

// Read artworks.ts as text and parse manually to find issues
const content = fs.readFileSync(path.join(__dirname, '..', 'data', 'artworks.ts'), 'utf-8');

// Count total artwork objects
const artworkMatches = content.match(/\n\s+\{[\s\S]*?title:\s*"[^"]*"/g);
const totalObjects = content.match(/\n\s+\{/g)?.length || 0;
const objectsWithTitles = artworkMatches?.length || 0;

console.log(`Total objects (opening braces): ${totalObjects}`);
console.log(`Objects with titles: ${objectsWithTitles}`);
console.log(`Potential missing titles: ${totalObjects - objectsWithTitles}`);

// Find objects without titles
const lines = content.split('\n');
let inArtworksArray = false;
let braceCount = 0;
let objectStart = -1;
let issuesFound = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('export const ARTWORKS: Artwork[] = [')) {
    inArtworksArray = true;
    continue;
  }
  
  if (inArtworksArray && line.trim() === '];') {
    break;
  }
  
  if (inArtworksArray) {
    if (line.match(/^\s+\{$/)) {
      objectStart = i + 1;
      braceCount = 1;
    } else if (objectStart > 0) {
      if (line.includes('{')) braceCount++;
      if (line.includes('}')) braceCount--;
      
      if (braceCount === 0) {
        // Object closed, check if it had a title
        const objectLines = lines.slice(objectStart, i + 1).join('\n');
        if (!objectLines.includes('title:')) {
          issuesFound.push({
            lineStart: objectStart,
            lineEnd: i + 1,
            snippet: lines.slice(Math.max(0, objectStart - 1), Math.min(lines.length, i + 2)).join('\n')
          });
        }
        objectStart = -1;
      }
    }
  }
}

console.log(`\nObjects missing title property: ${issuesFound.length}\n`);

if (issuesFound.length > 0) {
  issuesFound.forEach((issue, idx) => {
    console.log(`\n--- Issue ${idx + 1} at lines ${issue.lineStart}-${issue.lineEnd} ---`);
    console.log(issue.snippet);
  });
}
