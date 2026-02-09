import re
from pathlib import Path

def generate_slug(text):
    """Generate a slug from text."""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text

def parse_hammer_price_file(file_path):
    """Parse the hammer price file and return a mapping."""
    # Try different encodings
    for encoding in ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']:
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                content = f.read()
            print(f"Successfully read file with encoding: {encoding}")
            break
        except UnicodeDecodeError:
            continue
    else:
        print("ERROR: Could not read file with any encoding")
        return {}
    
    lines = [line.strip() for line in content.split('\n') if line.strip()]
    
    print(f"Total lines: {len(lines)}")
    print("First 20 lines:")
    for i, line in enumerate(lines[:20]):
        print(f"  {i}: {line}")
    
    # Find the FAMOUS ART marker
    start_idx = None
    for i, line in enumerate(lines):
        if 'FAMOUS ART' in line:
            start_idx = i + 1
            break
    
    if start_idx is None:
        print("ERROR: Could not find 'FAMOUS ART' marker")
        return {}
    
    print(f"\nStarting to parse from line {start_idx}")
    
    hammer_price_map = {}
    i = start_idx
    entry_count = 0
    
    while i < len(lines) - 3:
        art_name = lines[i].strip()
        artist = lines[i + 1].strip()
        location = lines[i + 2].strip()
        hammer_price = lines[i + 3].strip()
        
        if entry_count < 5:
            print(f"\nEntry {entry_count + 1} (lines {i}-{i+3}):")
            print(f"  Art: {art_name}")
            print(f"  Artist: {artist}")
            print(f"  Location: {location}")
            print(f"  Price: {hammer_price}")
        
        if art_name and artist and location and hammer_price:
            slug = generate_slug(art_name)
            
            # Only add if not already in map (keeps first occurrence)
            if slug not in hammer_price_map:
                hammer_price_map[slug] = hammer_price
                entry_count += 1
            
            i += 4
        else:
            i += 1
    
    print(f"\nParsed {len(hammer_price_map)} unique artworks")
    return hammer_price_map

def generate_typescript_mapping(hammer_price_map):
    """Generate TypeScript mapping code."""
    entries = []
    for slug in sorted(hammer_price_map.keys()):
        price = hammer_price_map[slug]
        entries.append(f'  "{slug}": "{price}"')
    
    return "const POPULAR_ART_HAMMER_PRICE_BY_SLUG: Record<string, string> = {\n" + ",\n".join(entries) + "\n};"

if __name__ == "__main__":
    # File paths
    data_dir = Path(__file__).parent.parent / "data"
    hammer_price_file = data_dir / "HAMMER PRICE.txt"
    output_file = Path(__file__).parent / "hammer_price_mapping.txt"
    
    print(f"Reading from: {hammer_price_file}")
    
    # Parse the file
    hammer_price_map = parse_hammer_price_file(hammer_price_file)
    
    # Generate TypeScript mapping
    ts_mapping = generate_typescript_mapping(hammer_price_map)
    
    # Write to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(ts_mapping)
    
    print(f"\nMapping written to: {output_file}")
    print(f"Total entries: {len(hammer_price_map)}")
    
    # Show sample
    print("\nSample entries:")
    for i, (slug, price) in enumerate(sorted(hammer_price_map.items())[:10]):
        print(f'  "{slug}": "{price}"')
