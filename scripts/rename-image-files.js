const fs = require('fs');
const path = require('path');

const PUBLIC_IMAGE_DIR = path.join(__dirname, '..', 'public', 'image');

// Track all renames for reporting
const renames = [];
const errors = [];

/**
 * Recursively find all files with spaces in their names
 */
function findFilesWithSpaces(dir) {
    const filesWithSpaces = [];

    try {
        const items = fs.readdirSync(dir, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(dir, item.name);

            if (item.isDirectory()) {
                // Recursively search subdirectories
                filesWithSpaces.push(...findFilesWithSpaces(fullPath));
            } else if (item.isFile()) {
                // Check if filename contains spaces
                if (item.name.includes(' ')) {
                    filesWithSpaces.push({
                        dir: dir,
                        oldName: item.name,
                        fullPath: fullPath
                    });
                }
            }
        }
    } catch (err) {
        console.error(`Error reading directory ${dir}:`, err.message);
        errors.push({ dir, error: err.message });
    }

    return filesWithSpaces;
}

/**
 * Rename files by replacing spaces with hyphens
 */
function renameFiles(files, dryRun = true) {
    console.log(`\n${dryRun ? '=== DRY RUN ===' : '=== RENAMING FILES ==='}`);
    console.log(`Found ${files.length} files with spaces in their names\n`);

    for (const file of files) {
        const newName = file.oldName.replace(/ /g, '-');
        const newPath = path.join(file.dir, newName);

        if (dryRun) {
            console.log(`Would rename:`);
            console.log(`  From: ${file.oldName}`);
            console.log(`  To:   ${newName}`);
            console.log(`  Path: ${file.dir.replace(PUBLIC_IMAGE_DIR, '/image')}`);
            console.log('');
            renames.push({
                oldPath: file.fullPath.replace(PUBLIC_IMAGE_DIR, '/image'),
                newPath: newPath.replace(PUBLIC_IMAGE_DIR, '/image'),
                oldName: file.oldName,
                newName: newName
            });
        } else {
            try {
                // Check if target file already exists
                if (fs.existsSync(newPath)) {
                    console.error(`ERROR: Target file already exists: ${newName}`);
                    errors.push({ file: file.oldName, error: 'Target file already exists' });
                    continue;
                }

                fs.renameSync(file.fullPath, newPath);
                console.log(`✓ Renamed: ${file.oldName} → ${newName}`);
                renames.push({
                    oldPath: file.fullPath.replace(PUBLIC_IMAGE_DIR, '/image'),
                    newPath: newPath.replace(PUBLIC_IMAGE_DIR, '/image'),
                    oldName: file.oldName,
                    newName: newName
                });
            } catch (err) {
                console.error(`✗ Failed to rename ${file.oldName}:`, err.message);
                errors.push({ file: file.oldName, error: err.message });
            }
        }
    }

    return renames;
}

/**
 * Generate a report of all renames for updating data files
 */
function generateReport(renames) {
    console.log('\n=== RENAME REPORT ===');
    console.log(`Total files to rename: ${renames.length}`);

    if (errors.length > 0) {
        console.log(`\nErrors encountered: ${errors.length}`);
        errors.forEach(err => {
            console.log(`  - ${err.file || err.dir}: ${err.error}`);
        });
    }

    // Save mapping to JSON for updating data files
    const reportPath = path.join(__dirname, 'rename-mapping.json');
    fs.writeFileSync(reportPath, JSON.stringify(renames, null, 2));
    console.log(`\nRename mapping saved to: ${reportPath}`);

    // Group by directory for better overview
    const byDirectory = {};
    renames.forEach(r => {
        const dir = path.dirname(r.oldPath);
        if (!byDirectory[dir]) byDirectory[dir] = [];
        byDirectory[dir].push(r);
    });

    console.log('\n=== FILES BY DIRECTORY ===');
    Object.keys(byDirectory).sort().forEach(dir => {
        console.log(`\n${dir} (${byDirectory[dir].length} files):`);
        byDirectory[dir].forEach(r => {
            console.log(`  ${r.oldName} → ${r.newName}`);
        });
    });
}

// Main execution
const args = process.argv.slice(2);
const dryRun = !args.includes('--execute');

console.log('Scanning for image files with spaces...');
const filesWithSpaces = findFilesWithSpaces(PUBLIC_IMAGE_DIR);

if (filesWithSpaces.length === 0) {
    console.log('No files with spaces found!');
    process.exit(0);
}

const renamedFiles = renameFiles(filesWithSpaces, dryRun);
generateReport(renamedFiles);

if (dryRun) {
    console.log('\n=== DRY RUN COMPLETE ===');
    console.log('To actually rename files, run:');
    console.log('  node scripts/rename-image-files.js --execute');
} else {
    console.log('\n=== RENAME COMPLETE ===');
    console.log('Next steps:');
    console.log('1. Review rename-mapping.json');
    console.log('2. Update data files with new image paths');
    console.log('3. Test locally before deploying');
}
