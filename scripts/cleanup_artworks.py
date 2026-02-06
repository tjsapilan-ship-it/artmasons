import re
import os

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # This regex matches { ... } blocks
    obj_pattern = re.compile(r'(\{[^{}]*?\})', re.DOTALL)
    
    def clean_obj(match):
        obj_text = match.group(1)
        
        # 1. Fix the "Unterminated string literal" or corrupted strings.
        # Find lines like: location: "Musee d'Orsay Paris France"Orsay Paris France",
        # We'll look for lines that have location: "..." followed by text and another quote/comma
        # Actually, let's just find and fix specifically the Orsay one first as a pattern
        obj_text = re.sub(r'location:\s*["\'](Musee d\').*?["\'].*?["\']', r'location: "Musee d\'Orsay Paris France"', obj_text)
        
        # 2. More general fix: if a line has location: "..." and then more text before a comma/newline
        # This is dangerous, so let's stick to known issues.
        
        # 3. Handle duplicates. If an object has 'location:' twice, keep the first non-placeholder one.
        # We can split the object text into lines and rebuild it.
        lines = obj_text.split('\n')
        new_lines = []
        locations = []
        for line in lines:
            loc_match = re.search(r'location:\s*["\'](.*?)["\']', line)
            if loc_match:
                loc_val = loc_match.group(1)
                # Keep it if it's not "Unknown" or if we don't have a better one yet
                locations.append(loc_val)
                continue # We'll add location back later
            new_lines.append(line)
        
        if locations:
            # Pick the best location (non-"Unknown")
            best_loc = "Unknown"
            for l in locations:
                if l.lower() not in ["unknown", ""]:
                    best_loc = l
                    break
            
            # Place the best location back. Usually before 'letter:' or 'slug:'
            # We'll insert it before 'image:' or at the end if not found
            inserted = False
            for i, line in enumerate(new_lines):
                if 'image:' in line:
                    new_lines.insert(i, f'    location: "{best_loc}",')
                    inserted = True
                    break
            if not inserted:
                # Add before the last '}'
                new_lines.insert(-1, f'    location: "{best_loc}"')
            
        return '\n'.join(new_lines)

    new_content = obj_pattern.sub(clean_obj, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

base_path = r'c:\xampp\htdocs\artmasons\data'
clean_file(os.path.join(base_path, 'artworks.ts'))
clean_file(os.path.join(base_path, 'artworksNZ.ts'))
print("Cleanup complete.")
