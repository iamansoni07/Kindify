import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment variable validation schema
const envSchema = {
    // Server Configuration
    PORT: {
        required: true,
        type: 'number',
        default: 3000,
        validate: (value) => value > 0 && value < 65536
    },
    NODE_ENV: {
        required: true,
        type: 'string',
        default: 'development',
        validate: (value) => ['development', 'production', 'test'].includes(value)
    },

    // Database Configuration
    MONGODB_URI: {
        required: true,
        type: 'string',
        validate: (value) => value.startsWith('mongodb://') || value.startsWith('mongodb+srv://')
    },

    // JWT Configuration
    JWT_SECRET: {
        required: true,
        type: 'string',
        validate: (value) => value.length >= 32,
        message: 'JWT_SECRET must be at least 32 characters long for security'
    },

    // Google OAuth Configuration
    GOOGLE_CLIENT_ID: {
        required: true,
        type: 'string',
        validate: (value) => value.length > 0 && value !== 'your_google_oauth_client_id_here'
    },

    // Email Configuration
    MAIL_ID: {
        required: true,
        type: 'string',
        validate: (value) => value.includes('@') && value !== 'your_email@gmail.com'
    },
    MAIL_PASSWORD: {
        required: true,
        type: 'string',
        validate: (value) => value.length > 0 && value !== 'your_app_specific_password'
    },
    SERVICE: {
        required: true,
        type: 'string',
        default: 'gmail',
        validate: (value) => ['gmail', 'outlook', 'yahoo'].includes(value)
    },
    DISPLAY_EMAIL: {
        required: true,
        type: 'string',
        validate: (value) => value.includes('@') && value !== 'your_display_email@gmail.com'
    },

    // SMTP Configuration
    SMTP_HOST: {
        required: true,
        type: 'string',
        default: 'smtp.gmail.com'
    },
    SMTP_PORT: {
        required: false,
        type: 'number',
        default: 587,
        validate: (value) => [25, 465, 587, 2525].includes(Number(value))
    },
    SMTP_USER: {
        required: true,
        type: 'string',
        validate: (value) => value.includes('@') && value !== 'your_smtp_email@gmail.com'
    },
    SMTP_PASSWORD: {
        required: true,
        type: 'string',
        validate: (value) => value.length > 0 && value !== 'your_smtp_password'
    },
    SMTP_SECURE: {
        required: false,
        type: 'boolean',
        default: false,
        validate: (value) => ['true', 'false', true, false].includes(value)
    },
    SMTP_LOCK: {
        required: false,
        type: 'boolean',
        default: false,
        validate: (value) => ['true', 'false', true, false].includes(value)
    },

    // Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME: {
        required: true,
        type: 'string',
        validate: (value) => value.length > 0 && value !== 'your_cloudinary_cloud_name'
    },
    CLOUDINARY_API_KEY: {
        required: true,
        type: 'string',
        validate: (value) => value.length > 0 && value !== 'your_cloudinary_api_key'
    },
    CLOUDINARY_API_SECRET: {
        required: true,
        type: 'string',
        validate: (value) => value.length > 0 && value !== 'your_cloudinary_api_secret'
    },

    // Frontend Configuration
    FRONTEND_URI: {
        required: true,
        type: 'string',
        validate: (value) => value.startsWith('http://') || value.startsWith('https://')
    }
};

// Validation functions
const validateEnvVar = (name, config) => {
    const value = process.env[name];
    
    // Check if required
    if (config.required && !value) {
        return {
            valid: false,
            error: `Missing required environment variable: ${name}`
        };
    }

    // Use default if not set and not required
    if (!value && config.default !== undefined) {
        process.env[name] = config.default;
        return { valid: true };
    }

    // Type validation
    if (config.type === 'number') {
        const numValue = Number(value);
        if (isNaN(numValue)) {
            return {
                valid: false,
                error: `${name} must be a valid number, got: ${value}`
            };
        }
        process.env[name] = numValue; // Convert to number
    } else if (config.type === 'boolean') {
        if (typeof value === 'string') {
            if (value === 'true') {
                process.env[name] = true;
            } else if (value === 'false') {
                process.env[name] = false;
            } else {
                return {
                    valid: false,
                    error: `${name} must be 'true' or 'false', got: ${value}`
                };
            }
        }
    }

    // Custom validation
    if (config.validate) {
        try {
            const isValid = config.validate(process.env[name]);
            if (!isValid) {
                return {
                    valid: false,
                    error: config.message || `${name} validation failed`
                };
            }
        } catch (error) {
            return {
                valid: false,
                error: `${name} validation error: ${error.message}`
            };
        }
    }

    return { valid: true };
};

// Main validation function
export const validateEnvironment = () => {
    console.log('🔍 Validating environment variables...\n');
    
    const errors = [];
    const warnings = [];
    let allValid = true;

    for (const [name, config] of Object.entries(envSchema)) {
        const result = validateEnvVar(name, config);
        
        if (!result.valid) {
            errors.push(`❌ ${name}: ${result.error}`);
            allValid = false;
        } else {
            const value = process.env[name];
            if (name.includes('SECRET') || name.includes('PASSWORD')) {
                console.log(`✅ ${name}: ***SET***`);
            } else {
                console.log(`✅ ${name}: ${value}`);
            }
        }
    }

    // Special checks
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret && jwtSecret.length < 32) {
        warnings.push(`⚠️ JWT_SECRET is weak (${jwtSecret.length} chars). Consider using at least 32 characters.`);
    }

    // Display results
    if (warnings.length > 0) {
        console.log('\n⚠️ Warnings:');
        warnings.forEach(warning => console.log(warning));
    }

    if (errors.length > 0) {
        console.log('\n❌ Errors:');
        errors.forEach(error => console.log(error));
        console.log('\n🚫 Application cannot start with invalid configuration!');
        console.log('📝 Please fix the above errors and try again.');
        console.log('💡 Copy env.example to .env and fill in your actual values.');
    } else {
        console.log('\n🎉 All environment variables are valid!');
    }

    return allValid;
};

// Export individual validation functions for specific use cases
export const validateRequiredEnvVars = (vars) => {
    const missing = [];
    vars.forEach(varName => {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    });
    return missing;
};

export default validateEnvironment;

