import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import db from './config/mongoose.database.js'
import { globalLimiter } from './middlewares/rate.limiter.middleware.js';
import fileUpload from 'express-fileupload'
import config from './config/config.js';
import { errorHandler, notFoundHandler, requestLogger } from './middlewares/error.middleware.js';
import { sanitizeInput } from './middlewares/validation.middleware.js';

// Importing user routes
import userRouter from './routes/user.route.js';
import DonorRouter from './routes/donor.route.js';
import ContactAndQueryRouter from './routes/contactAndQuery.route.js';
import NgoRouter from './routes/ngo.route.js';

const app = express();

const PORT = config.server.port;

// Request logging middleware
app.use(requestLogger);

// CORS configuration
app.use(cors({
    origin: [config.server.frontendUri], // Allow both localhost and IP
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.use(fileUpload({
    useTempFiles:true,
}))

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Input sanitization middleware
app.use(sanitizeInput);

// limiting the number of request globally
app.use(globalLimiter); 

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Server is running',
        environment: config.server.nodeEnv,
        timestamp: new Date().toISOString()
    });
});

// Using user routes
app.use('/api/user', userRouter);
app.use('/api/donor', DonorRouter); 
app.use('/api/contact',ContactAndQueryRouter)
app.use('/api/ngo', NgoRouter);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server only after database connection is established
db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`🌍 Environment: ${config.server.nodeEnv}`);
        console.log(`🔗 Health check: http://localhost:${PORT}/health`);
        console.log(`🎯 Frontend: ${config.server.frontendUri}`);
        console.log(`🛡️ Input validation and sanitization enabled`);
        console.log(`📝 Request logging enabled`);
    });
});

// Handle database connection errors
db.on('error', (err) => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
});