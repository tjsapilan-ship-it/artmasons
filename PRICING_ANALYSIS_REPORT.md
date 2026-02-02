# Pricing Consistency Analysis Report
## Top 100 Paintings Page vs Product Details Pages

**Analysis Date:** February 3, 2026  
**Files Analyzed:**
- `app/top-100/page.tsx` (matching logic on lines 77-102)
- `data/famousAndTop100.ts` (TOP_100_PAINTINGS source)
- `data/artworks.ts` (main product collection)

---

## Executive Summary

Out of **110 paintings** in the TOP_100_PAINTINGS collection:
- **54 artworks (49%)** are NOT found in the main ARTWORKS collection
- **10 artworks (9%)** have PRICE MISMATCHES between the two collections
- **46 artworks (42%)** match correctly with consistent pricing

---

## Critical Issues

### 1. ARTIST NAME DISCREPANCIES (Case-Sensitive Matching Problems)

The matching logic uses case-insensitive comparison but several artworks fail due to slight name variations:

| Famous Art | ARTWORKS | Issue |
|------------|----------|-------|
| **Wasilly Kadinsky** | Wassily Kadinsky | Spelling difference |
| **Diego Velázquez** | Diego Rodriguez De Silva Velazquez | Short name vs full name |
| **Johannes Vermeer Van Delft** | Johannes Vermeer | Different name format |
| **Johannes Vermeer** | Johannes Vermeer Van Delft | Reversed format |
| **Paul Cézanne** | Paul Cezanne | Accent character |
| **Francisco Goya** | Francisco de Goya | Missing "de" |
| **Edgar Degas** | Hilaire Germaine Edgar Degas | Short vs full name |
| **Van Rijn Rembrandt** | Rembrandt Van Rijn | Name order reversed |
| **El Greco** | Pompeo Girolamo Batoni | Wrong artist entirely |

### 2. TITLE NAME DISCREPANCIES

| Famous Art Title | ARTWORKS Title | Status |
|------------------|----------------|--------|
| **Napoleon Crossing The Alps** | Napoleon Crossing The Alps On 20th May 1800 1803 | Partial match |
| **The Kiss** | Not found | Missing from ARTWORKS |
| **The Girl With A Pearl Earring** | The Girl With The Pearl Earring | Article difference ("A" vs "The") |
| **Mona Lisa** | Mona Lisa (La Gioconda) | Subtitle added |
| **The Lady Of Shalott** | The Lady Of Shalotte | Spelling variation |
| **A Bar At The Folies-Bergere** | A Bar At The Folies-Begere | Spelling variation |
| **Portrait Of Johanna Staude** | Portrait of Johanna Straude | Spelling variation |

### 3. MAJOR PRICE DISCREPANCIES

| Rank | Artwork | Artist | Famous Art | ARTWORKS | Difference |
|------|---------|--------|------------|----------|------------|
| #101 | The Coronation Of Napoleon | Jacques-Louis David | **185,000** | 68,475 | **-116,525** |
| #110 | The Night Watch | Rembrandt Van Rijn | **76,500** | 29,800 | **-46,700** |
| #20 | Luncheon On The Boating Party | Pierre-Auguste Renoir | **46,500** | 23,250 | **-23,250** |
| #73 | Olympia | Edouard Manet | **11,895** | 5,880 | **-6,015** |
| #89 | Death Of Marat | Jacques-Louis David | **9,500** | 6,905 | **-2,595** |
| #104 | The Sacrifice Of Abraham | Rembrandt Van Rijn | **12,800** | 10,259 | **-2,541** |
| #49 | Crouching Woman (Jacqueline) | Pablo Picasso | **4,400** | 2,200 | **-2,200** |
| #97 | Salvator Mundi | Leonardo Da Vinci | **12,500** | 12,000 | **-500** |
| #105 | Old Woman Praying | Rembrandt Van Rijn | **2,950** | 2,569 | **-381** |
| #96 | Self Portrait With Bandaged Ear And Pipe | Vincent Van Gogh | **2,100** | 2,272 | **+172** |

---

## Artworks Not Available in Main Collection (54 total)

These TOP_100 artworks will display Famous Art pricing since no match is found:

