const PasswordValidator = require('./src/utils/password-validator');

// Test data
const password = '1wd3wa"SQE';
const hash1 = '$P$Blg/Z31esdXU.KMk.YUk.BlU.l3k.X/';
const hash2 = '$P$Blg/Z31es9oAjYqhPwc26A2EB4PHzE0';

console.log('=== Password Validator Test ===\n');

// Test hash 1
console.log('Testing Hash 1:');
const result1 = PasswordValidator.debugPasswordCheck(password, hash1);
console.log('Result 1:', result1.isValid ? '✅ VALID' : '❌ INVALID');
console.log('');

// Test hash 2
console.log('Testing Hash 2:');
const result2 = PasswordValidator.debugPasswordCheck(password, hash2);
console.log('Result 2:', result2.isValid ? '✅ VALID' : '❌ INVALID');
console.log('');

// Test both hashes
console.log('=== Summary ===');
console.log(`Hash 1 (${hash1}): ${result1.isValid ? 'VALID' : 'INVALID'}`);
console.log(`Hash 2 (${hash2}): ${result2.isValid ? 'VALID' : 'INVALID'}`);

// Test the checkPassword method directly
console.log('\n=== Direct Method Test ===');
console.log('checkPassword with hash1:', PasswordValidator.checkPassword(password, hash1));
console.log('checkPassword with hash2:', PasswordValidator.checkPassword(password, hash2)); 