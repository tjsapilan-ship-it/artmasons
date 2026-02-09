import re
from pathlib import Path

def generate_slug(text):
    """Generate a slug from text."""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text

# Read HAMMER PRICE - POPULAR ARTS.txt
data_dir = Path(__file__).parent.parent / "data"
popular_price_file = data_dir / "HAMMER PRICE - POPULAR ARTS.txt"

for encoding in ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']:
    try:
        with open(popular_price_file, 'r', encoding=encoding) as f:
            content = f.read()
        print(f"Successfully read file with encoding: {encoding}")
        break
    except UnicodeDecodeError:
        continue

lines = [line.strip() for line in content.split('\n') if line.strip()]

print(f"Total lines: {len(lines)}")

# Find where actual data starts (after headers and artist section marker)
start_idx = 0
for i, line in enumerate(lines):
    if 'CLAUDE MONET' in line:
        start_idx = i + 1
        break

print(f"Starting parsing at line {start_idx}")

# Parse the file in groups of 4 (artwork, artist, location, price)
popular_hammer_prices = {}
i = start_idx

while i < len(lines) - 3:
    art_name = lines[i].strip()
    artist = lines[i + 1].strip()
    location = lines[i + 2].strip()
    price = lines[i + 3].strip()
    
    # Skip artist section headers (all caps artist names)
    if art_name in ['GUSTAV KLIMT', 'HENRI MATISSE', 'VINCENT VAN GOGH', 'CLAUDE MONET']:
        i += 1
        continue
    
    # Check if this looks like a valid entry
    if art_name and artist and location and price and '$' in price:
        slug = generate_slug(art_name)
        
        # Only add if not already present (keeps first occurrence)
        if slug not in popular_hammer_prices:
            popular_hammer_prices[slug] = {
                'name': art_name,
                'artist': artist,
                'price': price,
                'slug': slug
            }
            if len(popular_hammer_prices) <= 10:
                print(f"  Parsed: '{art_name}' -> {slug} = {price}")
        
        i += 4
    else:
        i += 1

print(f"\nParsed {len(popular_hammer_prices)} unique popular artworks")

# Now check against the current mapping in artworks.ts
artworks_file = data_dir / "artworks.ts"
with open(artworks_file, 'r', encoding='utf-8') as f:
    artworks_content = f.read()

# Extract the POPULAR_ART_HAMMER_PRICE_BY_SLUG mapping
import re
mapping_pattern = r'const POPULAR_ART_HAMMER_PRICE_BY_SLUG: Record<string, string> = \{([^}]+)\};'
match = re.search(mapping_pattern, artworks_content, re.DOTALL)

current_mapping = {}
if match:
    mapping_content = match.group(1)
    # Parse each line like: "slug": "price",
    for line in mapping_content.split('\n'):
        line = line.strip()
        if line and ':' in line:
            parts = line.split(':', 1)
            if len(parts) == 2:
                slug = parts[0].strip().strip('"')
                price = parts[1].strip().rstrip(',').strip('"')
                current_mapping[slug] = price

print(f"\nCurrent mapping has {len(current_mapping)} entries")

# Compare
print("\n" + "="*80)
print("COMPARISON: POPULAR ARTS Hammer Prices")
print("="*80)

# Find artworks in POPULAR file not in current mapping
missing_in_current = []
incorrect_prices = []
correct_prices = []

for slug, data in popular_hammer_prices.items():
    if slug not in current_mapping:
        missing_in_current.append(data)
    elif current_mapping[slug] != data['price']:
        incorrect_prices.append({
            'slug': slug,
            'name': data['name'],
            'current': current_mapping[slug],
            'correct': data['price']
        })
    else:
        correct_prices.append(slug)

# Find artworks in current mapping not in POPULAR file
extra_in_current = []
for slug in current_mapping:
    if slug not in popular_hammer_prices:
        extra_in_current.append(slug)

print(f"\n✓ Correct prices: {len(correct_prices)}")
print(f"✗ Incorrect prices: {len(incorrect_prices)}")
print(f"✗ Missing from current mapping: {len(missing_in_current)}")
print(f"ℹ Extra in current mapping (not in POPULAR file): {len(extra_in_current)}")

if incorrect_prices:
    print("\n" + "="*80)
    print("INCORRECT PRICES (needs fixing):")
    print("="*80)
    for item in incorrect_prices[:20]:
        print(f"\n'{item['name']}' ({item['slug']})")
        print(f"  Current: {item['current']}")
        print(f"  Correct: {item['correct']}")

if missing_in_current:
    print("\n" + "="*80)
    print(f"MISSING FROM CURRENT MAPPING ({len(missing_in_current)} artworks):")
    print("="*80)
    for item in missing_in_current[:20]:
        print(f"\n'{item['name']}' by {item['artist']}")
        print(f"  Slug: {item['slug']}")
        print(f"  Price: {item['price']}")

# Generate the corrected mapping
print("\n" + "="*80)
print("GENERATING CORRECTED MAPPING...")
print("="*80)

# Merge: use POPULAR prices where available, keep extras from current mapping
merged_mapping = {}

# Add all from POPULAR ARTS file
for slug, data in popular_hammer_prices.items():
    merged_mapping[slug] = data['price']

# Add extras from current mapping (from HAMMER PRICE.txt for famous art)
for slug, price in current_mapping.items():
    if slug not in merged_mapping:
        merged_mapping[slug] = price

print(f"\nMerged mapping will have {len(merged_mapping)} entries")
print(f"  From POPULAR ARTS: {len(popular_hammer_prices)}")
print(f"  From FAMOUS ART (kept): {len(extra_in_current)}")

# Write the new mapping to a file
output_file = Path(__file__).parent / "popular_art_hammer_mapping.txt"
entries = []
for slug in sorted(merged_mapping.keys()):
    price = merged_mapping[slug]
    entries.append(f'  "{slug}": "{price}"')

mapping_code = "const POPULAR_ART_HAMMER_PRICE_BY_SLUG: Record<string, string> = {\n" + ",\n".join(entries) + "\n};"

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(mapping_code)

print(f"\n✓ Written corrected mapping to: {output_file}")
print(f"\n{'='*80}")
print("SUMMARY:")
print("="*80)
if len(incorrect_prices) > 0 or len(missing_in_current) > 0:
    print(f"⚠️  Found {len(incorrect_prices)} incorrect prices and {len(missing_in_current)} missing entries")
    print("   The mapping needs to be updated in artworks.ts")
else:
    print("✓ All popular art hammer prices are correct!")
