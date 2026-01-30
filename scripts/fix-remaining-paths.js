const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

/**
 * Update remaining image paths that still have spaces
 */
function updateDataFile(filePath) {
    const fileName = path.basename(filePath);
    console.log(`\nProcessing ${fileName}`);

    let content = fs.readFileSync(filePath, 'utf8');
    let updateCount = 0;

    // Find all image paths and replace spaces with hyphens
    const updatedContent = content.replace(
        /image:\s*["']([^"']+)["']/g,
        (match, imagePath) => {
            if (imagePath.includes(' ')) {
                const newPath = imagePath.replace(/ /g, '-');
                console.log(`  ${imagePath} → ${newPath}`);
                updateCount++;
                return match.replace(imagePath, newPath);
            }
            return match;
        }
    );

    if (updateCount > 0) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`  ✓ Updated ${updateCount} paths in ${fileName}`);
    } else {
        console.log(`  No updates needed`);
    }

    return updateCount;
}

// Process all TypeScript files in data directory
console.log('=== UPDATING REMAINING IMAGE PATHS ===\n');

const dataFiles = fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.ts'))
    .map(f => path.join(DATA_DIR, f));

let totalUpdates = 0;

for (const file of dataFiles) {
    totalUpdates += updateDataFile(file);
}

console.log(`\n=== COMPLETE ===`);
console.log(`Total paths updated: ${totalUpdates}`);
