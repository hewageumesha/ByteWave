// routes/customer/orders.js
import express from 'express';
import Order from '../../models/Order.js';
import Meal from '../../models/Meal.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Create a new order (Customer only)
router.post('/', authenticateToken, requireRole(['customer']), async (req, res) => {
    try {
        const { items } = req.body;
        
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Items array is required and must not be empty' });
        }

        // Validate items and calculate total price
        let totalPrice = 0;
        const validatedItems = [];

        for (const item of items) {
            if (!item.mealId || !item.quantity || item.quantity <= 0) {
                return res.status(400).json({ 
                    error: 'Each item must have a valid mealId and quantity greater than 0' 
                });
            }

            const meal = await Meal.findById(item.mealId);
            if (!meal) {
                return res.status(404).json({ 
                    error: `Meal with ID ${item.mealId} not found` 
                });
            }

            if (!meal.isAvailable) {
                return res.status(400).json({ 
                    error: `Meal "${meal.name}" is not available` 
                });
            }

            validatedItems.push({
                mealId: item.mealId,
                quantity: item.quantity
            });

            totalPrice += meal.price * item.quantity;
        }

        // Create the order
        const order = new Order({
            userId: req.user.id,
            items: validatedItems,
            totalPrice: totalPrice,
            status: 'pending'
        });

        const savedOrder = await order.save();
        
        // Populate meal details for response
        const populatedOrder = await Order.findById(savedOrder._id)
            .populate('userId', 'name email')
            .populate('items.mealId', 'name price description');

        res.status(201).json({
            message: 'Order created successfully',
            order: populatedOrder
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Get customer's own orders
router.get('/', authenticateToken, requireRole(['customer']), async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        
        const filter = { userId: req.user.id };
        if (status) {
            filter.status = status;
        }

        const orders = await Order.find(filter)
            .populate('items.mealId', 'name price description')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalOrders = await Order.countDocuments(filter);

        res.json({
            orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalOrders / limit),
                totalOrders,
                hasNext: page * limit < totalOrders,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Get specific order by ID (Customer can only view their own orders)
router.get('/:id', authenticateToken, requireRole(['customer']), async (req, res) => {
    try {
        const order = await Order.findOne({ 
            _id: req.params.id, 
            userId: req.user.id 
        })
        .populate('userId', 'name email')
        .populate('items.mealId', 'name price description');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ order });

    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// Cancel order (Customer can only cancel pending orders)
router.patch('/:id/cancel', authenticateToken, requireRole(['customer']), async (req, res) => {
    try {
        const order = await Order.findOne({ 
            _id: req.params.id, 
            userId: req.user.id 
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ 
                error: 'Order can only be cancelled when it is in pending status' 
            });
        }

        order.status = 'cancelled';
        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate('userId', 'name email')
            .populate('items.mealId', 'name price description');

        res.json({
            message: 'Order cancelled successfully',
            order: updatedOrder
        });

    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ error: 'Failed to cancel order' });
    }
});

export default router;