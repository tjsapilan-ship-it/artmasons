import PyPDF2
import json
import re
import os

# List of 22 artworks to find
artworks_to_find = [
    "Death of Marat",
    "The Egg Dance",
    "St Paul",
    "Self Portrait With Bandaged Ear",
    "The Sleeping Gypsy",
    "American Gothic",
    "Las Meninas",
    "Self Portrait With Bandaged Ear And Pipe",
    "Salvator Mundi",
    "Mistress And Maid",
    "Still Life With A Plate Of Cherries",
    "Mount Saint-Victoire",
    "The Coronation Of Napoleon",
    "The 3rd of May 1808 In Madrid",
    "Dancer In Green",
    "The Sacrifice Of Abraham",
    "Old Woman Praying (Rembrandt's Mother)",
    "Nefea Faa Ipoipo (When Will You Marry?)",
    "The Milkmaid The Kitchen Maid",
    "Garcon A'la Pipe",
    "After The Bath Woman Drying Her Neck",
    "The Night Watch"
]

data_dir = "c:/xampp/htdocs/artmasons/data"
pdf_files = [
    "ART_DETAILS_A.pdf", "ART_DETAILS_D.pdf", "ART_DETAILS_G.pdf", 
    "ART_DETAILS_L.pdf", "ART_DETAILS_M.pdf", "ART_DETAILS_N.pdf",
    "ART_DETAILS_O.pdf", "ART_DETAILS_R.pdf", "ART_DETAILS_S.pdf",
    "ART_DETAILS_T.pdf", "famous art & top 100 paintings.pdf"
]

found_artworks = []

def extract_artwork_details(text, title):
    """Extract artwork details from PDF text"""
    lines = text.split('\n')
    
    # Find the title line
    for i, line in enumerate(lines):
        if title.lower() in line.lower():
            # Extract details from surrounding lines
            details = {
                'title': title,
                'artist': '',
                'year': '',
                'originalSize': '',
                'artistLife': '',
                'image': f'/image/famous-art/{title.lower()}.jpg'
            }
            
            # Look in nearby lines for details
            context = '\n'.join(lines[max(0, i-5):min(len(lines), i+15)])
            
            # Try to find artist name (usually before year)
            artist_match = re.search(r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,4})\s*\(?\d{4}', context)
            if artist_match:
                details['artist'] = artist_match.group(1).strip()
            
            # Find year
            year_match = re.search(r'\b(1\d{3}|20\d{2})\b', context)
            if year_match:
                details['year'] = year_match.group(1)
            
            # Find size (cm or inches)
            size_match = re.search(r'(\d+\.?\d*\s*x\s*\d+\.?\d*\s*(?:cm|inches?))', context, re.IGNORECASE)
            if size_match:
                details['originalSize'] = size_match.group(1)
            
            # Find artist life dates
            life_match = re.search(r'\((\d{4}[-–]\d{4})\)', context)
            if life_match:
                details['artistLife'] = life_match.group(1)
            
            return details
    
    return None

print("Searching for 22 artworks in PDF files...")
print("=" * 60)

for pdf_file in pdf_files:
    pdf_path = os.path.join(data_dir, pdf_file)
    if not os.path.exists(pdf_path):
        continue
    
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ''
            for page in reader.pages:
                text += page.extract_text()
            
            for artwork in artworks_to_find:
                if artwork not in [a['title'] for a in found_artworks]:
                    details = extract_artwork_details(text, artwork)
                    if details:
                        found_artworks.append(details)
                        print(f"✓ Found: {artwork} in {pdf_file}")
    
    except Exception as e:
        print(f"Error reading {pdf_file}: {e}")

print("\n" + "=" * 60)
print(f"Found {len(found_artworks)} out of 22 artworks")
print("=" * 60)

# Save results
output_file = "c:/xampp/htdocs/artmasons/scripts/extracted_22_artworks.json"
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(found_artworks, f, indent=2, ensure_ascii=False)

print(f"\nResults saved to: {output_file}")

# Print what was found
for artwork in found_artworks:
    print(f"\n{artwork['title']}")
    print(f"  Artist: {artwork['artist']}")
    print(f"  Year: {artwork['year']}")
    print(f"  Size: {artwork['originalSize']}")
    print(f"  Life: {artwork['artistLife']}")
