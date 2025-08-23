// routes/auth/index.js
import express from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import User from '../../models/User.js';
import jwtService from '../../utils/jwt.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        error: 'Too many authentication attempts',
        message: 'Please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // More lenient for refresh token endpoint
    message: {
        error: 'Too many refresh attempts',
        message: 'Please try again later'
    }
});

// Validation middleware
// Update the validation middleware in your auth/index.js

const registerValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('role')
        .optional()
        .isIn(['admin', 'staff', 'customer'])  // ← Changed 'user' to 'customer'
        .withMessage('Role must be admin, staff, or customer')
];

const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Helper function to get device info
const getDeviceInfo = (req) => {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = req.ip || req.connection.remoteAddress || 'Unknown IP';
    return `${userAgent.substring(0, 50)} - ${ip}`;
};

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            message: 'Please check your input data',
            details: errors.array()
        });
    }
    next();
};

// @route   POST /auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authLimiter, registerValidation, handleValidationErrors, async (req, res) => {
    try {
        const { email, password, name, role = 'customer' } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                error: 'Registration failed',
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const userData = {
            email,
            password,
            name,
            role
        };

        const user = new User(userData);
        await user.save();

        // Generate tokens
        const tokenPayload = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        const tokens = jwtService.generateTokenPair(tokenPayload);
        
        // Save refresh token to user
        const deviceInfo = getDeviceInfo(req);
        await user.addRefreshToken(tokens.refreshToken, deviceInfo);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                isActive: user.isActive,
                lastLogin: user.lastLogin
            },
            tokens: {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                expiresIn: tokens.accessTokenExpiresIn
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'Registration failed',
                message: 'User with this email already exists'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Validation failed',
                message: 'Please check your input data',
                details: Object.values(error.errors).map(e => ({
                    field: e.path,
                    message: e.message
                }))
            });
        }

        res.status(500).json({
            error: 'Registration failed',
            message: 'An internal error occurred during registration'
        });
    }
});

// @route   POST /auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, loginValidation, handleValidationErrors, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user and include password for verification
        const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');
        
        if (!user) {
            return res.status(401).json({
                error: 'Authentication failed',
                message: 'Invalid email or password'
            });
        }

        // Check if account is locked
        if (user.isLocked) {
            return res.status(423).json({
                error: 'Account locked',
                message: 'Account temporarily locked due to too many failed login attempts'
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({
                error: 'Account deactivated',
                message: 'Your account has been deactivated. Please contact support.'
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            // Increment login attempts
            await user.incLoginAttempts();
            
            return res.status(401).json({
                error: 'Authentication failed',
                message: 'Invalid email or password'
            });
        }

        // Reset login attempts on successful login
        if (user.loginAttempts && user.loginAttempts > 0) {
            await user.resetLoginAttempts();
        }

        // Generate tokens
        const tokenPayload = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        const tokens = jwtService.generateTokenPair(tokenPayload);
        
        // Save refresh token to user
        const deviceInfo = getDeviceInfo(req);
        await user.addRefreshToken(tokens.refreshToken, deviceInfo);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                isActive: user.isActive,
                lastLogin: user.lastLogin
            },
            tokens: {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                expiresIn: tokens.accessTokenExpiresIn
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Authentication failed',
            message: 'An internal error occurred during login'
        });
    }
});

// @route   POST /auth/refresh
// @desc    Refresh access token using refresh token
// @access  Public
router.post('/refresh', refreshLimiter, async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                error: 'Token required',
                message: 'Refresh token is required'
            });
        }

        // Verify refresh token
        let decoded;
        try {
            decoded = jwtService.verifyRefreshToken(refreshToken);
        } catch (error) {
            return res.status(403).json({
                error: 'Invalid token',
                message: error.message
            });
        }

        // Find user with this refresh token
        const user = await User.findByRefreshToken(refreshToken);
        
        if (!user) {
            return res.status(403).json({
                error: 'Invalid token',
                message: 'Refresh token not found or user inactive'
            });
        }

        // Check if user is still active
        if (!user.isActive) {
            return res.status(403).json({
                error: 'Account deactivated',
                message: 'User account has been deactivated'
            });
        }

        // Generate new access token
        const tokenPayload = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        const newAccessToken = jwtService.generateAccessToken(tokenPayload);

        res.json({
            success: true,
            message: 'Token refreshed successfully',
            accessToken: newAccessToken,
            expiresIn: jwtService.getExpirationTime(jwtService.accessTokenExpiry)
        });

    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({
            error: 'Token refresh failed',
            message: 'An internal error occurred during token refresh'
        });
    }
});

// @route   POST /auth/logout
// @desc    Logout user (invalidate refresh token)
// @access  Private
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                message: 'User account not found'
            });
        }

        if (refreshToken) {
            // Remove specific refresh token
            await user.removeRefreshToken(refreshToken);
        } else {
            // Remove all refresh tokens (logout from all devices)
            await user.removeAllRefreshTokens();
        }

        res.json({
            success: true,
            message: refreshToken ? 'Logged out successfully' : 'Logged out from all devices'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            error: 'Logout failed',
            message: 'An internal error occurred during logout'
        });
    }
});

// @route   POST /auth/logout-all
// @desc    Logout user from all devices
// @access  Private
router.post('/logout-all', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                message: 'User account not found'
            });
        }

        await user.removeAllRefreshTokens();

        res.json({
            success: true,
            message: 'Logged out from all devices successfully'
        });

    } catch (error) {
        console.error('Logout all error:', error);
        res.status(500).json({
            error: 'Logout failed',
            message: 'An internal error occurred during logout'
        });
    }
});

// @route   GET /auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                message: 'User account not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                isActive: user.isActive,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            error: 'Profile fetch failed',
            message: 'An internal error occurred while fetching profile'
        });
    }
});

// @route   GET /auth/sessions
// @desc    Get active sessions (refresh tokens)
// @access  Private
router.get('/sessions', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('refreshTokens');
        
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                message: 'User account not found'
            });
        }

        const sessions = user.refreshTokens.map(tokenObj => ({
            id: tokenObj._id,
            deviceInfo: tokenObj.deviceInfo,
            createdAt: tokenObj.createdAt,
            isCurrentSession: false // You could implement logic to detect current session
        }));

        res.json({
            success: true,
            sessions: sessions,
            count: sessions.length
        });

    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({
            error: 'Sessions fetch failed',
            message: 'An internal error occurred while fetching sessions'
        });
    }
});

export default router;