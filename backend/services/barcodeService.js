const path = require('path');
const fs = require('fs');

// Simple barcode generation without canvas
const generateBarcode = async (data, filename) => {
  try {
    // For simplicity, we'll just create a text-based representation
    // In a real application, you might want to use a pure JS barcode library
    const barcodeText = `BARCODE: ${data}\n${'='.repeat(30)}`;
    
    const barcodePath = path.join(__dirname, '../uploads/barcodes', `${filename}.txt`);
    const barcodeDir = path.dirname(barcodePath);
    
    if (!fs.existsSync(barcodeDir)) {
      fs.mkdirSync(barcodeDir, { recursive: true });
    }

    fs.writeFileSync(barcodePath, barcodeText);

    return `/uploads/barcodes/${filename}.txt`;
  } catch (error) {
    console.error('Barcode generation error:', error);
    throw new Error('Barcode generation failed');
  }
};

// Generate barcode data for products
const generateBarcodeData = (product) => {
  return `PROD-${product._id}-${Date.now()}`;
};

module.exports = { generateBarcode, generateBarcodeData };