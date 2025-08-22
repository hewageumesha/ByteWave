const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                error: 'Access token required',
                message: 'Please provide a valid Bearer token' 
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                let message = 'Invalid or expired token';
                if (err.name === 'TokenExpiredError') {
                    message = 'Token has expired';
                } else if (err.name === 'JsonWebTokenError') {
                    message = 'Invalid token format';
                }
                
                return res.status(403).json({ 
                    error: 'Authentication failed', 
                    message 
                });
            }
            
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ 
            error: 'Authentication service error' 
        });
    }
};

const authorize = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ 
                    error: 'Authentication required',
                    message: 'User must be authenticated to access this resource'
                });
            }

            if (!req.user.role) {
                return res.status(403).json({ 
                    error: 'Access denied',
                    message: 'User role not found'
                });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ 
                    error: 'Insufficient permissions',
                    message: `Required role: ${allowedRoles.join(' or ')}. Current role: ${req.user.role}`
                });
            }

            next();
        } catch (error) {
            console.error('Authorization error:', error);
            return res.status(500).json({ 
                error: 'Authorization service error' 
            });
        }
    };
};

// Optional: Create a middleware for specific permissions
const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user.permissions || !req.user.permissions.includes(permission)) {
            return res.status(403).json({
                error: 'Insufficient permissions',
                message: `Required permission: ${permission}`
            });
        }
        next();
    };
};

module.exports = { 
    authenticateToken, 
    authorize,
    requirePermission 
};
