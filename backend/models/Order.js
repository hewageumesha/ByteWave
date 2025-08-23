const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  customizations: [{
    ingredient: String,
    action: { type: String, enum: ['add', 'remove'] },
    barcode: String // Barcode for ingredient tracking
  }],
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'pickedup', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'wallet'], 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  },
  pickupTime: { type: Date, required: true },
  qrCode: String,
  qrCodeImage: String, // Store QR code image path
  penaltyApplied: { type: Boolean, default: false },
  preparedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Staff who prepared
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);