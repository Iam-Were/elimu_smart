// PCI-Compliant Encryption Service
// Used for encrypting sensitive payment data (phone numbers, receipt numbers, emails)
// Encryption Algorithm: AES-256-CBC

const crypto = require('crypto');

// Get encryption key from environment (must be 32 bytes / 64 hex characters)
const ENCRYPTION_KEY = process.env.PAYMENT_ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // AES block size

/**
 * Validate encryption key
 */
function validateEncryptionKey() {
  if (!ENCRYPTION_KEY) {
    throw new Error('PAYMENT_ENCRYPTION_KEY environment variable is not set');
  }

  if (ENCRYPTION_KEY.length !== 64) {
    throw new Error('PAYMENT_ENCRYPTION_KEY must be 64 hex characters (32 bytes). Generate with: openssl rand -hex 32');
  }

  // Verify it's valid hex
  if (!/^[0-9a-f]{64}$/i.test(ENCRYPTION_KEY)) {
    throw new Error('PAYMENT_ENCRYPTION_KEY must be a valid hex string');
  }
}

/**
 * Encrypt sensitive data
 * @param {string} text - Plain text to encrypt
 * @returns {string} - Encrypted string in format: iv:encryptedData
 */
function encrypt(text) {
  if (!text) {
    return null;
  }

  try {
    validateEncryptionKey();

    // Generate random IV for this encryption
    const iv = crypto.randomBytes(IV_LENGTH);

    // Create cipher
    const cipher = crypto.createCipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      iv
    );

    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return IV + encrypted data (separated by :)
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('❌ Encryption failed:', error.message);
    throw new Error('Failed to encrypt data: ' + error.message);
  }
}

/**
 * Decrypt sensitive data
 * @param {string} encryptedText - Encrypted string in format: iv:encryptedData
 * @returns {string} - Decrypted plain text
 */
function decrypt(encryptedText) {
  if (!encryptedText) {
    return null;
  }

  try {
    validateEncryptionKey();

    // Split IV and encrypted data
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = Buffer.from(parts[1], 'hex');

    // Create decipher
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      iv
    );

    // Decrypt the data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('❌ Decryption failed:', error.message);
    throw new Error('Failed to decrypt data: ' + error.message);
  }
}

/**
 * Hash sensitive data (one-way for searching)
 * Use for: phone number lookup, receipt number verification
 * @param {string} text - Text to hash
 * @returns {string} - SHA-256 hash
 */
function hash(text) {
  if (!text) {
    return null;
  }

  return crypto
    .createHash('sha256')
    .update(text)
    .digest('hex');
}

/**
 * Mask phone number for display (show last 4 digits only)
 * @param {string} phoneNumber - Full phone number
 * @returns {string} - Masked phone number (e.g., ****5678)
 */
function maskPhoneNumber(phoneNumber) {
  if (!phoneNumber || phoneNumber.length < 4) {
    return '****';
  }

  const last4 = phoneNumber.slice(-4);
  return `****${last4}`;
}

/**
 * Mask M-Pesa receipt number for display
 * @param {string} receiptNumber - Full receipt number
 * @returns {string} - Masked receipt (e.g., QEI****789)
 */
function maskReceiptNumber(receiptNumber) {
  if (!receiptNumber || receiptNumber.length < 6) {
    return '****';
  }

  const first3 = receiptNumber.slice(0, 3);
  const last3 = receiptNumber.slice(-3);
  return `${first3}****${last3}`;
}

/**
 * Sanitize data for audit logs (remove sensitive fields)
 * @param {Object} data - Object to sanitize
 * @returns {Object} - Sanitized object
 */
function sanitizeForAudit(data) {
  const sanitized = { ...data };

  // Remove or mask sensitive fields
  const sensitiveFields = [
    'password',
    'pin',
    'cardNumber',
    'cvv',
    'phoneNumber',
    'mpesaReceiptNumber',
    'email'
  ];

  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      if (field === 'phoneNumber') {
        sanitized[field] = maskPhoneNumber(sanitized[field]);
      } else if (field === 'mpesaReceiptNumber') {
        sanitized[field] = maskReceiptNumber(sanitized[field]);
      } else {
        sanitized[field] = '***REDACTED***';
      }
    }
  });

  return sanitized;
}

/**
 * Generate encryption key (for initial setup)
 * Run this once and store in .env
 * @returns {string} - 64-character hex key
 */
function generateEncryptionKey() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = {
  encrypt,
  decrypt,
  hash,
  maskPhoneNumber,
  maskReceiptNumber,
  sanitizeForAudit,
  generateEncryptionKey,
  validateEncryptionKey
};

// CLI tool: node services/encryption.js generate-key
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args[0] === 'generate-key') {
    const key = generateEncryptionKey();
    console.log('\n🔑 Generated Encryption Key:');
    console.log(key);
    console.log('\n📝 Add this to your .env file:');
    console.log(`PAYMENT_ENCRYPTION_KEY=${key}`);
    console.log('\n⚠️  Keep this key secure! Never commit it to version control.\n');
  } else if (args[0] === 'test') {
    console.log('\n🧪 Testing Encryption Service...\n');

    // Test encryption/decryption
    const testData = '254712345678';
    console.log('Original:', testData);

    const encrypted = encrypt(testData);
    console.log('Encrypted:', encrypted);

    const decrypted = decrypt(encrypted);
    console.log('Decrypted:', decrypted);

    console.log('\n✅ Test', decrypted === testData ? 'PASSED' : 'FAILED');

    // Test masking
    console.log('\n🎭 Testing Masking...');
    console.log('Phone:', maskPhoneNumber('254712345678'));
    console.log('Receipt:', maskReceiptNumber('QEI2X1C9GH'));

    console.log('\n');
  } else {
    console.log('\nUsage:');
    console.log('  node services/encryption.js generate-key  # Generate new encryption key');
    console.log('  node services/encryption.js test          # Test encryption functions\n');
  }
}
