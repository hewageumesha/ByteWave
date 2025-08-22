const express = require('express');
const router = express.Router();

// const User = require('../../models/User');

const users = [
    { 
        id: 1, 
        name: 'Alice Johnson', 
        email: 'alice@example.com', 
        role: 'admin',
        createdAt: new Date('2024-01-01'),
        status: 'active'
    },
    { 
        id: 2, 
        name: 'Bob Smith', 
        email: 'bob@example.com', 
        role: 'customer',
        createdAt: new Date('2024-01-15'),
        status: 'active'
    },
    { 
        id: 3, 
        name: 'Charlie Brown', 
        email: 'charlie@example.com', 
        role: 'staff',
        createdAt: new Date('2024-02-01'),
        status: 'inactive'
    }
];

// Get all users with pagination and filtering
router.get('/all', async (req, res) => {
    try {
        const { page = 1, limit = 10, status, role } = req.query;
        
        let filteredUsers = [...users];
        
        // Filter by status if provided
        if (status) {
            filteredUsers = filteredUsers.filter(u => u.status === status);
        }
        
        // Filter by role if provided
        if (role) {
            filteredUsers = filteredUsers.filter(u => u.role === role);
        }
        
        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
        
        res.json({
            success: true,
            data: paginatedUsers,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(filteredUsers.length / limit),
                totalUsers: filteredUsers.length,
                usersPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users',
            message: error.message
        });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = users.find(u => u.id === parseInt(id));

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                message: `No user found with ID: ${id}`
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user',
            message: error.message
        });
    }
});

// Create new user (example)
router.post('/', async (req, res) => {
    try {
        const { name, email, role = 'customer' } = req.body;

        // Validation
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                message: 'Name and email are required'
            });
        }

        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: 'User already exists',
                message: 'A user with this email already exists'
            });
        }

        // Safe ID generation
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        
        const newUser = {
            id: newId,
            name,
            email,
            role,
            createdAt: new Date(),
            status: 'active'
        };

        users.push(newUser);

        res.status(201).json({
            success: true,
            data: newUser,
            message: 'User created successfully'
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create user',
            message: error.message
        });
    }
});

module.exports = router;
