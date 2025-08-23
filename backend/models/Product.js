const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, required: true },
  ingredients: [{
    name: String,
    price: Number,
    barcode: String // Barcode for inventory tracking
  }],
  customizable: { type: Boolean, default: false },
  stock: { type: Number, default: 0 },
  barcode: { type: String, unique: true }, // Product barcode
  image: String,
  minStockLevel: { type: Number, default: 5 } // Alert when stock is low
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);