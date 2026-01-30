const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const MAPPING_FILE = path.join(__dirname, 'rename-mapping.json');

// Load the rename mapping
const renameMapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));

// Create a map for quick lookups (old path -> new path)
const pathMap = new Map();
renameMapping.forEach(item => {
    pathMap.set(item.oldPath, item.newPath);
});

console.log(`Loaded ${pathMap.size} rename mappings\n`);

/**
 * Update image paths in a data file
 */
function updateDataFile(filePath, dryRun = true) {
    const fileName = path.basename(filePath);
    console.log(`\n${dryRun ? '[DRY RUN]' : '[UPDATING]'} ${fileName}`);

    let content = fs.readFileSync(filePath, 'utf8');
    let updateCount = 0;
    const changes = [];

    // Find all image paths and check if they need updating
    // Match patterns like: image: "/image/x/something with spaces.webp"
    const imagePathRegex = /image:\s*["']([^"']+)["']/g;
    let match;

    while ((match = imagePathRegex.exec(content)) !== null) {
        const oldPath = match[1];

        // Check if this path has spaces and needs updating
        if (oldPath.includes(' ')) {
            const newPath = oldPath.replace(/ /g, '-');

            // Verify this matches our mapping
            if (pathMap.has(oldPath)) {
                const expectedNew = pathMap.get(oldPath);
                if (expectedNew !== newPath) {
                    console.warn(`  WARNING: Mismatch for ${oldPath}`);
                    console.warn(`    Expected: ${expectedNew}`);
                    console.warn(`    Got:      ${newPath}`);
                }
            }

            changes.push({ old: oldPath, new: newPath });
            updateCount++;

            if (!dryRun) {
                // Replace the old path with the new one
                content = content.replace(
                    `image: "${oldPath}"`,
                    `image: "${newPath}"`
                ).replace(
                    `image: '${oldPath}'`,
                    `image: '${newPath}'`
                );
            }
        }
    }

    if (updateCount > 0) {
        console.log(`  Found ${updateCount} paths to update:`);
        changes.forEach(({ old, new: newPath }) => {
            console.log(`    ${old} → ${newPath}`);
        });

        if (!dryRun) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  ✓ Updated ${fileName}`);
        }
    } else {
        console.log(`  No updates needed`);
    }

    return updateCount;
}

/**
 * Process all TypeScript files in the data directory
 */
function updateAllDataFiles(dryRun = true) {
    console.log(`${dryRun ? '=== DRY RUN ===' : '=== UPDATING DATA FILES ==='}\n`);

    const dataFiles = fs.readdirSync(DATA_DIR)
        .filter(f => f.endsWith('.ts'))
        .map(f => path.join(DATA_DIR, f));

    let totalUpdates = 0;
    const filesUpdated = [];

    for (const file of dataFiles) {
        const updateCount = updateDataFile(file, dryRun);
        if (updateCount > 0) {
            totalUpdates += updateCount;
            filesUpdated.push(path.basename(file));
        }
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`Files processed: ${dataFiles.length}`);
    console.log(`Files with updates: ${filesUpdated.length}`);
    console.log(`Total path updates: ${totalUpdates}`);

    if (filesUpdated.length > 0) {
        console.log(`\nFiles that need updating:`);
        filesUpdated.forEach(f => console.log(`  - ${f}`));
    }

    if (dryRun) {
        console.log(`\n=== DRY RUN COMPLETE ===`);
        console.log('To actually update files, run:');
        console.log('  node scripts/update-data-files.js --execute');
    } else {
        console.log(`\n=== UPDATE COMPLETE ===`);
        console.log('Next steps:');
        console.log('1. Review changes using git diff');
        console.log('2. Test locally');
        console.log('3. Commit and deploy');
    }
}

// Main execution
const args = process.argv.slice(2);
const dryRun = !args.includes('--execute');

if (!fs.existsSync(MAPPING_FILE)) {
    console.error('Error: rename-mapping.json not found!');
    console.error('Please run rename-image-files.js first.');
    process.exit(1);
}

updateAllDataFiles(dryRun);
