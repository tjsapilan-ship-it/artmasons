const fs = require('fs');
const path = require('path');

// Configuration
const ROOT_DIR = path.join(__dirname, '..');
const EXTENSIONS_TO_UPDATE = ['.ts', '.tsx', '.js', '.jsx'];
const DIRECTORIES_TO_SCAN = ['app', 'data', 'components'];

// Statistics
let stats = {
    filesScanned: 0,
    filesUpdated: 0,
    replacements: 0
};

/**
 * Recursively find all code files
 */
function findCodeFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) {
        return fileList;
    }

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);

        // Skip node_modules and .next directories
        if (file === 'node_modules' || file === '.next' || file === '.git') {
            return;
        }

        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findCodeFiles(filePath, fileList);
        } else {
            const ext = path.extname(file);
            if (EXTENSIONS_TO_UPDATE.includes(ext)) {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

/**
 * Update image references in a file
 */
function updateFileReferences(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let fileReplacements = 0;

    // Pattern to match image references
    // Matches: .jpg, .jpeg, .png (case insensitive)
    const patterns = [
        /\.jpg(['"`])/gi,
        /\.jpeg(['"`])/gi,
        /\.png(['"`])/gi
    ];

    patterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
            fileReplacements += matches.length;
            content = content.replace(pattern, '.webp$1');
        }
    });

    // Only write if changes were made
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${path.relative(ROOT_DIR, filePath)} (${fileReplacements} replacements)`);
        stats.filesUpdated++;
        stats.replacements += fileReplacements;
        return true;
    }

    return false;
}

/**
 * Main update function
 */
function updateAllReferences() {
    console.log('🔍 Scanning for code files to update...\n');

    let allFiles = [];
    DIRECTORIES_TO_SCAN.forEach(dir => {
        const dirPath = path.join(ROOT_DIR, dir);
        const files = findCodeFiles(dirPath);
        allFiles = allFiles.concat(files);
    });

    stats.filesScanned = allFiles.length;
    console.log(`📊 Found ${stats.filesScanned} code files to scan\n`);
    console.log('🚀 Updating image references...\n');

    allFiles.forEach(filePath => {
        updateFileReferences(filePath);
    });

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📈 UPDATE SUMMARY');
    console.log('='.repeat(60));
    console.log(`Files scanned:         ${stats.filesScanned}`);
    console.log(`Files updated:         ${stats.filesUpdated}`);
    console.log(`Total replacements:    ${stats.replacements}`);
    console.log('='.repeat(60));

    if (stats.filesUpdated > 0) {
        console.log('\n✨ Image references successfully updated to WebP!');
        console.log('\n📝 Next steps:');
        console.log('   1. Test your site: npm run dev');
        console.log('   2. Verify all images load correctly');
        console.log('   3. Check browser DevTools to confirm WebP format');
    } else {
        console.log('\n✅ No image references needed updating!');
    }
}

// Run the update
updateAllReferences();
