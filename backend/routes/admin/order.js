// routes/admin/orders.js
import express from 'express';
import Order from '../../models/Order.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all orders with advanced filtering (Admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { 
            status, 
            userId, 
            startDate, 
            endDate, 
            minPrice,
            maxPrice,
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
        
        // Filter by price range
        if (minPrice || maxPrice) {
            filter.totalPrice = {};
            if (minPrice) {
                filter.totalPrice.$gte = parseFloat(minPrice);
            }
            if (maxPrice) {
                filter.totalPrice.$lte = parseFloat(maxPrice);
            }
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const orders = await Order.find(filter)
            .populate('userId', 'name email phone role')
            .populate('items.mealId', 'name price description category')
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalOrders = await Order.countDocuments(filter);

        // Get comprehensive statistics
        const [statusStats, revenueStats, customerStats] = await Promise.all([
            // Status distribution
            Order.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        totalValue: { $sum: '$totalPrice' }
                    }
                }
            ]),
            
            // Revenue statistics
            Order.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$totalPrice' },
                        averageOrderValue: { $avg: '$totalPrice' },
                        minOrderValue: { $min: '$totalPrice' },
                        maxOrderValue: { $max: '$totalPrice' }
                    }
                }
            ]),
            
            // Top customers
            Order.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: '$userId',
                        orderCount: { $sum: 1 },
                        totalSpent: { $sum: '$totalPrice' }
                    }
                },
                {
                    $sort: { totalSpent: -1 }
                },
                {
                    $limit: 5
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $project: {
                        _id: 1,
                        orderCount: 1,
                        totalSpent: 1,
                        userName: '$user.name',
                        userEmail: '$user.email'
                    }
                }
            ])
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
            analytics: {
                statusDistribution: statusStats,
                revenue: revenueStats[0] || { 
                    totalRevenue: 0, 
                    averageOrderValue: 0, 
                    minOrderValue: 0, 
                    maxOrderValue: 0 
                },
                topCustomers: customerStats
            }
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Update any order field (Admin only)
router.patch('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { status, items, totalPrice } = req.body;
        
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update status if provided
        if (status) {
            const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ 
                    error: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
                });
            }
            order.status = status;
        }

        // Update items if provided (Admin can modify order contents)
        if (items && Array.isArray(items)) {
            order.items = items;
        }

        // Update total price if provided
        if (totalPrice !== undefined) {
            order.totalPrice = totalPrice;
        }

        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate('userId', 'name email phone role')
            .populate('items.mealId', 'name price description category');

        res.json({
            message: 'Order updated successfully',
            order: updatedOrder
        });

    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// Delete order (Admin only - for emergencies or testing)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ 
            message: 'Order deleted successfully',
            deletedOrder: {
                id: order._id,
                status: order.status,
                totalPrice: order.totalPrice,
                createdAt: order.createdAt
            }
        });

    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Failed to delete order' });
    }
});

// Advanced analytics (Admin only)
router.get('/analytics/advanced', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
        const { period = '30d' } = req.query;
        
        // Calculate date range
        const now = new Date();
        const startDate = new Date();
        
        switch (period) {
            case '7d':
                startDate.setDate(now.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(now.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(now.getDate() - 90);
                break;
            case '1y':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setDate(now.getDate() - 30);
        }

        const [
            hourlyDistribution,
            weeklyDistribution,
            monthlyTrends,
            popularMeals,
            orderSizeAnalysis
        ] = await Promise.all([
            // Hourly order distribution
            Order.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: { $hour: '$createdAt' },
                        count: { $sum: 1 },
                        revenue: { $sum: '$totalPrice' }
                    }
                },
                { $sort: { '_id': 1 } }
            ]),
            
            // Weekly distribution (0 = Sunday, 6 = Saturday)
            Order.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: { $dayOfWeek: '$createdAt' },
                        count: { $sum: 1 },
                        revenue: { $sum: '$totalPrice' }
                    }
                },
                { $sort: { '_id': 1 } }
            ]),
            
            // Monthly trends
            Order.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' }
                        },
                        count: { $sum: 1 },
                        revenue: { $sum: '$totalPrice' },
                        avgOrderValue: { $avg: '$totalPrice' }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ]),
            
            // Most popular meals
            Order.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                { $unwind: '$items' },
                {
                    $group: {
                        _id: '$items.mealId',
                        totalQuantity: { $sum: '$items.quantity' },
                        orderCount: { $sum: 1 }
                    }
                },
                { $sort: { totalQuantity: -1 } },
                { $limit: 10 },
                {
                    $lookup: {
                        from: 'meals',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'meal'
                    }
                },
                { $unwind: '$meal' },
                {
                    $project: {
                        _id: 1,
                        totalQuantity: 1,
                        orderCount: 1,
                        mealName: '$meal.name',
                        mealPrice: '$meal.price'
                    }
                }
            ]),
            
            // Order size analysis
            Order.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $addFields: {
                        itemCount: { $size: '$items' },
                        priceRange: {
                            $switch: {
                                branches: [
                                    { case: { $lt: ['$totalPrice', 10] }, then: 'Under $10' },
                                    { case: { $lt: ['$totalPrice', 25] }, then: '$10-$25' },
                                    { case: { $lt: ['$totalPrice', 50] }, then: '$25-$50' },
                                    { case: { $gte: ['$totalPrice', 50] }, then: 'Over $50' }
                                ],
                                default: 'Unknown'
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: '$priceRange',
                        count: { $sum: 1 },
                        avgItems: { $avg: '$itemCount' }
                    }
                }
            ])
        ]);

        res.json({
            period,
            analytics: {
                hourlyDistribution,
                weeklyDistribution,
                monthlyTrends,
                popularMeals,
                orderSizeAnalysis
            }
        });

    } catch (error) {
        console.error('Error fetching advanced analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

export default router;