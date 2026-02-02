# WEBP Image Conversion - Quick Start Guide

## Overview

You now have automated scripts to convert all images in your `public/image` folder to WEBP format. This will reduce file sizes by ~25-35% while maintaining quality.

## Step-by-Step Instructions

### Step 1: Install Dependencies

```bash
npm install
```

This installs `sharp` (image conversion library) and `tsx` (TypeScript runner).

### Step 2: Scan Image References (Optional but Recommended)

Before converting, see where images are referenced in your codebase:

```bash
npm run scan:images
```

This generates a report showing all `.jpg`, `.jpeg`, and `.png` references that will need updating.

### Step 3: Convert All Images

```bash
npm run convert:images
```

This:
- ✅ Scans `public/image/` recursively
- ✅ Converts all PNG/JPG/JPEG to WEBP
- ✅ Deletes original files after conversion
- ✅ Shows progress and statistics

**Expected output:**
```
🚀 Starting image conversion to WEBP...
📊 Found 150 image(s) to process
✅ SUCCESS: a/artist1.webp
...
============================================================
✅ Successful: 150
Duration: 45.23s
============================================================
```

### Step 4: Update Image References in Code

Update all files that reference the old image extensions:

**Find and Replace in your IDE:**

- Find: `\.jpg` → Replace with: `.webp`
- Find: `\.jpeg` → Replace with: `.webp`
- Find: `\.png` → Replace with: `.webp`

**Key files to update:**

1. **Data files** (contains image paths):
   - `data/artworks.ts`
   - `data/artistRecommendedImages.ts`
   - `data/popularCategories.ts`
   - `data/popularLandscapes.ts`
   - `data/popularPortraits.ts`
   - `data/popularStillLifes.ts`

2. **Components** (if hardcoding image paths):
   - `app/components/*.tsx`
   - `app/artworks/ClientProductDetails.tsx`

3. **CSS files** (if using background images):
   - `app/globals.css`
   - `app/watermark-overrides.css`

4. **API routes** (if serving images):
   - Check `app/api/**` files

### Step 5: Test

```bash
npm run dev
```

Verify images load correctly:
- Check various pages to ensure images display
- Open DevTools → Network tab to confirm `.webp` files are served
- Check performance improvements

## Files Created

```
scripts/
├── convert-images-to-webp.ts    (Main conversion script)
├── scan-image-references.ts     (Find references helper)
├── IMAGE_CONVERSION_GUIDE.md    (Detailed documentation)
└── QUICK_START.md               (This file)
```

## Rollback (if needed)

If something goes wrong, restore from git:

```bash
git restore public/image
```

Then review the conversion guide for troubleshooting.

## Performance Gains

After conversion, you should see:

- 📊 **~30% smaller total image size**
- ⚡ **Faster page loads**
- 📈 **Better SEO scores** (Core Web Vitals)
- 🌍 **Reduced bandwidth usage**

## Questions?

See the detailed [IMAGE_CONVERSION_GUIDE.md](./IMAGE_CONVERSION_GUIDE.md) for:
- Browser compatibility
- Quality settings
- Troubleshooting
- WEBP advantages

---

**Ready?** Run: `npm install && npm run scan:images && npm run convert:images`
