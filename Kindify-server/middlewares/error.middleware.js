import config from '../config/config.js';

// Custom error classes
export class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message, errors = []) {
        super(message, 400);
        this.errors = errors;
    }
}

export class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
    }
}

export class AuthorizationError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403);
    }
}

export class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Resource conflict') {
        super(message, 409);
    }
}

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error details
    console.error('🚨 Error Details:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new ValidationError(message);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field} already exists`;
        error = new ConflictError(message);
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        const message = 'Invalid ID format';
        error = new ValidationError(message);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = new AuthenticationError('Invalid token');
    }

    if (err.name === 'TokenExpiredError') {
        error = new AuthenticationError('Token expired');
    }

    // Multer file upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        error = new ValidationError('File too large');
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        error = new ValidationError('Unexpected file field');
    }

    // Rate limiting errors
    if (err.status === 429) {
        error = new AppError('Too many requests', 429);
    }

    // Default error
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    // Error response
    const errorResponse = {
        success: false,
        message: message,
        ...(config.isDevelopment() && {
            stack: err.stack,
            details: {
                name: err.name,
                code: err.code,
                url: req.originalUrl,
                method: req.method,
                timestamp: new Date().toISOString()
            }
        })
    };

    // Add validation errors if present
    if (error.errors && Array.isArray(error.errors)) {
        errorResponse.errors = error.errors;
    }

    res.status(statusCode).json(errorResponse);
};

// 404 handler for undefined routes
export const notFoundHandler = (req, res, next) => {
    const error = new NotFoundError(`Route ${req.originalUrl}`);
    next(error);
};

// Async error wrapper
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Request logger middleware
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logLevel = res.statusCode >= 400 ? '❌' : '✅';
        
        console.log(`${logLevel} ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });
    
    next();
};

export default {
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError,
    errorHandler,
    notFoundHandler,
    asyncHandler,
    requestLogger
};
