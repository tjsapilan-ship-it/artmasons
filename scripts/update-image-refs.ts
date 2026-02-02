import fs from 'fs';
import path from 'path';

/**
 * Utility script to automatically replace image extensions in TypeScript/JavaScript files
 * Usage: npm run update:image-refs
 * 
 * This script will:
 * 1. Find all .ts, .tsx, .js, .jsx files in app/ and data/ directories
 * 2. Replace .jpg, .jpeg, .png references with .webp
 * 3. Create backups before making changes
 */

const TARGET_DIRS = ['app', 'data'];
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'];
const BACKUP_DIR = '.image-conversion-backups';

interface FileUpdate {
  file: string;
  changesCount: number;
  originalContent: string;
}

const updates: FileUpdate[] = [];

/**
 * Create backup directory
 */
function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

/**
 * Recursively find all code files
 */
function findCodeFiles(dir: string): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) return files;

  function walk(currentPath: string) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const filePath = path.join(currentPath, item);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        if (!['node_modules', '.next', '.git'].includes(item)) {
          walk(filePath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
          files.push(filePath);
        }
      }
    }
  }

  walk(dir);
  return files;
}

/**
 * Update image extensions in a file
 */
function updateImageExtensions(filePath: string) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    let changesCount = 0;

    // Replace each extension
    IMAGE_EXTENSIONS.forEach((ext) => {
      // Match patterns like: /image/xxx.jpg, 'xxx.jpg', "xxx.jpg"
      const regex = new RegExp(
        `(\\.${ext}\\b(?=[\\s'"]|$))`,
        'gi',
      );

      // Count matches before replacing
      const matches = content.match(regex);
      if (matches) {
        changesCount += matches.length;
      }

      // Replace extensions
      content = content.replace(regex, '.webp');
    });

    if (changesCount > 0) {
      // Create backup
      const backupPath = path.join(
        BACKUP_DIR,
        path.relative(process.cwd(), filePath).replace(/[/\\]/g, '_'),
      );
      fs.writeFileSync(backupPath, originalContent);

      // Write updated file
      fs.writeFileSync(filePath, content);

      console.log(`✅ Updated: ${path.relative(process.cwd(), filePath)} (${changesCount} changes)`);
      updates.push({
        file: filePath,
        changesCount,
        originalContent,
      });
    }
  } catch (error) {
    console.error(
      `❌ Error processing ${path.relative(process.cwd(), filePath)}:`,
      error,
    );
  }
}

/**
 * Main function
 */
function main() {
  console.log('🔄 Updating image references from .jpg/.jpeg/.png to .webp\n');

  ensureBackupDir();

  let totalFiles = 0;
  let totalChanges = 0;

  TARGET_DIRS.forEach((dir) => {
    const files = findCodeFiles(dir);
    totalFiles += files.length;

    files.forEach((file) => {
      updateImageExtensions(file);
    });
  });

  const changedFiles = updates.length;
  const totalChangesCount = updates.reduce((sum, u) => sum + u.changesCount, 0);

  console.log('\n' + '='.repeat(60));
  console.log('📊 Update Summary');
  console.log('='.repeat(60));
  console.log(`📁 Files scanned: ${totalFiles}`);
  console.log(`✅ Files updated: ${changedFiles}`);
  console.log(`🔄 Total replacements: ${totalChangesCount}`);
  console.log(`💾 Backups created in: ${BACKUP_DIR}/`);
  console.log('='.repeat(60));

  if (changedFiles === 0) {
    console.log(
      '\nℹ️  No image references found. Are the images already converted?',
    );
  } else {
    console.log(
      '\n✨ Image references updated successfully!',
    );
    console.log(
      '💡 To rollback changes, restore files from the .image-conversion-backups directory',
    );
  }
}

main();
