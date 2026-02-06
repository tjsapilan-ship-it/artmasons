import re
import os

# 1. Load correct mappings from the source files
def load_source_data(filepaths):
    mega_text = ""
    for fp in filepaths:
        if os.path.exists(fp):
            with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
                mega_text += f.read()
    return mega_text

base_data_path = r'c:\xampp\htdocs\artmasons\data'
source_files = [
    os.path.join(base_data_path, 'ART LOCATIONS.txt'),
    os.path.join(base_data_path, 'ART LOCATIONS POPULAR ARTS.txt'),
    os.path.join(base_data_path, 'ART LOCATIONS FAMOUS ART AND TOP 100 PAINTINGS.txt')
]
mega_source = load_source_data(source_files)

def find_location_in_source(name, artist):
    # Try to find [Name][Artist][Location] in the mega text
    # Escape special characters
    q_name = re.escape(name)
    q_artist = re.escape(artist)
    
    # Pattern: Name Artist Location
    # Since they are concatenated, we look for Name followed by Artist followed by something that looks like a location
    # Most locations start with a capital letter and end with a city/country or USA/UK
    # This is tricky due to the lack of delimiters.
    
    # Alternative: search for Name + Artist
    pos = mega_source.find(name + artist)
    if pos != -1:
        start_loc = pos + len(name + artist)
        # Location usually goes until the next known Art Name or Artist Name or a known pattern
        # But for now, let's just grab the next 100 chars and look for common endings
        snippet = mega_source[start_loc:start_loc+150]
        # Common location endings: USA, UK, France, Germany, Italy, Spain, Russia, Australia, Canada, Switzerland, Netherlands
        endings = ["USA", "UK", "France", "Germany", "Italy", "Spain", "Russia", "Australia", "Canada", "Switzerland", "Netherlands", "Oslo Norway", "Oslo, Norway", "Stockholm Sweden", "Finland", "Belgium", "Japan", "Crimea", "Ukraine", "Poland", "India", "Austria", "Denmark", "Brazil", "Mexico", "Colombia", "Columbia"]
        
        best_end = -1
        for end in endings:
            e_pos = snippet.find(end)
            if e_pos != -1:
                # Find the end of this word
                candidate_end = e_pos + len(end)
                if candidate_end > best_end:
                    best_end = candidate_end
        
        if best_end != -1:
            return snippet[:best_end].strip()
            
    return None

# Manual overrides for the 16 I just did
overrides = {
    "monte-sainte-victoire": "Private Collection",
    "emporer-napoleon-i": "Fogg Art Museum at Harvard University Massachusetts USA",
    "starry-night-over-the-rome": "Musee d'Orsay Paris France",
    "olive-trees": "Museum of Modern Art New York USA",
    "wheat-field-with-crows-1890": "Van Gogh Museum Amsterdam Netherlands",
    "portrait-of-a-young-man-holding-a-glove": "The State Hermitage Museum St. Petersburg Russia",
    "laughing-cavallier": "The Wallace Collection London UK",
    "portrait-of-a-man-hals": "Frick Collection New York USA",
    "portrait-of-a-woman": "Frick Collection New York USA",
    "portrait-of-a-elderly-man": "Frick Collection New York USA",
    "malle-babbe": "Gemaldegalerie Berlin Germany",
    "rocks-at-port-goulphar-belle-lle": "Art Institute of Chicago Illinois USA",
    "fall-landscape": "Private Collection",
    "the-brutal-embrace": "Private Collection",
    "self-portrait-rembrandt-von-rijn": "The Frick Collection New York City New York USA",
    "self-portrait-rembrandt": "Museum National Gallery Of Art Washington DC USA"
}

def repair_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    obj_pattern = re.compile(r'(\{[^{}]*?\})', re.DOTALL)
    
    def repair_obj(match):
        obj_text = match.group(1)
        
        name_match = re.search(r'name:\s*["\'](.*?)["\']', obj_text)
        artist_match = re.search(r'artist:\s*["\'](.*?)["\']', obj_text)
        slug_match = re.search(r'slug:\s*["\'](.*?)["\']', obj_text)
        
        if not name_match or not artist_match or not slug_match:
            return obj_text
            
        name = name_match.group(1)
        artist = artist_match.group(1)
        slug = slug_match.group(1)
        
        # Determine the correct location
        correct_loc = None
        if slug in overrides:
            correct_loc = overrides[slug]
        else:
            correct_loc = find_location_in_source(name, artist)
            
        # Clean up lines
        lines = obj_text.split('\n')
        new_lines = []
        loc_found = False
        
        for line in lines:
            if 'location:' in line:
                if not loc_found and correct_loc:
                    # Use double quotes and escape correctly
                    esc_loc = correct_loc.replace('"', '\\"')
                    new_lines.append(f'    location: "{esc_loc}",')
                    loc_found = True
                continue # Skip all other location lines
            new_lines.append(line)
            
        if not loc_found and correct_loc:
            # Add it if not found (unexpected for these objects)
            esc_loc = correct_loc.replace('"', '\\"')
            if 'letter:' in obj_text:
                # Find letter: and insert before it
                for i, l in enumerate(new_lines):
                    if 'letter:' in l:
                        new_lines.insert(i, f'    location: "{esc_loc}",')
                        break
            else:
                new_lines.insert(-1, f'    location: "{esc_loc}"')
                
        return '\n'.join(new_lines)

    new_content = obj_pattern.sub(repair_obj, content)
    
    # Post-process: fix the specific syntax errors I introduced manually if they survived
    # Like double quotes or missing braces
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

repair_file(os.path.join(base_data_path, 'artworks.ts'))
repair_file(os.path.join(base_data_path, 'artworksNZ.ts'))
print("Repair attempts finished.")
