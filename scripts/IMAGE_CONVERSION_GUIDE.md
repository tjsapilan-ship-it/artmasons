# Image Conversion to WEBP

This script automates the conversion of all PNG, JPG, and JPEG images in the `public/image` directory to modern WEBP format.

## Features

- ✅ Recursively converts all images in subdirectories
- ✅ Maintains directory structure
- ✅ Preserves image quality (configurable)
- ✅ Skips already converted images
- ✅ Deletes original files after successful conversion
- ✅ Detailed conversion logging and statistics
- ✅ Error handling and reporting

## Installation

The script uses `sharp`, which is already added to your dependencies. First, install it:

```bash
npm install
```

## Usage

Run the conversion script with:

```bash
npm run convert:images
```

### What the script does:

1. Scans the entire `public/image` directory recursively
2. Finds all `.png`, `.jpg`, and `.jpeg` files
3. Converts each to `.webp` format with quality level 80
4. Deletes the original file after successful conversion
5. Skips files that already have a `.webp` version
6. Displays detailed progress and summary statistics

## Example Output

```
🚀 Starting image conversion to WEBP...
📁 Target directory: C:\xampp\htdocs\artmasons\public\image
⚙️  Quality: 80

📊 Found 150 image(s) to process

📝 Converting: a/artist1.jpg (800x600)
✅ SUCCESS: a/artist1.webp
📝 Converting: b/artwork.png (1200x800)
✅ SUCCESS: b/artwork.webp
⏭️  SKIPPED: c/existing.webp (WEBP already exists)

============================================================
📊 CONVERSION SUMMARY
============================================================
Total files processed: 150
✅ Successful: 148
⏭️  Skipped: 2
❌ Failed: 0
⏱️  Duration: 45.23s
============================================================
```

## Updating Image References

After conversion, you need to update your code to use `.webp` files instead of the original formats. Here are the key areas:

### 1. **Next.js Image Components**

Update any hardcoded image paths:

```tsx
// Before
<Image src="/image/artwork.jpg" alt="..." />

// After
<Image src="/image/artwork.webp" alt="..." />
```

### 2. **Data Files**

Update `data/artworks.ts`, `data/artistRecommendedImages.ts`, etc.:

```ts
// Before
{ src: "/image/a/artist1.jpg", ... }

// After
{ src: "/image/a/artist1.webp", ... }
```

### 3. **CSS Background Images**

Update CSS files that reference images:

```css
/* Before */
background-image: url('/image/bg.jpg');

/* After */
background-image: url('/image/bg.webp');
```

### 4. **HTML img tags**

If any HTML directly uses `<img>` tags:

```html
<!-- Before -->
<img src="/image/photo.jpg" alt="..." />

<!-- After -->
<img src="/image/photo.webp" alt="..." />
```

## Browser Compatibility

WEBP is supported in all modern browsers:
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (14.1+)
- Mobile browsers: ✅ Full support

For legacy browser support, use the `<picture>` element:

```tsx
<picture>
  <source srcSet="/image/artwork.webp" type="image/webp" />
  <img src="/image/artwork.jpg" alt="Artwork" />
</picture>
```

## Configuration

To adjust conversion settings, edit `scripts/convert-images-to-webp.ts`:

```ts
const WEBP_QUALITY = 80; // Change quality (0-100)
```

Higher values = better quality but larger file sizes
- 80 = Good balance (recommended)
- 90-100 = Minimal compression
- 60-70 = Aggressive compression

## Troubleshooting

### Script fails with "Module not found"
Make sure sharp is installed:
```bash
npm install sharp
```

### Some images don't convert
Check the console output for specific error messages. Common issues:
- Corrupted source image files
- Insufficient disk space
- File permissions issues

### Need to restore original files?
If you have git version control, you can restore originals:
```bash
git restore public/image
```

## Performance Notes

- Conversion time depends on image count and size
- Processing is sequential (one image at a time)
- Average conversion speed: ~50-100 images per minute

## WEBP Advantages

- **File size**: ~25-35% smaller than JPEG/PNG
- **Quality**: Same visual quality at smaller sizes
- **Features**: Supports transparency (like PNG) and better compression
- **Performance**: Faster loading times improve SEO and UX

---

**Important**: Backup your images before running the conversion for the first time!
