import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Global test timeout
jest.setTimeout(10000);

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  // Uncomment to suppress console.log in tests
  // log: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  error: jest.fn(),
};

// Global test utilities
global.testUtils = {
  // Generate test data
  generateTestUser: (overrides = {}) => ({
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPass123!',
    nationality: {
      name: 'Test Country',
      code: 'TC'
    },
    role: 'donor',
    ...overrides
  }),

  // Generate test NGO data
  generateTestNGO: (overrides = {}) => ({
    name: 'Test NGO',
    email: 'test@ngo.org',
    password: 'TestPass123!',
    nationality: {
      name: 'Test Country',
      code: 'TC'
    },
    role: 'ngo',
    registrationNumber: '1234567890',
    officialContactPhone: '+1234567890',
    officialEmail: 'official@ngo.org',
    ...overrides
  }),

  // Generate test campaign data
  generateTestCampaign: (overrides = {}) => ({
    title: 'Test Campaign',
    description: 'This is a test campaign description for testing purposes.',
    goal: 1000,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    ...overrides
  }),

  // Generate test donation data
  generateTestDonation: (overrides = {}) => ({
    amount: 100,
    campaignId: '507f1f77bcf86cd799439011', // Mock ObjectId
    message: 'Test donation message',
    ...overrides
  }),

  // Mock JWT token
  generateMockToken: (payload = {}) => {
    const defaultPayload = {
      id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      role: 'donor',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      ...payload
    };
    
    // This is a mock token - in real tests, you'd use a proper JWT library
    return `mock.jwt.token.${btoa(JSON.stringify(defaultPayload))}`;
  },

  // Mock request object
  createMockRequest: (overrides = {}) => ({
    body: {},
    query: {},
    params: {},
    headers: {},
    method: 'GET',
    url: '/test',
    originalUrl: '/test',
    ip: '127.0.0.1',
    get: jest.fn(),
    ...overrides
  }),

  // Mock response object
  createMockResponse: () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn().mockReturnValue(res);
    res.end = jest.fn();
    return res;
  },

  // Mock next function
  createMockNext: () => jest.fn(),

  // Wait for async operations
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Clean up test data
  cleanup: async () => {
    // Add cleanup logic here if needed
    await global.testUtils.wait(100);
  }
};

// Before each test
beforeEach(async () => {
  // Reset mocks
  jest.clearAllMocks();
  
  // Wait a bit for any async operations to settle
  await global.testUtils.wait(50);
});

// After each test
afterEach(async () => {
  // Clean up after each test
  await global.testUtils.cleanup();
});

// Global test environment setup
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only-32-chars-long';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-kindify';
process.env.PORT = '3001'; // Use different port for tests
