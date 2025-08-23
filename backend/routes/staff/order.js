// routes/staff/orders.js
import express from 'express';
import Order from '../../models/Order.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
// import { authenticateToken, requireRole } from '';

const router = express.Router();

// Get all orders (Staff can view all orders)
router.get('/', authenticateToken, requireRole(['staff', 'admin']), async (req, res) => {
    try {
        const { 
            status, 
            userId, 
            startDate, 
            endDate, 
            page = 1, 
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;
        
        const filter = {};
        
        // Filter by status
        if (status) {
            filter.status = status;
        }
        
        // Filter by user
        if (userId) {
            filter.userId = userId;
        }
        
        // Filter by date range
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) {
                filter.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.createdAt.$lte = new Date(endDate);
            }
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const orders = await Order.find(filter)
            .populate('userId', 'name email phone')
            .populate('items.mealId', 'name price description')
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalOrders = await Order.countDocuments(filter);

        // Get order statistics
        const stats = await Order.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalValue: { $sum: '$totalPrice' }
                }
            }
        ]);

        res.json({
            orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalOrders / limit),
                totalOrders,
                hasNext: page * limit < totalOrders,
                hasPrev: page > 1
            },
            stats
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Get specific order by ID
router.get('/:id', authenticateToken, requireRole(['staff', 'admin']), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email phone')
            .populate('items.mealId', 'name price description category');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ order });

    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// Update order status
router.patch('/:id/status', authenticateToken, requireRole(['staff', 'admin']), async (req, res) => {
    try {
        const { status } = req.body;
        
        const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ 
                error: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
            });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Validate status transitions
        const currentStatus = order.status;
        const validTransitions = {
            'pending': ['preparing', 'cancelled'],
            'preparing': ['ready', 'cancelled'],
            'ready': ['delivered'],
            'delivered': [], // Final state
            'cancelled': []  // Final state
        };

        if (!validTransitions[currentStatus].includes(status)) {
            return res.status(400).json({ 
                error: `Cannot change status from '${currentStatus}' to '${status}'`
            });
        }

        order.status = status;
        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate('userId', 'name email phone')
            .populate('items.mealId', 'name price description');

        res.json({
            message: 'Order status updated successfully',
            order: updatedOrder
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

// Get order statistics for dashboard
router.get('/stats/dashboard', authenticateToken, requireRole(['staff', 'admin']), async (req, res) => {
    try {
        const { period = '7d' } = req.query;
        
        // Calculate date range based on period
        const now = new Date();
        const startDate = new Date();
        
        switch (period) {
            case '1d':
                startDate.setDate(now.getDate() - 1);
                break;
            case '7d':
                startDate.setDate(now.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(now.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(now.getDate() - 90);
                break;
            default:
                startDate.setDate(now.getDate() - 7);
        }

        // Get overall stats
        const [overallStats, recentStats, statusDistribution, dailyStats] = await Promise.all([
            // Overall statistics
            Order.aggregate([
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: '$totalPrice' },
                        avgOrderValue: { $avg: '$totalPrice' }
                    }
                }
            ]),
            
            // Recent period statistics
            Order.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: '$totalPrice' },
                        avgOrderValue: { $avg: '$totalPrice' }
                    }
                }
            ]),
            
            // Status distribution
            Order.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]),
            
            // Daily statistics for the period
            Order.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' },
                            day: { $dayOfMonth: '$createdAt' }
                        },
                        orders: { $sum: 1 },
                        revenue: { $sum: '$totalPrice' }
                    }
                },
                {
                    $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
                }
            ])
        ]);

        res.json({
            period,
            overall: overallStats[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 },
            recent: recentStats[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 },
            statusDistribution,
            dailyStats
        });

    } catch (error) {
        console.error('Error fetching order statistics:', error);
        res.status(500).json({ error: 'Failed to fetch order statistics' });
    }
});

export default router;