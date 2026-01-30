const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const QUALITY = 85;
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// Statistics
let stats = {
    total: 0,
    converted: 0,
    skipped: 0,
    errors: 0,
    originalSize: 0,
    webpSize: 0
};

/**
 * Recursively find all image files in a directory
 */
function findImages(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findImages(filePath, fileList);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (EXTENSIONS.includes(ext)) {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

/**
 * Convert a single image to WebP
 */
async function convertToWebP(imagePath) {
    try {
        const ext = path.extname(imagePath);
        const webpPath = imagePath.replace(new RegExp(`${ext}$`, 'i'), '.webp');

        // Skip if WebP already exists
        if (fs.existsSync(webpPath)) {
            console.log(`⏭️  Skipped (already exists): ${path.relative(PUBLIC_DIR, imagePath)}`);
            stats.skipped++;
            return;
        }

        // Get original file size
        const originalStats = fs.statSync(imagePath);
        stats.originalSize += originalStats.size;

        // Convert to WebP
        await sharp(imagePath)
            .webp({ quality: QUALITY })
            .toFile(webpPath);

        // Get WebP file size
        const webpStats = fs.statSync(webpPath);
        stats.webpSize += webpStats.size;

        const reduction = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1);
        console.log(`✅ Converted: ${path.relative(PUBLIC_DIR, imagePath)} (${reduction}% smaller)`);
        stats.converted++;

    } catch (error) {
        console.error(`❌ Error converting ${imagePath}:`, error.message);
        stats.errors++;
    }
}

/**
 * Main conversion function
 */
async function convertAllImages() {
    console.log('🔍 Scanning for images in public directory...\n');

    const images = findImages(PUBLIC_DIR);
    stats.total = images.length;

    console.log(`📊 Found ${stats.total} images to process\n`);
    console.log('🚀 Starting conversion...\n');

    for (const imagePath of images) {
        await convertToWebP(imagePath);
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📈 CONVERSION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total images found:    ${stats.total}`);
    console.log(`Successfully converted: ${stats.converted}`);
    console.log(`Skipped (existing):    ${stats.skipped}`);
    console.log(`Errors:                ${stats.errors}`);
    console.log('');

    if (stats.converted > 0) {
        const totalOriginalMB = (stats.originalSize / 1024 / 1024).toFixed(2);
        const totalWebpMB = (stats.webpSize / 1024 / 1024).toFixed(2);
        const totalReduction = ((1 - stats.webpSize / stats.originalSize) * 100).toFixed(1);
        const savedMB = (totalOriginalMB - totalWebpMB).toFixed(2);

        console.log(`Original size:         ${totalOriginalMB} MB`);
        console.log(`WebP size:             ${totalWebpMB} MB`);
        console.log(`Total reduction:       ${totalReduction}% (saved ${savedMB} MB)`);
    }
    console.log('='.repeat(60));

    if (stats.errors > 0) {
        console.log('\n⚠️  Some images failed to convert. Please check the errors above.');
    } else if (stats.converted > 0) {
        console.log('\n✨ All images successfully converted to WebP!');
        console.log('\n📝 Next steps:');
        console.log('   1. Run: npm run update:refs');
        console.log('   2. Test your site to ensure images load correctly');
        console.log('   3. Delete original JPG/PNG files if everything works');
    } else {
        console.log('\n✅ All images already converted!');
    }
}

// Run the conversion
convertAllImages().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
