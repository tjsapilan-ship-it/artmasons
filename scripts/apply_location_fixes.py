import re
import os

updates = {
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

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Split content into objects
    # This regex matches { ... } blocks
    # We will iterate through them and if we find a slug that needs updating, we update the object
    
    obj_pattern = re.compile(r'(\{[^{}]*?\})', re.DOTALL)
    
    def repl(match):
        obj_text = match.group(1)
        slug_match = re.search(r'slug:\s*["\'](.*?)["\']', obj_text)
        if slug_match:
            slug = slug_match.group(1)
            if slug in updates:
                new_loc = updates[slug]
                # Check if location already exists
                if 'location:' in obj_text:
                    # Replace existing location
                    obj_text = re.sub(r'location:\s*["\'].*?["\']', f'location: "{new_loc}"', obj_text)
                else:
                    # Add location before the last brace
                    # We'll try to add it before 'letter:' or just before the closing '}'
                    if 'letter:' in obj_text:
                        obj_text = re.sub(r'(letter:)', f'location: "{new_loc}",\n    \\1', obj_text)
                    else:
                        obj_text = re.sub(r'(\s*\})', f',\n    location: "{new_loc}"\\1', obj_text)
        return obj_text

    new_content = obj_pattern.sub(repl, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

base_path = r'c:\xampp\htdocs\artmasons\data'
update_file(os.path.join(base_path, 'artworks.ts'))
update_file(os.path.join(base_path, 'artworksNZ.ts'))
print("Updates applied successfully.")
