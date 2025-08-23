const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Get all staff members
router.get('/staff', auth, requireRole(['admin']), async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' }).select('-password');
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create staff account
router.post('/staff', auth, requireRole(['admin']), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const staff = new User({
      name,
      email,
      password,
      role: 'staff'
    });

    await staff.save();

    res.status(201).json({
      message: 'Staff account created successfully',
      staff: { id: staff._id, name: staff.name, email: staff.email, role: staff.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update staff account
router.put('/staff/:id', auth, requireRole(['admin']), async (req, res) => {
  try {
    const { name, email, active } = req.body;
    
    const staff = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, active },
      { new: true }
    ).select('-password');

    if (!staff || staff.role !== 'staff') {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete staff account
router.delete('/staff/:id', auth, requireRole(['admin']), async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);
    
    if (!staff || staff.role !== 'staff') {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get staff performance metrics
router.get('/staff/:id/performance', auth, requireRole(['admin']), async (req, res) => {
  try {
    const staffId = req.params.id;
    
    const [ordersPrepared, recentActivity] = await Promise.all([
      Order.countDocuments({ preparedBy: staffId, status: 'pickedup' }),
      Order.find({ preparedBy: staffId })
        .sort({ updatedAt: -1 })
        .limit(10)
        .populate('user', 'name')
    ]);

    res.json({
      ordersPrepared,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;