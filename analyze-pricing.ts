import { ARTWORKS } from './data/artworks';
import { TOP_100_PAINTINGS, FamousArtwork } from './data/famousAndTop100';

interface PricingDiscrepancy {
  rank: number;
  title: string;
  artist: string;
  famousArtPrice: number;
  artworksPrice: number | null;
  matchFound: boolean;
  titleMatch: boolean;
  artistMatch: boolean;
  notes: string;
}

const discrepancies: PricingDiscrepancy[] = [];

// Analyze each TOP_100_PAINTINGS entry
TOP_100_PAINTINGS.forEach((famousArt: FamousArtwork, index: number) => {
  const rank = index + 1;
  
  // Try to find matching artwork in ARTWORKS (same logic as page.tsx)
  const matchingArtwork = ARTWORKS.find(
    (a) =>
      (a.name ?? "").toLowerCase() === famousArt.title.toLowerCase() &&
      (a.artist ?? "").toLowerCase() === famousArt.artist.toLowerCase(),
  );

  // Get the minimum price from famous art
  const hasOptions = Array.isArray(famousArt.options) && famousArt.options.length > 0;
  const minOption = hasOptions
    ? famousArt.options.reduce((min, option) => (option.price < min.price ? option : min), famousArt.options[0])
    : null;
  const famousArtPrice = minOption?.price ?? famousArt.basePrice ?? 0;

  let artworksPrice: number | null = null;
  if (matchingArtwork) {
    const hasArtworkOptions = Array.isArray(matchingArtwork.options) && matchingArtwork.options.length > 0;
    const minArtworkOption = hasArtworkOptions && matchingArtwork.options
      ? matchingArtwork.options.reduce((min, option) => (option.price < min.price ? option : min), matchingArtwork.options[0])
      : null;
    artworksPrice = minArtworkOption?.price ?? matchingArtwork.basePrice ?? matchingArtwork.price ?? null;
  }

  // Check for partial matches (title OR artist matches but not both)
  const titleMatches = ARTWORKS.filter(
    (a) => (a.name ?? "").toLowerCase() === famousArt.title.toLowerCase()
  );
  
  const artistMatches = ARTWORKS.filter(
    (a) => (a.artist ?? "").toLowerCase() === famousArt.artist.toLowerCase()
  );

  let notes = "";
  
  if (!matchingArtwork) {
    if (titleMatches.length > 0) {
      notes = `Title match found but artist differs. ARTWORKS has: ${titleMatches.map(a => a.artist).join(", ")}`;
    } else if (artistMatches.length > 0) {
      notes = `Artist match found but title differs. Possible titles in ARTWORKS: ${artistMatches.slice(0, 3).map(a => a.name).join(", ")}`;
    } else {
      notes = "No match found in ARTWORKS - not available for sale on website";
    }
  } else if (famousArtPrice !== artworksPrice) {
    notes = `PRICE MISMATCH: Famous Art shows ${famousArt.currency} ${famousArtPrice}, but ARTWORKS shows ${matchingArtwork.currency || 'AED'} ${artworksPrice}`;
  } else {
    notes = "Exact match - prices consistent";
  }

  // Only add entries that are problematic or interesting
  if (!matchingArtwork || famousArtPrice !== artworksPrice) {
    discrepancies.push({
      rank,
      title: famousArt.title,
      artist: famousArt.artist,
      famousArtPrice,
      artworksPrice,
      matchFound: !!matchingArtwork,
      titleMatch: titleMatches.length > 0,
      artistMatch: artistMatches.length > 0,
      notes,
    });
  }
});

// Print results
console.log("=".repeat(100));
console.log("PRICING CONSISTENCY ANALYSIS: TOP 100 PAINTINGS vs ARTWORKS");
console.log("=".repeat(100));
console.log();
console.log(`Total paintings analyzed: ${TOP_100_PAINTINGS.length}`);
console.log(`Discrepancies found: ${discrepancies.length}`);
console.log();
console.log("=".repeat(100));
console.log();

// Group discrepancies by type
const noMatch = discrepancies.filter(d => !d.matchFound);
const priceMismatch = discrepancies.filter(d => d.matchFound && d.artworksPrice !== d.famousArtPrice);

if (noMatch.length > 0) {
  console.log(`\n📋 ARTWORKS NOT FOUND IN MAIN COLLECTION (${noMatch.length}):`);
  console.log("=".repeat(100));
  noMatch.forEach(d => {
    console.log(`\nRank #${d.rank}: "${d.title}" by ${d.artist}`);
    console.log(`  Famous Art Price: AED ${d.famousArtPrice}`);
    console.log(`  Status: ${d.notes}`);
  });
}

if (priceMismatch.length > 0) {
  console.log(`\n\n💰 PRICE MISMATCHES (${priceMismatch.length}):`);
  console.log("=".repeat(100));
  priceMismatch.forEach(d => {
    console.log(`\nRank #${d.rank}: "${d.title}" by ${d.artist}`);
    console.log(`  Famous Art Price: AED ${d.famousArtPrice}`);
    console.log(`  ARTWORKS Price: AED ${d.artworksPrice}`);
    console.log(`  Difference: AED ${Math.abs(d.famousArtPrice - (d.artworksPrice || 0))}`);
  });
}

console.log("\n" + "=".repeat(100));
console.log("END OF ANALYSIS");
console.log("=".repeat(100));