### High Priority (Should be added to ARTWORKS)
1. **The Kiss** - Gustav Klimt (AED 4,500)
2. **The Birth Of Venus** - Sandro Botticelli (AED 12,750)
3. **Primavera** - Sandro Botticelli (AED 50,000)
4. **The Garden Of Earthly Delights** - Hieronymus Bosch (AED 62,500)
5. **The Sistine Madonna** - Raphaello Sanzio Rahael (AED 14,500)
6. **Ophelia** - Sir John Elliot Millaise (AED 23,800)
7. **Madame X** - John Singer Sargent (AED 13,060)

### Additional Van Gogh Works Missing
- The Cafe Terrace On The Place Du Forum (AED 4,000)
- Van Gogh's Bedroom At Arles (AED 2,500)
- Shoes (AED 1,672)
- Postman Joseph Roulin (AED 2,780)
- Still Life Vase With Fourteen Sunflowers (AED 3,200)
- Self Portrait With Bandaged Ear (AED 2,500)

### Additional Monet Works Missing
- Water Lily Pond Symphony In Green (AED 2,960)
- Woman With A Parasol Madame Monet (AED 4,900)
- Impression Sunrise (AED 2,200)
- Hay Stacks Sun In The Mist (AED 3,000)

---

## Recommendations

### Immediate Actions

1. **Fix Artist Name Inconsistencies**
   - Standardize artist names across both collections
   - Update famousAndTop100.ts to match ARTWORKS naming conventions
   - OR update the matching logic to handle name variations

2. **Resolve Price Discrepancies**
   - The 10 artworks with price mismatches need review to determine correct pricing
   - Update either famousAndTop100.ts or artworks.ts to align prices
   - Priority: The Coronation Of Napoleon (-116k AED), The Night Watch (-46k AED)

3. **Add Missing Artworks**
   - 54 artworks from TOP_100 are not in ARTWORKS
   - These should either be added to ARTWORKS or marked as "special collection only"

### Long-term Solutions

1. **Improve Matching Logic** (app/top-100/page.tsx lines 77-102)
   ```typescript
   // Current logic fails on:
   // - Accent characters (Cézanne vs Cezanne)
   // - Name order (Van Rijn Rembrandt vs Rembrandt Van Rijn)
   // - Partial names (Edgar Degas vs Hilaire Germaine Edgar Degas)
   
   // Consider fuzzy matching or normalized string comparison
   ```

2. **Maintain Single Source of Truth**
   - Consider using SKU-based matching instead of name/artist matching
   - Add a `famousArtSku` field to ARTWORKS entries that correspond to famous paintings
   - This would eliminate name-matching issues entirely

3. **Data Validation**
   - Add automated tests to catch pricing inconsistencies
   - Implement validation that ensures all TOP_100 entries have corresponding ARTWORKS entries

---

## Impact Assessment

### User Experience Impact
- **49% of TOP_100 paintings** show pricing from famousAndTop100.ts (fallback pricing)
- **9% of TOP_100 paintings** show incorrect pricing (price mismatch between collections)
- Users clicking through to product pages may see different prices than shown on TOP_100 page

### Business Impact
- Inconsistent pricing can erode customer trust
- Some price differences are significant (>100k AED difference)
- Missing artworks in main collection means lost sales opportunities

---

## Detailed Breakdown by Issue Type

### Artist Name Format Issues (8 artworks affected)
- Accent characters: Cézanne
- Name order: Rembrandt, Velázquez
- Full vs short names: Degas, Vermeer
- Spelling: Kadinsky

### Title Variations (7 artworks affected)
- Article differences: "A" vs "The"
- Spelling variations: Shalott vs Shalotte
- Additional context: "On 20th May 1800" suffix
- Subtitles: "(La Gioconda)"

### Completely Missing (54 artworks affected)
- Never added to ARTWORKS collection
- Will use fallback pricing from famousAndTop100.ts
- Links will use getFamousArtworkSlug() instead of getArtworkSlug()

---

## Next Steps

1. ✅ **Analysis Complete** - This report documents all discrepancies
2. ⏳ **Decision Required** - Determine correct pricing for the 10 mismatched items
3. ⏳ **Data Cleanup** - Standardize artist/title names across collections
4. ⏳ **Add Missing Works** - Import 54 missing artworks to ARTWORKS collection
5. ⏳ **Testing** - Verify all TOP_100 paintings display correctly with accurate pricing

---

**Generated by:** Automated pricing consistency analysis
**Script:** analyze-pricing.ts
