import crypto from 'crypto';

/**
 * Encryption utility for securing sensitive data at rest and in transit
 * Uses AES-256-GCM encryption algorithm for authenticated encryption
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For GCM mode
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;
const KEY_LENGTH = 32; // 256 bits

/**
 * Get the encryption key from environment variables
 * Falls back to a development key if not set (NOT for production!)
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ENCRYPTION_KEY environment variable is required in production');
    }
    // Development fallback - DO NOT USE IN PRODUCTION
    console.warn('⚠️  WARNING: Using default encryption key. Set ENCRYPTION_KEY in production!');
    return crypto.scryptSync('dev-key-change-in-production', 'salt', KEY_LENGTH);
  }
  
  // Derive a proper key from the environment variable using scrypt
  return crypto.scryptSync(key, 'artmasons-salt-v1', KEY_LENGTH);
}

/**
 * Encrypt a string or object
 * @param data - The data to encrypt (string or object that can be JSON stringified)
 * @returns Encrypted string in format: iv:authTag:encryptedData (all hex encoded)
 */
export function encrypt(data: string | object): string {
  try {
    const text = typeof data === 'string' ? data : JSON.stringify(data);
    const key = getEncryptionKey();
    
    // Generate random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    // Encrypt the data
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Get the authentication tag
    const authTag = cipher.getAuthTag();
    
    // Return format: iv:authTag:encryptedData (all hex)
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt an encrypted string
 * @param encryptedData - The encrypted string in format: iv:authTag:encryptedData
 * @param parseJSON - If true, attempts to parse the decrypted data as JSON
 * @returns Decrypted data (string or parsed object)
 */
export function decrypt<T = string>(encryptedData: string, parseJSON = false): T {
  try {
    const key = getEncryptionKey();
    
    // Split the encrypted data
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const [ivHex, authTagHex, encrypted] = parts;
    
    // Convert from hex
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    // Decrypt the data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    // Parse JSON if requested
    if (parseJSON) {
      return JSON.parse(decrypted) as T;
    }
    
    return decrypted as T;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Hash sensitive data (one-way) for comparison purposes
 * Uses SHA-256 with salt
 * @param data - The data to hash
 * @returns Hashed string in format: salt:hash (both hex encoded)
 */
export function hash(data: string): string {
  try {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const hash = crypto.pbkdf2Sync(data, salt, 100000, 64, 'sha256');
    return `${salt.toString('hex')}:${hash.toString('hex')}`;
  } catch (error) {
    console.error('Hashing error:', error);
    throw new Error('Failed to hash data');
  }
}

/**
 * Verify a hashed value
 * @param data - The plain text data to verify
 * @param hashedData - The hashed data to compare against
 * @returns True if the data matches the hash
 */
export function verifyHash(data: string, hashedData: string): boolean {
  try {
    const [saltHex, originalHash] = hashedData.split(':');
    if (!saltHex || !originalHash) {
      return false;
    }
    
    const salt = Buffer.from(saltHex, 'hex');
    const hash = crypto.pbkdf2Sync(data, salt, 100000, 64, 'sha256');
    const hashHex = hash.toString('hex');
    
    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(Buffer.from(hashHex), Buffer.from(originalHash));
  } catch (error) {
    console.error('Hash verification error:', error);
    return false;
  }
}

/**
 * Generate a secure random token
 * @param length - Length of the token (default: 32 bytes = 64 hex characters)
 * @returns Random token as hex string
 */
export function generateToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Encrypt sensitive fields in an object
 * @param obj - The object containing sensitive data
 * @param fieldsToEncrypt - Array of field names to encrypt
 * @returns New object with encrypted fields
 */
export function encryptFields<T extends Record<string, any>>(
  obj: T,
  fieldsToEncrypt: (keyof T)[]
): T {
  const result = { ...obj };
  
  for (const field of fieldsToEncrypt) {
    if (result[field] !== undefined && result[field] !== null) {
      const value = result[field];
      result[field] = encrypt(value) as T[keyof T];
    }
  }
  
  return result;
}

/**
 * Decrypt sensitive fields in an object
 * @param obj - The object with encrypted fields
 * @param fieldsToDecrypt - Array of field names to decrypt
 * @param parseJSON - Whether to parse decrypted values as JSON
 * @returns New object with decrypted fields
 */
export function decryptFields<T extends Record<string, any>>(
  obj: T,
  fieldsToDecrypt: (keyof T)[],
  parseJSON = false
): T {
  const result = { ...obj };
  
  for (const field of fieldsToDecrypt) {
    if (result[field] !== undefined && result[field] !== null) {
      try {
        const encryptedValue = result[field] as string;
        result[field] = decrypt(encryptedValue, parseJSON) as T[keyof T];
      } catch (error) {
        console.error(`Failed to decrypt field ${String(field)}:`, error);
        // Keep the original value if decryption fails (might already be plain text)
      }
    }
  }
  
  return result;
}

/**
 * Check if a string appears to be encrypted data
 * @param data - The string to check
 * @returns True if the data looks like encrypted data
 */
export function isEncrypted(data: string): boolean {
  // Check if it matches the format: iv:authTag:encryptedData (hex strings)
  const parts = data.split(':');
  if (parts.length !== 3) return false;
  
  // Check if all parts are valid hex strings of appropriate length
  const [iv, authTag, encrypted] = parts;
  const hexRegex = /^[0-9a-f]+$/i;
  
  return (
    hexRegex.test(iv) &&
    hexRegex.test(authTag) &&
    hexRegex.test(encrypted) &&
    iv.length === IV_LENGTH * 2 && // hex is 2 chars per byte
    authTag.length === AUTH_TAG_LENGTH * 2 &&
    encrypted.length > 0
  );
}

/**
 * Sanitize sensitive data for logging (replaces sensitive content)
 * @param data - The data to sanitize
 * @returns Sanitized string safe for logging
 */
export function sanitizeForLogging(data: any): string {
  if (typeof data === 'string') {
    if (data.includes('@')) {
      // Email - show first char and domain
      const parts = data.split('@');
      return `${parts[0][0]}***@${parts[1]}`;
    }
    if (data.length > 10) {
      // Long string - show first and last 4 chars
      return `${data.slice(0, 4)}...${data.slice(-4)}`;
    }
    return '***';
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      // Identify sensitive fields
      const sensitiveFields = ['email', 'phone', 'address', 'name', 'password', 'token', 'secret'];
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitized[key] = '***REDACTED***';
      } else {
        sanitized[key] = value;
      }
    }
    return JSON.stringify(sanitized);
  }
  
  return '***';
}

const encryption = {
  encrypt,
  decrypt,
  hash,
  verifyHash,
  generateToken,
  encryptFields,
  decryptFields,
  isEncrypted,
  sanitizeForLogging,
};

export default encryption;
