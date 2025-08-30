import { body, param, query, validationResult } from 'express-validator';

// Common validation rules
const commonValidations = {
    // Email validation
    email: body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    // Password validation
    password: body('password')
        .isLength({ min: 8, max: 128 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must be 8-128 characters with at least one uppercase, lowercase, number, and special character'),

    // Name validation
    name: body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name must be 2-50 characters with only letters and spaces'),

    // Phone validation
    phone: body('phone')
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number'),

    // ObjectId validation
    objectId: param('id')
        .isMongoId()
        .withMessage('Invalid ID format'),

    // Pagination validation
    pagination: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100')
    ]
};

// User registration validation
export const validateUserRegistration = [
    commonValidations.name,
    commonValidations.email,
    commonValidations.password,
    body('nationality.name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Nationality name must be 2-50 characters'),
    body('nationality.code')
        .trim()
        .isLength({ min: 2, max: 3 })
        .isUppercase()
        .withMessage('Nationality code must be 2-3 uppercase characters'),
    body('role')
        .isIn(['donor', 'ngo', 'admin'])
        .withMessage('Invalid role specified')
];

// User login validation
export const validateUserLogin = [
    commonValidations.email,
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Profile update validation
export const validateProfileUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name must be 2-50 characters with only letters and spaces'),
    body('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number'),
    body('address')
        .optional()
        .trim()
        .isLength({ min: 5, max: 250 })
        .withMessage('Address must be 5-250 characters')
];

// NGO registration validation
export const validateNGORegistration = [
    commonValidations.name,
    commonValidations.email,
    commonValidations.password,
    body('registrationNumber')
        .trim()
        .isLength({ min: 10, max: 20 })
        .withMessage('Registration number must be 10-20 characters'),
    body('officialContactPhone')
        .isMobilePhone('any')
        .withMessage('Please provide a valid contact phone number'),
    body('officialEmail')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid official email address')
];

// Campaign validation
export const validateCampaign = [
    body('title')
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage('Campaign title must be 5-100 characters'),
    body('description')
        .trim()
        .isLength({ min: 20, max: 1000 })
        .withMessage('Campaign description must be 20-1000 characters'),
    body('goal')
        .isFloat({ min: 1 })
        .withMessage('Campaign goal must be a positive number'),
    body('startDate')
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    body('endDate')
        .isISO8601()
        .custom((endDate, { req }) => {
            if (new Date(endDate) <= new Date(req.body.startDate)) {
                throw new Error('End date must be after start date');
            }
            return true;
        })
        .withMessage('End date must be after start date')
];

// Donation validation
export const validateDonation = [
    body('amount')
        .isFloat({ min: 1 })
        .withMessage('Donation amount must be a positive number'),
    body('campaignId')
        .isMongoId()
        .withMessage('Invalid campaign ID'),
    body('message')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Message must be less than 500 characters')
];

// Contact form validation
export const validateContactForm = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be 2-50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('subject')
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage('Subject must be 5-100 characters'),
    body('message')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Message must be 10-1000 characters'),
    body('type')
        .isIn(['general', 'support', 'partnership', 'feedback'])
        .withMessage('Invalid contact type')
];

// Generic validation middleware
export const validate = (validations) => {
    return async (req, res, next) => {
        // Apply all validations
        await Promise.all(validations.map(validation => validation.run(req)));

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map(error => ({
                    field: error.path,
                    message: error.msg,
                    value: error.value
                }))
            });
        }

        next();
    };
};

// Sanitization middleware
export const sanitizeInput = (req, res, next) => {
    // Sanitize string inputs
    const sanitizeString = (str) => {
        if (typeof str === 'string') {
            return str
                .trim()
                .replace(/[<>]/g, '') // Remove potential HTML tags
                .replace(/javascript:/gi, '') // Remove javascript: protocol
                .replace(/on\w+=/gi, ''); // Remove event handlers
        }
        return str;
    };

    // Recursively sanitize request body
    const sanitizeObject = (obj) => {
        if (typeof obj === 'object' && obj !== null) {
            if (Array.isArray(obj)) {
                return obj.map(sanitizeObject);
            } else {
                const sanitized = {};
                for (const [key, value] of Object.entries(obj)) {
                    sanitized[key] = sanitizeObject(value);
                }
                return sanitized;
            }
        } else if (typeof obj === 'string') {
            return sanitizeString(obj);
        }
        return obj;
    };

    // Sanitize request body, query, and params
    if (req.body) req.body = sanitizeObject(req.body);
    if (req.query) req.query = sanitizeObject(req.query);
    if (req.params) req.params = sanitizeObject(req.params);

    next();
};

export default {
    validate,
    sanitizeInput,
    commonValidations,
    validateUserRegistration,
    validateUserLogin,
    validateProfileUpdate,
    validateNGORegistration,
    validateCampaign,
    validateDonation,
    validateContactForm
};
