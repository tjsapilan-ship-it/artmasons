import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg'];
const PUBLIC_IMAGE_DIR = path.join(process.cwd(), 'public', 'image');
const WEBP_QUALITY = 80; // Quality level for WEBP (0-100)

interface ConversionStats {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
  startTime: number;
  endTime: number;
}

const stats: ConversionStats = {
  total: 0,
  successful: 0,
  failed: 0,
  skipped: 0,
  startTime: Date.now(),
  endTime: 0,
};

/**
 * Recursively finds all image files in a directory
 */
function findImageFiles(dir: string): string[] {
  const imageFiles: string[] = [];

  function walkDir(currentPath: string) {
    const files = fs.readdirSync(currentPath);

    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (
        stat.isFile() &&
        IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase())
      ) {
        imageFiles.push(filePath);
      }
    }
  }

  walkDir(dir);
  return imageFiles;
}

/**
 * Converts a single image to WEBP format
 */
async function convertImageToWebp(
  inputPath: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

    // Skip if WEBP version already exists
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  SKIPPED: ${path.relative(PUBLIC_IMAGE_DIR, inputPath)} (WEBP already exists)`);
      stats.skipped++;
      return { success: true };
    }

    // Read the image
    const image = sharp(inputPath);

    // Get metadata to check dimensions
    const metadata = await image.metadata();
    console.log(
      `📝 Converting: ${path.relative(PUBLIC_IMAGE_DIR, inputPath)} (${metadata.width}x${metadata.height})`,
    );

    // Convert to WEBP
    await image
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);

    // Delete original file
    fs.unlinkSync(inputPath);

    console.log(
      `✅ SUCCESS: ${path.relative(PUBLIC_IMAGE_DIR, outputPath)}`,
    );
    stats.successful++;

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ ERROR: ${path.relative(PUBLIC_IMAGE_DIR, inputPath)} - ${errorMessage}`);
    stats.failed++;
    return { success: false, error: errorMessage };
  }
}

/**
 * Main conversion function
 */
async function convertAllImages(): Promise<void> {
  try {
    // Check if public/image directory exists
    if (!fs.existsSync(PUBLIC_IMAGE_DIR)) {
      console.error(`❌ Directory not found: ${PUBLIC_IMAGE_DIR}`);
      process.exit(1);
    }

    console.log('🚀 Starting image conversion to WEBP...');
    console.log(`📁 Target directory: ${PUBLIC_IMAGE_DIR}`);
    console.log(`⚙️  Quality: ${WEBP_QUALITY}\n`);

    // Find all image files
    const imageFiles = findImageFiles(PUBLIC_IMAGE_DIR);
    stats.total = imageFiles.length;

    if (imageFiles.length === 0) {
      console.log('ℹ️  No image files found to convert.');
      return;
    }

    console.log(`📊 Found ${imageFiles.length} image(s) to process\n`);

    // Convert each image sequentially
    for (const imagePath of imageFiles) {
      await convertImageToWebp(imagePath);
    }

    stats.endTime = Date.now();
    const duration = ((stats.endTime - stats.startTime) / 1000).toFixed(2);

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 CONVERSION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total files processed: ${stats.total}`);
    console.log(`✅ Successful: ${stats.successful}`);
    console.log(`⏭️  Skipped: ${stats.skipped}`);
    console.log(`❌ Failed: ${stats.failed}`);
    console.log(`⏱️  Duration: ${duration}s`);
    console.log('='.repeat(60));

    if (stats.failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal error during conversion:', error);
    process.exit(1);
  }
}

// Run the conversion
convertAllImages();
