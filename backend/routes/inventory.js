const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const Product = require('../models/Product');
const { generateBarcode, generateBarcodeData } = require('../services/barcodeService');
const router = express.Router();

// Scan barcode to update inventory
router.post('/scan', auth, requireRole(['staff', 'admin']), async (req, res) => {
  try {
    const { barcodeData, action, quantity = 1 } = req.body;
    
    if (!barcodeData) {
      return res.status(400).json({ message: 'Barcode data required' });
    }

    // Find product by barcode or ID
    let product;
    if (barcodeData.startsWith('PROD-')) {
      // Extract product ID from barcode format: PROD-{id}-{timestamp}
      const productId = barcodeData.split('-')[1];
      product = await Product.findById(productId);
    } else {
      // Search by barcode field
      product = await Product.findOne({ barcode: barcodeData });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Handle inventory actions
    if (action === 'restock') {
      product.stock += parseInt(quantity);
    } else if (action === 'use') {
      if (product.stock < parseInt(quantity)) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      product.stock -= parseInt(quantity);
    }

    await product.save();

    res.json({
      type: 'product',
      product: {
        _id: product._id,
        name: product.name,
        stock: product.stock,
        price: product.price,
        barcode: product.barcode
      },
      action,
      newStock: product.stock
    });
  } catch (error) {
    console.error('Barcode scan error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Generate barcode for product
router.post('/:id/barcode', auth, requireRole(['admin']), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Generate barcode data if not exists
    if (!product.barcode) {
      product.barcode = generateBarcodeData(product);
    }

    // Generate barcode file
    try {
      const barcodeFile = await generateBarcode(product.barcode, product._id.toString());
      product.barcodeFile = barcodeFile;
    } catch (error) {
      console.error('Barcode file generation failed:', error);
    }

    await product.save();

    res.json({
      product: {
        _id: product._id,
        name: product.name,
        barcode: product.barcode,
        barcodeFile: product.barcodeFile
      },
      message: 'Barcode generated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get low stock alerts
router.get('/alerts', auth, requireRole(['admin', 'staff']), async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      $expr: { $lt: ['$stock', '$minStockLevel'] }
    }).select('name stock minStockLevel');

    res.json(lowStockProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product stock manually
router.patch('/:id/stock', auth, requireRole(['admin', 'staff']), async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products with barcodes
router.get('/products', auth, requireRole(['admin', 'staff']), async (req, res) => {
  try {
    const products = await Product.find().select('name barcode stock minStockLevel barcodeFile');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;