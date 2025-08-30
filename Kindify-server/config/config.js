import { validateEnvironment } from './env.validation.js';

// Validate environment before exporting config
const isEnvValid = validateEnvironment();

if (!isEnvValid) {
    console.error('❌ Environment validation failed. Exiting...');
    process.exit(1);
}

// Export validated configuration
export const config = {
    // Server Configuration
    server: {
        port: process.env.PORT,
        nodeEnv: process.env.NODE_ENV,
        frontendUri: process.env.FRONTEND_URI
    },

    // Database Configuration
    database: {
        uri: process.env.MONGODB_URI
    },

    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET
    },

    // Google OAuth Configuration
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID
    },

    // Email Configuration
    email: {
        service: process.env.SERVICE,
        user: process.env.MAIL_ID,
        password: process.env.MAIL_PASSWORD,
        displayEmail: process.env.DISPLAY_EMAIL
    },

    // SMTP Configuration
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
        secure: process.env.SMTP_SECURE,
        lock: process.env.SMTP_LOCK
    },

    // Cloudinary Configuration
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
    }
};

// Helper functions
export const isDevelopment = () => config.server.nodeEnv === 'development';
export const isProduction = () => config.server.nodeEnv === 'production';
export const isTest = () => config.server.nodeEnv === 'test';

export default config;

