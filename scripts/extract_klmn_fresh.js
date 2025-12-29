const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

async function extractPDF(letter) {
  const pdfPath = path.join(__dirname, '..', 'data', `ART_DETAILS_${letter}.pdf`);
  
  if (!fs.existsSync(pdfPath)) {
    console.log(`PDF not found: ${pdfPath}`);
    return null;
  }
  
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdf(dataBuffer);
  
  const outputPath = path.join(__dirname, `${letter.toLowerCase()}_pdf_raw_text.txt`);
  fs.writeFileSync(outputPath, data.text, 'utf-8');
  console.log(`${letter}: Extracted ${data.text.length} characters to ${outputPath}`);
  
  return data.text;
}

async function main() {
  const letters = ['K', 'L', 'M', 'N'];
  
  for (const letter of letters) {
    await extractPDF(letter);
  }
  
  console.log('\nExtraction complete!');
}

main().catch(console.error);
