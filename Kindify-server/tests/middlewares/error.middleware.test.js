import { 
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
} from '../../middlewares/error.middleware.js';

describe('Error Middleware', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = global.testUtils.createMockRequest();
        mockRes = global.testUtils.createMockResponse();
        mockNext = global.testUtils.createMockNext();
    });

    describe('Custom Error Classes', () => {
        it('should create AppError with correct properties', () => {
            const error = new AppError('Test error', 400);
            
            expect(error.message).toBe('Test error');
            expect(error.statusCode).toBe(400);
            expect(error.status).toBe('fail');
            expect(error.isOperational).toBe(true);
        });

        it('should create ValidationError with correct properties', () => {
            const error = new ValidationError('Validation failed', ['field error']);
            
            expect(error.message).toBe('Validation failed');
            expect(error.statusCode).toBe(400);
            expect(error.errors).toEqual(['field error']);
        });

        it('should create AuthenticationError with correct properties', () => {
            const error = new AuthenticationError('Auth failed');
            
            expect(error.message).toBe('Auth failed');
            expect(error.statusCode).toBe(401);
            expect(error.status).toBe('fail');
        });

        it('should create AuthorizationError with correct properties', () => {
            const error = new AuthorizationError('Access denied');
            
            expect(error.message).toBe('Access denied');
            expect(error.statusCode).toBe(403);
            expect(error.status).toBe('fail');
        });

        it('should create NotFoundError with correct properties', () => {
            const error = new NotFoundError('User');
            
            expect(error.message).toBe('User not found');
            expect(error.statusCode).toBe(404);
            expect(error.status).toBe('fail');
        });

        it('should create ConflictError with correct properties', () => {
            const error = new ConflictError('Email exists');
            
            expect(error.message).toBe('Email exists');
            expect(error.statusCode).toBe(409);
            expect(error.status).toBe('fail');
        });
    });

    describe('errorHandler', () => {
        it('should handle ValidationError', () => {
            const error = new ValidationError('Validation failed');
            
            errorHandler(error, mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Validation failed'
            });
        });

        it('should handle AuthenticationError', () => {
            const error = new AuthenticationError('Invalid token');
            
            errorHandler(error, mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid token'
            });
        });

        it('should handle AuthorizationError', () => {
            const error = new AuthorizationError('Access denied');
            
            errorHandler(error, mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Access denied'
            });
        });

        it('should handle NotFoundError', () => {
            const error = new NotFoundError('User');
            
            errorHandler(error, mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'User not found'
            });
        });

        it('should handle ConflictError', () => {
            const error = new ConflictError('Email exists');
            
            errorHandler(error, mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(409);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Email exists'
            });
        });

        it('should handle Mongoose ValidationError', () => {
            const mongooseError = {
                name: 'ValidationError',
                errors: {
                    email: { message: 'Email is required' },
                    password: { message: 'Password is required' }
                }
            };
            
            errorHandler(mongooseError, mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Email is required, Password is required'
            });
        });

        it('should handle Mongoose DuplicateKeyError', () => {
            const mongooseError = {
                code: 11000,
                keyValue: { email: 'test@example.com' }
            };
            
            errorHandler(mongooseError, mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(409);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'email already exists'
            });
        });

        it('should handle Mongoose CastError', () => {
            const mongooseError = {
                name: 'CastError'
            };
            
            errorHandler(mongooseError, mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid ID format'
            });
        });

        it('should handle JWT JsonWebTokenError', () => {
            const jwtError = {
                name: 'JsonWebTokenError'
            };
            
            errorHandler(jwtError, mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid token'
            });
        });

        it('should handle JWT TokenExpiredError', () => {
            const jwtError = {
                name: 'TokenExpiredError'
            };
            
            errorHandler(jwtError, mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Token expired'
            });
        });

        it('should handle file upload errors', () => {
            const fileError = {
                code: 'LIMIT_FILE_SIZE'
            };
            
            errorHandler(fileError, mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'File too large'
            });
        });

        it('should handle rate limiting errors', () => {
            const rateLimitError = {
                status: 429
            };
            
            errorHandler(rateLimitError, mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(429);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Too many requests'
            });
        });

        it('should handle unknown errors with 500 status', () => {
            const unknownError = new Error('Unknown error');
            
            errorHandler(unknownError, mockReq, mockRes, mockNext);
            
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Unknown error'
            });
        });

        it('should include validation errors in response', () => {
            const validationError = new ValidationError('Validation failed', [
                { field: 'email', message: 'Invalid email' }
            ]);
            
            errorHandler(validationError, mockReq, mockRes, mockNext);
            
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Validation failed',
                errors: [
                    { field: 'email', message: 'Invalid email' }
                ]
            });
        });
    });

    describe('notFoundHandler', () => {
        it('should create NotFoundError and pass to next', () => {
            notFoundHandler(mockReq, mockRes, mockNext);
            
            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Route /test not found',
                    statusCode: 404
                })
            );
        });
    });

    describe('asyncHandler', () => {
        it('should call the function and pass result to next', async () => {
            const mockFunction = jest.fn().mockResolvedValue('success');
            
            const wrappedFunction = asyncHandler(mockFunction);
            await wrappedFunction(mockReq, mockRes, mockNext);
            
            expect(mockFunction).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should catch errors and pass to next', async () => {
            const mockFunction = jest.fn().mockRejectedValue(new Error('Test error'));
            
            const wrappedFunction = asyncHandler(mockFunction);
            await wrappedFunction(mockReq, mockRes, mockNext);
            
            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Test error'
                })
            );
        });
    });

    describe('requestLogger', () => {
        it('should log request completion with timing', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            requestLogger(mockReq, mockRes, mockNext);
            
            // Simulate response finish
            mockRes.emit('finish');
            
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringMatching(/✅ GET \/test - \d+ - \d+ms/)
            );
            
            consoleSpy.mockRestore();
        });

        it('should log error responses with ❌', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            requestLogger(mockReq, mockRes, mockNext);
            
            // Set error status
            mockRes.statusCode = 400;
            
            // Simulate response finish
            mockRes.emit('finish');
            
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringMatching(/❌ GET \/test - 400 - \d+ms/)
            );
            
            consoleSpy.mockRestore();
        });
    });
});
