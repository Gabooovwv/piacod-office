const crypto = require('crypto');

// PHP-compatible password hashing test
function testPhpCompatibility() {
    const password = '1wd3wa"SQE';
    const setting = '$P$Blg/Z31esdXU.KMk.YUk.BlU.l3k.X/';
    
    console.log('=== PHP Compatibility Test ===');
    console.log('Password:', password);
    console.log('Setting:', setting);
    
    // Extract components
    const id = setting.substring(0, 3);
    const countLog2 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.indexOf(setting[3]);
    const count = 1 << countLog2;
    const salt = setting.substring(4, 12);
    
    console.log('ID:', id);
    console.log('Count Log2:', countLog2);
    console.log('Count:', count);
    console.log('Salt:', salt);
    
    // Test MD5 hashing
    console.log('\n=== MD5 Hashing Test ===');
    
    // First hash: salt + password
    const firstHash = crypto.createHash('md5').update(salt + password).digest('binary');
    console.log('First hash (hex):', firstHash.toString('hex'));
    console.log('First hash (binary length):', firstHash.length);
    
    // Subsequent hashes
    let currentHash = firstHash;
    for (let i = 1; i < Math.min(count, 5); i++) { // Limit to first 5 for debugging
        currentHash = crypto.createHash('md5').update(currentHash + password).digest('binary');
        console.log(`Hash ${i + 1} (hex):`, currentHash.toString('hex'));
    }
    
    // Test encode64
    console.log('\n=== Encode64 Test ===');
    const itoa64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    
    function encode64(input, count) {
        let output = '';
        let i = 0;
        
        do {
            let value = input.charCodeAt(i++);
            output += itoa64[value & 0x3f];
            
            if (i < count) {
                value |= input.charCodeAt(i) << 8;
            }
            
            output += itoa64[(value >> 6) & 0x3f];
            
            if (i++ >= count) {
                break;
            }
            
            if (i < count) {
                value |= input.charCodeAt(i) << 16;
            }
            
            output += itoa64[(value >> 12) & 0x3f];
            
            if (i++ >= count) {
                break;
            }
            
            output += itoa64[(value >> 18) & 0x3f];
        } while (i < count);
        
        return output;
    }
    
    const encoded = encode64(currentHash, 16);
    console.log('Encoded result:', encoded);
    console.log('Expected suffix:', setting.substring(12));
    console.log('Match:', encoded === setting.substring(12));
}

testPhpCompatibility(); 