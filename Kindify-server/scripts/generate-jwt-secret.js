import crypto from 'crypto';

// Generate a strong JWT secret
const generateJWTSecret = () => {
    // Generate 32 random bytes and convert to hex
    const secret = crypto.randomBytes(32).toString('hex');
    
    console.log('🔐 Generated Strong JWT Secret:');
    console.log('=====================================');
    console.log(secret);
    console.log('=====================================');
    console.log(`📏 Length: ${secret.length} characters`);
    console.log('✅ This is cryptographically secure');
    console.log('');
    console.log('📝 Copy this to your .env file as:');
    console.log(`JWT_SECRET=${secret}`);
    console.log('');
    console.log('⚠️  Keep this secret secure and never commit it to version control!');
    
    return secret;
};

// Generate multiple options
console.log('🎲 Generating multiple JWT secret options...\n');

for (let i = 1; i <= 3; i++) {
    console.log(`Option ${i}:`);
    generateJWTSecret();
    console.log('');
}

