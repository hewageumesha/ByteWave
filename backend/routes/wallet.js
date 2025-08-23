const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Get wallet balance
router.get('/balance', auth, async (req, res) => {
  try {
    res.json({ balance: req.user.wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add money to wallet
router.post('/add', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be positive' });
    }

    req.user.wallet += amount;
    await req.user.save();

    await Transaction.create({
      user: req.user._id,
      amount,
      type: 'deposit',
      status: 'completed'
    });

    res.json({ 
      message: 'Wallet topped up successfully', 
      newBalance: req.user.wallet 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get transaction history
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .populate('order')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;