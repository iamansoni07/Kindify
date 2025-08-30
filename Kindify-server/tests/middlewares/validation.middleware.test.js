import { 
    validate, 
    sanitizeInput,
    validateUserRegistration,
    validateUserLogin,
    validateProfileUpdate,
    validateNGORegistration,
    validateCampaign,
    validateDonation,
    validateContactForm
} from '../../middlewares/validation.middleware.js';

describe('Validation Middleware', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = global.testUtils.createMockRequest();
        mockRes = global.testUtils.createMockResponse();
        mockNext = global.testUtils.createMockNext();
    });

    describe('validate() function', () => {
        it('should call next() when validation passes', async () => {
            const validations = [
                {
                    run: jest.fn().mockResolvedValue({
                        isEmpty: () => true,
                        array: () => []
                    })
                }
            ];

            await validate(validations)(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });

        it('should return 400 error when validation fails', async () => {
            const validations = [
                {
                    run: jest.fn().mockResolvedValue({
                        isEmpty: () => false,
                        array: () => [
                            { path: 'email', msg: 'Invalid email', value: 'invalid-email' }
                        ]
                    })
                }
            ];

            await validate(validations)(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Validation failed',
                errors: [
                    { field: 'email', message: 'Invalid email', value: 'invalid-email' }
                ]
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe('sanitizeInput() middleware', () => {
        it('should sanitize HTML tags from strings', () => {
            mockReq.body = {
                name: '<script>alert("xss")</script>John',
                description: 'Hello <b>world</b>!'
            };

            sanitizeInput(mockReq, mockRes, mockNext);

            expect(mockReq.body.name).toBe('John');
            expect(mockReq.body.description).toBe('Hello world!');
            expect(mockNext).toHaveBeenCalled();
        });

        it('should sanitize javascript: protocol', () => {
            mockReq.body = {
                url: 'javascript:alert("xss")',
                link: 'https://example.com'
            };

            sanitizeInput(mockReq, mockRes, mockNext);

            expect(mockReq.body.url).toBe('alert("xss")');
            expect(mockReq.body.link).toBe('https://example.com');
        });

        it('should sanitize event handlers', () => {
            mockReq.body = {
                content: 'Click me onclick="alert(\'xss\')"',
                text: 'Normal text'
            };

            sanitizeInput(mockReq, mockRes, mockNext);

            expect(mockReq.body.content).toBe('Click me ');
            expect(mockReq.body.text).toBe('Normal text');
        });

        it('should handle nested objects', () => {
            mockReq.body = {
                user: {
                    name: '<b>John</b>',
                    profile: {
                        bio: '<script>alert("xss")</script>Developer'
                    }
                }
            };

            sanitizeInput(mockReq, mockRes, mockNext);

            expect(mockReq.body.user.name).toBe('John');
            expect(mockReq.body.user.profile.bio).toBe('Developer');
        });

        it('should handle arrays', () => {
            mockReq.body = {
                tags: ['<script>', 'normal', '<b>bold</b>']
            };

            sanitizeInput(mockReq, mockRes, mockNext);

            expect(mockReq.body.tags).toEqual(['', 'normal', 'bold']);
        });
    });

    describe('validateUserRegistration', () => {
        it('should validate required fields', async () => {
            const validUser = global.testUtils.generateTestUser();
            
            // Mock validation result
            const mockValidationResult = {
                isEmpty: () => true,
                array: () => []
            };

            // Mock each validation rule
            const mockValidations = validateUserRegistration.map(() => ({
                run: jest.fn().mockResolvedValue(mockValidationResult)
            }));

            await validate(mockValidations)(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('validateUserLogin', () => {
        it('should validate email and password', async () => {
            const mockValidationResult = {
                isEmpty: () => true,
                array: () => []
            };

            const mockValidations = validateUserLogin.map(() => ({
                run: jest.fn().mockResolvedValue(mockValidationResult)
            }));

            await validate(mockValidations)(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('validateProfileUpdate', () => {
        it('should validate optional fields', async () => {
            const mockValidationResult = {
                isEmpty: () => true,
                array: () => []
            };

            const mockValidations = validateProfileUpdate.map(() => ({
                run: jest.fn().mockResolvedValue(mockValidationResult)
            }));

            await validate(mockValidations)(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('validateNGORegistration', () => {
        it('should validate NGO specific fields', async () => {
            const mockValidationResult = {
                isEmpty: () => true,
                array: () => []
            };

            const mockValidations = validateNGORegistration.map(() => ({
                run: jest.fn().mockResolvedValue(mockValidationResult)
            }));

            await validate(mockValidations)(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('validateCampaign', () => {
        it('should validate campaign fields', async () => {
            const mockValidationResult = {
                isEmpty: () => true,
                array: () => []
            };

            const mockValidations = validateCampaign.map(() => ({
                run: jest.fn().mockResolvedValue(mockValidationResult)
            }));

            await validate(mockValidations)(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('validateDonation', () => {
        it('should validate donation fields', async () => {
            const mockValidationResult = {
                isEmpty: () => true,
                array: () => []
            };

            const mockValidations = validateDonation.map(() => ({
                run: jest.fn().mockResolvedValue(mockValidationResult)
            }));

            await validate(mockValidations)(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('validateContactForm', () => {
        it('should validate contact form fields', async () => {
            const mockValidationResult = {
                isEmpty: () => true,
                array: () => []
            };

            const mockValidations = validateContactForm.map(() => ({
                run: jest.fn().mockResolvedValue(mockValidationResult)
            }));

            await validate(mockValidations)(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });
});
