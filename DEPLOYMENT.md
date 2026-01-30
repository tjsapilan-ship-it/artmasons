# Deployment Instructions

## Summary

Fixed image display issues on Vercel by renaming 1,112 image files (replacing spaces with hyphens) and updating 1,003 data file references.

## Git Commit & Deploy

Run the following commands to commit and deploy:

```bash
# Stage all changes
git add -A

# Commit with descriptive message
git commit -m "Fix image display issues on Vercel

- Renamed 1,112 image files: replaced spaces with hyphens
- Updated 1,003 image path references in data files (artworks.ts, artworksNZ.ts, famousAndTop100.ts)
- Fixed Picasso and Still Life image display issues
- Verified build passes with no errors

Root cause: Spaces in filenames work locally but fail on Linux servers"

# Push to trigger Vercel deployment
git push
```

## Post-Deployment Verification

After Vercel completes the deployment:

1. **Test Picasso category**:
   - Visit: `https://[your-domain]/popular-art/picasso`
   - Verify all artwork images load correctly

2. **Test Still Life category**:
   - Visit: `https://[your-domain]/popular-art/still-lifes`
   - Verify all artwork images display properly

3. **Check browser Network tab**:
   - Open DevTools → Network tab
   - Filter for images
   - Confirm no 404 errors for image files

## Expected Results

✅ All Picasso artworks display correctly  
✅ All Still Life artworks show images  
✅ No 404 errors in browser console  
✅ Build and deployment succeed on Vercel

## Rollback (if needed)

If any issues arise:

```bash
git revert HEAD
git push
```

This will revert the changes and restore the previous state.
