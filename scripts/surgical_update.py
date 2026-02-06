import os

# Data from find_missing_locations.py
targets = [
    {"file": r"c:\xampp\htdocs\artmasons\data\artworks.ts", "line": 1855, "slug": "monte-sainte-victoire", "location": "Private Collection"},
    {"file": r"c:\xampp\htdocs\artmasons\data\artworks.ts", "line": 2959, "slug": "emporer-napoleon-i", "location": "Fogg Art Museum at Harvard University Massachusetts USA"},
    {"file": r"c:\xampp\htdocs\artmasons\data\artworks.ts", "line": 4050, "slug": "starry-night-over-the-rome", "location": "Musee d'Orsay Paris France"},
    {"file": r"c:\xampp\htdocs\artmasons\data\artworks.ts", "line": 4248, "slug": "olive-trees", "location": "Museum of Modern Art New York USA"},
    {"file": r"c:\xampp\htdocs\artmasons\data\artworks.ts", "line": 4337, "slug": "wheat-field-with-crows-1890", "location": "Van Gogh Museum Amsterdam Netherlands"},
    {"file": r"c:\xampp\htdocs\artmasons\data\artworks.ts", "line": 4407, "slug": "portrait-of-a-young-man-holding-a-glove", "location": "The State Hermitage Museum St. Petersburg Russia"},
    {"file": r"c:\xampp\htdocs\artmasons\data\artworks.ts", "line": 4431, "slug": "laughing-cavallier", "location": "The Wallace Collection London UK"},
    {"file": r"c:\xampp\htdocs\artmasons\data\artworks.ts", "line": 4443, "slug": "portrait-of-a-man-hals", "location": "Frick Collection New York USA"},
    {"file": r"c:\xampp\htdocs\artmasons\data\artworks.ts", "line": 4455, "slug": "portrait-of-a-woman", "location": "Frick Collection New York USA"},
    {"file": r"c:\xampp\htdocs\artmasons\data\artworks.ts", "line": 4467, "slug": "portrait-of-a-elderly-man", "location": "Frick Collection New York USA"},
    {"file": r"c:\xampp\htdocs\artmasons\data\artworks.ts", "line": 4479, "slug": "malle-babbe", "location": "Gemaldegalerie Berlin Germany"},
    {"file": r"c:\xampp\htdocs\artmasons\data\artworks.ts", "line": 7650, "slug": "rocks-at-port-goulphar-belle-lle", "location": "Art Institute of Chicago Illinois USA"},
    {"file": r"c:\xampp\htdocs\artmasons\data\artworksNZ.ts", "line": 85, "slug": "fall-landscape", "location": "Private Collection"},
    {"file": r"c:\xampp\htdocs\artmasons\data\artworksNZ.ts", "line": 853, "slug": "the-brutal-embrace", "location": "Private Collection"},
    {"file": r"c:\xampp\htdocs\artmasons\data\artworksNZ.ts", "line": 1923, "slug": "self-portrait-rembrandt-von-rijn", "location": "The Frick Collection New York City New York USA"},
    {"file": r"c:\xampp\htdocs\artmasons\data\artworksNZ.ts", "line": 2043, "slug": "self-portrait-rembrandt", "location": "Museum National Gallery Of Art Washington DC USA"},
]

def update_surgical(filepath, file_targets):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    # Sort targets by line number in reverse to avoid shifting issues if we inserted multiple lines (though we won't)
    file_targets.sort(key=lambda x: x['line'], reverse=True)
    
    for t in file_targets:
        start_idx = t['line'] - 1
        # Find the block end (up to 20 lines)
        end_idx = start_idx
        found_loc = -1
        found_letter = -1
        found_end = -1
        
        for i in range(start_idx, min(start_idx + 25, len(lines))):
            if 'location:' in lines[i]:
                found_loc = i
            if 'letter:' in lines[i]:
                found_letter = i
            if '}' in lines[i]:
                found_end = i
                break
        
        # Repair the line
        new_loc_line = f'    location: "{t["location"]}",\n'
        
        if found_loc != -1:
            lines[found_loc] = new_loc_line
        elif found_letter != -1:
            lines.insert(found_letter, new_loc_line)
        elif found_end != -1:
            lines.insert(found_end, new_loc_line)
            
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(lines)

# Split targets by file
by_file = {}
for t in targets:
    by_file.setdefault(t['file'], []).append(t)

for fp, ftp in by_file.items():
    update_surgical(fp, ftp)

print("Surgical updates complete.")
