import fs from 'fs';
import path from 'path';

/**
 * Script to find all image references in the codebase
 * Helps identify which files need to be updated after WEBP conversion
 */

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'];
const SCAN_DIRS = [
  'app',
  'data',
  'public',
  'styles',
];

interface ImageReference {
  file: string;
  line: number;
  content: string;
  imageFile: string;
  extension: string;
}

const references: ImageReference[] = [];

/**
 * Recursively scan files for image references
 */
function scanDirectory(dir: string) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and other build directories
      if (!['node_modules', '.next', 'dist', 'build', '.git'].includes(file)) {
        scanDirectory(filePath);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      // Scan TypeScript, JavaScript, CSS, and JSON files
      if (['.ts', '.tsx', '.js', '.jsx', '.css', '.json'].includes(ext)) {
        scanFile(filePath);
      }
    }
  }
}

/**
 * Scan a single file for image references
 */
function scanFile(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, lineNum) => {
      // Look for image file references with extensions
      IMAGE_EXTENSIONS.forEach((ext) => {
        const regex = new RegExp(
          `([\\w\\-\\/\\.]+\\.${ext})`,
          'gi',
        );
        let match;

        while ((match = regex.exec(line)) !== null) {
          const imageFile = match[1];
          // Filter out false positives
          if (
            imageFile.includes('public/image') ||
            imageFile.includes('/image/') ||
            imageFile.startsWith('/')
          ) {
            references.push({
              file: filePath,
              line: lineNum + 1,
              content: line.trim(),
              imageFile,
              extension: ext,
            });
          }
        }
      });
    });
  } catch (error) {
    // Skip files that can't be read
  }
}

/**
 * Generate report
 */
function generateReport() {
  console.log('\n🔍 Image Reference Scan Results\n');
  console.log('='.repeat(80));

  if (references.length === 0) {
    console.log('✅ No image references found!');
    console.log('='.repeat(80));
    return;
  }

  // Group by extension
  const byExtension = new Map<string, ImageReference[]>();
  references.forEach((ref) => {
    const ext = ref.extension.toUpperCase();
    if (!byExtension.has(ext)) {
      byExtension.set(ext, []);
    }
    byExtension.get(ext)!.push(ref);
  });

  // Print summary
  console.log(`📊 Total image references found: ${references.length}\n`);

  byExtension.forEach((refs, ext) => {
    console.log(`${ext} files: ${refs.length}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('📝 Detailed References:\n');

  // Group by file
  const byFile = new Map<string, ImageReference[]>();
  references.forEach((ref) => {
    if (!byFile.has(ref.file)) {
      byFile.set(ref.file, []);
    }
    byFile.get(ref.file)!.push(ref);
  });

  byFile.forEach((refs, file) => {
    console.log(`📄 ${path.relative(process.cwd(), file)}`);
    refs.forEach((ref) => {
      console.log(`   Line ${ref.line}: ${ref.imageFile}`);
      console.log(`   ${ref.content.substring(0, 70)}`);
    });
    console.log();
  });

  console.log('='.repeat(80));
  console.log('\n📌 Next Steps:');
  console.log('1. Run: npm run convert:images');
  console.log('2. Update references above by replacing extensions:');
  IMAGE_EXTENSIONS.forEach((ext) => {
    console.log(`   .${ext} → .webp`);
  });
}

// Run the scan
console.log('🔍 Scanning for image references...\n');
SCAN_DIRS.forEach(scanDirectory);
generateReport();
