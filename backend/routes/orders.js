const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { generateQRCode } = require('../services/qrService');
const router = express.Router();

// Create order (with QR generation)
router.post('/', auth, async (req, res) => {
  try {
    const { items, paymentMethod, pickupTime } = req.body;
    
    let total = 0;
    const productDetails = [];

    // Validate items and calculate total
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      
      let itemPrice = product.price * item.quantity;
      total += itemPrice;
      productDetails.push({ product, quantity: item.quantity });
    }

    if (paymentMethod === 'wallet' && req.user.wallet < total) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    const order = new Order({
      user: req.user._id,
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        customizations: item.customizations || [],
        price: productDetails.find(p => p.product._id.toString() === item.product)?.product.price || 0
      })),
      total,
      paymentMethod,
      pickupTime: new Date(pickupTime)
    });

    // Generate QR code
    try {
      const { qrCode, qrCodeImage } = await generateQRCode(order._id, {
        total,
        pickupTime: order.pickupTime,
        items: order.items
      });
      
      order.qrCode = qrCode;
      order.qrCodeImage = qrCodeImage;
    } catch (qrError) {
      console.error('QR generation failed, continuing without QR:', qrError);
    }

    // Process payment
    if (paymentMethod === 'wallet') {
      req.user.wallet -= total;
      await req.user.save();
      
      await Transaction.create({
        user: req.user._id,
        amount: total,
        type: 'payment',
        order: order._id,
        status: 'completed'
      });
      
      order.paymentStatus = 'completed';
    }

    await order.save();

    // Update product stock
    for (const item of productDetails) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Populate the response with product details
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product')
      .populate('preparedBy', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is staff/admin
    if (order.user._id.toString() !== req.user._id.toString() && 
        !['staff', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Scan QR code to get order details
router.post('/scan', auth, requireRole(['staff', 'admin']), async (req, res) => {
  try {
    const { qrData } = req.body;
    
    if (!qrData) {
      return res.status(400).json({ message: 'QR code data required' });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid QR code format' });
    }

    const order = await Order.findById(parsedData.orderId)
      .populate('user', 'name email phone')
      .populate('items.product')
      .populate('preparedBy', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('QR scan error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Staff: Update order status
router.patch('/:id/status', auth, requireRole(['staff', 'admin']), async (req, res) => {
  try {
    const { status } = req.body;
    const updateData = { status };

    if (status === 'preparing') {
      updateData.preparedBy = req.user._id;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
    .populate('user', 'name email')
    .populate('items.product')
    .populate('preparedBy', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/user/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Staff: Get all orders
router.get('/', auth, requireRole(['staff', 'admin']), async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product')
      .populate('preparedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;