// index.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

import adminRoute from "./routes/admin/index.js";
import staffRoute from "./routes/staff/index.js";
import customerRoute from "./routes/customer/index.js";
import authRoute from "./routes/auth/index.js";


const app = express();

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Add this if you need to send cookies
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

// API routes
app.use('/auth', authRoute); // Add auth routes
app.use('/admin', adminRoute);
app.use("/customer", customerRoute);
app.use("/staff", staffRoute);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.status(err.status || 500).json({
        error: 'Something went wrong!',
        message: isDevelopment ? err.message : 'Internal server error',
        ...(isDevelopment && { stack: err.stack })
    });
});

const connectDB = async () => {
    try {
        // Clean up the DB_URL to remove any line breaks or extra spaces
        const dbUrl = process.env.DB_URL
        
        if (!dbUrl) {
            throw new Error('DB_URL environment variable is not set');
        }

        await mongoose.connect(dbUrl);
        console.log('✅ Connected to MongoDB');
        
        // Clean up expired refresh tokens on startup
        const User = (await import('./models/User.js')).default;
        await User.cleanExpiredTokens();
        console.log('🧹 Cleaned up expired refresh tokens');
        
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        console.error('Please check your DB_URL in the .env file');
        process.exit(1); // Exit process on connection failure
    }
};

const startServer = async () => {
    try {
        await connectDB();
        
        const PORT = process.env.PORT || 3000;
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });

        server.on('error', (err) => {
            console.error('❌ Server error:', err);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Shutting down gracefully...');
            server.close(() => {
                mongoose.connection.close();
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();