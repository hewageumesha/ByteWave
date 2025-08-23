// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

// Verify JWT token
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user details
        const user = await User.findById(decoded.id).select('-password -refreshTokens');
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Access token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid access token' });
        }
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Token verification failed' });
    }
};

// Check user role
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
            });
        }

        next();
    };
};

// Optional authentication (for endpoints that work with or without auth)
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password -refreshTokens');
            
            if (user) {
                req.user = {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    name: user.name
                };
            }
        }

        next(); // Continue regardless of token validity
    } catch (error) {
        // Ignore token errors for optional auth
        next();
    }
};