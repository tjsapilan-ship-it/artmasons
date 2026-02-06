import re
import os

def parse_ts_file_with_lines(filepath):
    """
    Roughly parse a .ts file for artwork objects and capture line numbers.
    """
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    artworks = []
    current_obj = None
    start_line = 0
    
    for i, line in enumerate(lines):
        line_num = i + 1
        if '{' in line:
            current_obj = {}
            start_line = line_num
        
        if current_obj is not None:
            name_match = re.search(r'name:\s*["\'](.*?)["\']', line)
            artist_match = re.search(r'artist:\s*["\'](.*?)["\']', line)
            slug_match = re.search(r'slug:\s*["\'](.*?)["\']', line)
            location_match = re.search(r'location:\s*["\'](.*?)["\']', line)
            
            if name_match: current_obj['name'] = name_match.group(1)
            if artist_match: current_obj['artist'] = artist_match.group(1)
            if slug_match: current_obj['slug'] = slug_match.group(1)
            if location_match: current_obj['location'] = location_match.group(1)
            
            if '}' in line:
                if 'name' in current_obj and 'artist' in current_obj and 'slug' in current_obj:
                    current_obj['line'] = start_line
                    current_obj['file'] = filepath
                    artworks.append(current_obj)
                current_obj = None
            
    return artworks

def get_slugs_from_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    return re.findall(r'["\'](.*?)["\']', content)

# Paths
base_path = r'c:\xampp\htdocs\artmasons\data'
artworks_path = os.path.join(base_path, 'artworks.ts')
artworks_nz_path = os.path.join(base_path, 'artworksNZ.ts')
portraits_path = os.path.join(base_path, 'popularPortraits.ts')
landscapes_path = os.path.join(base_path, 'popularLandscapes.ts')
still_lifes_path = os.path.join(base_path, 'popularStillLifes.ts')

# 1. Load all artworks
all_artworks = parse_ts_file_with_lines(artworks_path) + parse_ts_file_with_lines(artworks_nz_path)

# 2. Identify popular slugs
popular_slugs = set()
popular_slugs.update(get_slugs_from_file(portraits_path))
popular_slugs.update(get_slugs_from_file(landscapes_path))
popular_slugs.update(get_slugs_from_file(still_lifes_path))

# 3. Identify popular artists
popular_artists = ['monet', 'klimt', 'matisse', 'van gogh', 'picasso', 'leonardo', 'degas']

# 4. Filter
missing_locations = []

for art in all_artworks:
    is_popular = False
    if art['slug'] in popular_slugs:
        is_popular = True
    artist_name = art['artist'].lower()
    if any(p_artist in artist_name for p_artist in popular_artists):
        is_popular = True
        
    if is_popular:
        loc = art.get('location')
        if not loc or loc.strip() == "" or loc.lower() == "unknown":
            missing_locations.append(art)

# Output Results with line numbers
print(f"REPORT_START")
for art in missing_locations:
    print(f"FILE: {art['file']} | LINE: {art['line']} | NAME: {art['name']} | SLUG: {art['slug']}")
print(f"REPORT_END")
