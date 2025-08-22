const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet'); 
const rateLimit = require('express-rate-limit');

const adminRoute = require("./routes/admin/index");
const staffRoute = require("./routes/staff/index");
const customerRoute = require("./routes/customer/index");

require('dotenv').config();

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
app.use('/admin', adminRoute);
app.use("/customer", customerRoute);
app.use("/staff", staffRoute);

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
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });

        server.on('error', (err) => {
            console.error('❌ Server error:', err);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();