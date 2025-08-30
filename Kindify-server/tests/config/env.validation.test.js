import { validateEnvironment, validateRequiredEnvVars } from '../../config/env.validation.js';

describe('Environment Validation', () => {
    let originalEnv;

    beforeEach(() => {
        // Store original environment
        originalEnv = { ...process.env };
        
        // Set test environment variables
        process.env.PORT = '3000';
        process.env.NODE_ENV = 'test';
        process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
        process.env.JWT_SECRET = 'test-secret-that-is-long-enough-for-validation';
        process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
        process.env.MAIL_ID = 'test@example.com';
        process.env.MAIL_PASSWORD = 'test-password';
        process.env.SERVICE = 'gmail';
        process.env.DISPLAY_EMAIL = 'test@example.com';
        process.env.SMTP_HOST = 'smtp.gmail.com';
        process.env.SMTP_PORT = '587';
        process.env.SMTP_USER = 'test@example.com';
        process.env.SMTP_PASSWORD = 'test-smtp-password';
        process.env.SMTP_SECURE = 'false';
        process.env.SMTP_LOCK = 'false';
        process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
        process.env.CLOUDINARY_API_KEY = 'test-api-key';
        process.env.CLOUDINARY_API_SECRET = 'test-api-secret';
        process.env.FRONTEND_URI = 'http://localhost:3000';
    });

    afterEach(() => {
        // Restore original environment
        process.env = originalEnv;
    });

    describe('validateEnvironment', () => {
        it('should validate all required environment variables successfully', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            const result = validateEnvironment();
            
            expect(result).toBe(true);
            expect(consoleSpy).toHaveBeenCalledWith('🎉 All environment variables are valid!');
            
            consoleSpy.mockRestore();
        });

        it('should fail validation when required variables are missing', () => {
            delete process.env.JWT_SECRET;
            delete process.env.GOOGLE_CLIENT_ID;
            
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            
            const result = validateEnvironment();
            
            expect(result).toBe(false);
            expect(consoleSpy).toHaveBeenCalledWith('🚫 Application cannot start with invalid configuration!');
            expect(consoleErrorSpy).toHaveBeenCalled();
            
            consoleSpy.mockRestore();
            consoleErrorSpy.mockRestore();
        });

        it('should handle weak JWT secret with warning', () => {
            process.env.JWT_SECRET = 'weak';
            
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            const result = validateEnvironment();
            
            expect(result).toBe(false);
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('⚠️ JWT_SECRET is weak'));
            
            consoleSpy.mockRestore();
        });

        it('should validate MongoDB URI format', () => {
            process.env.MONGODB_URI = 'invalid-uri';
            
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            const result = validateEnvironment();
            
            expect(result).toBe(false);
            
            consoleSpy.mockRestore();
        });

        it('should validate email format', () => {
            process.env.MAIL_ID = 'invalid-email';
            
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            const result = validateEnvironment();
            
            expect(result).toBe(false);
            
            consoleSpy.mockRestore();
        });

        it('should validate URL format', () => {
            process.env.FRONTEND_URI = 'invalid-url';
            
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            const result = validateEnvironment();
            
            expect(result).toBe(false);
            
            consoleSpy.mockRestore();
        });

        it('should handle number type validation', () => {
            process.env.PORT = 'invalid-port';
            
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            const result = validateEnvironment();
            
            expect(result).toBe(false);
            
            consoleSpy.mockRestore();
        });

        it('should handle boolean type validation', () => {
            process.env.SMTP_SECURE = 'invalid-boolean';
            
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            const result = validateEnvironment();
            
            expect(result).toBe(false);
            
            consoleSpy.mockRestore();
        });

        it('should use default values for optional variables', () => {
            delete process.env.SMTP_PORT;
            delete process.env.SMTP_SECURE;
            delete process.env.SMTP_LOCK;
            
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            const result = validateEnvironment();
            
            expect(result).toBe(true);
            expect(process.env.SMTP_PORT).toBe(587);
            expect(process.env.SMTP_SECURE).toBe(false);
            expect(process.env.SMTP_LOCK).toBe(false);
            
            consoleSpy.mockRestore();
        });
    });

    describe('validateRequiredEnvVars', () => {
        it('should return empty array when all variables are present', () => {
            const requiredVars = ['PORT', 'NODE_ENV', 'MONGODB_URI'];
            const missing = validateRequiredEnvVars(requiredVars);
            
            expect(missing).toEqual([]);
        });

        it('should return array of missing variables', () => {
            delete process.env.PORT;
            delete process.env.NODE_ENV;
            
            const requiredVars = ['PORT', 'NODE_ENV', 'MONGODB_URI'];
            const missing = validateRequiredEnvVars(requiredVars);
            
            expect(missing).toEqual(['PORT', 'NODE_ENV']);
        });

        it('should handle empty array input', () => {
            const missing = validateRequiredEnvVars([]);
            
            expect(missing).toEqual([]);
        });
    });
});
