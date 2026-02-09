import re
import json
from pathlib import Path

def generate_slug(text):
    """Generate a slug from text."""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text

# Read HAMMER PRICE.txt
data_dir = Path(__file__).parent.parent / "data"
hammer_price_file = data_dir / "HAMMER PRICE.txt"

for encoding in ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']:
    try:
        with open(hammer_price_file, 'r', encoding=encoding) as f:
            content = f.read()
        break
    except UnicodeDecodeError:
        continue

lines = [line.strip() for line in content.split('\n') if line.strip()]

# Find start
start_idx = None
for i, line in enumerate(lines):
    if 'FAMOUS ART' in line:
        start_idx = i + 1
        break

# Parse hammer prices
hammer_prices = {}
i = start_idx
while i < len(lines) - 3:
    art_name = lines[i].strip()
    artist = lines[i + 1].strip()
    location = lines[i + 2].strip()
    price = lines[i + 3].strip()
    
    if art_name and artist and location and price:
        slug = generate_slug(art_name)
        if slug not in hammer_prices:
            hammer_prices[slug] = {
                'name': art_name,
                'artist': artist,
                'price': price,
                'slug': slug
            }
    i += 4

print(f"Found {len(hammer_prices)} unique artworks in HAMMER PRICE.txt")

# Now check artworks.ts to see which ones match
# We'll read the TypeScript file and extract slugs from it
artworks_file = data_dir / "artworks.ts"
with open(artworks_file, 'r', encoding='utf-8') as f:
    artworks_content = f.read()

# Extract all slugs from artworks.ts
slug_pattern = re.compile(r'slug:\s*["\']([^"\']+)["\']')
artwork_slugs = set(slug_pattern.findall(artworks_content))

print(f"Found {len(artwork_slugs)} artwork slugs in artworks.ts")

# Find mismatches
matched = []
unmatched = []

for slug, data in hammer_prices.items():
    if slug in artwork_slugs:
        matched.append(data)
    else:
        unmatched.append(data)

print(f"\nMatched: {len(matched)}")
print(f"Unmatched: {len(unmatched)}")

if unmatched:
    print("\n" + "="*80)
    print("Artworks in HAMMER PRICE.txt NOT found in database:")
    print("="*80)
    
    for item in unmatched:
        print(f"\n'{item['name']}' by {item['artist']}")
        print(f"  Expected slug: {item['slug']}")
        print(f"  Price: {item['price']}")

print("\n" + "="*80)
print("Summary:")
print("="*80)
print(f"Total artworks in HAMMER PRICE.txt: {len(hammer_prices)}")
print(f"Successfully matched to database: {len(matched)}")
print(f"Not found in database: {len(unmatched)}")

if len(unmatched) > 0:
    print(f"\n⚠️  {len(unmatched)} artworks have hammer prices but are missing from the database!")
    print("These famous artworks should be added to the database.")
