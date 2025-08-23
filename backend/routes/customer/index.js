// routes/customer/index.js
import express from 'express';
import orderRoutes from './order.js';

const router = express.Router();

// Mount order routes
router.use('/orders', orderRoutes);

export default router;