# 🔐 Security & Encryption Implementation Guide

## Overview

This document outlines the comprehensive security and encryption implementation for the ArtMasons e-commerce platform. All sensitive data is encrypted at rest, and security headers are enforced on all API endpoints.

## Table of Contents

1. [Encryption Strategy](#encryption-strategy)
2. [Environment Setup](#environment-setup)
3. [Data Encryption](#data-encryption)
4. [Security Headers](#security-headers)
5. [Rate Limiting](#rate-limiting)
6. [API Security](#api-security)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)
9. [Compliance](#compliance)

---

## Encryption Strategy

### Algorithm & Standards

- **Encryption Cipher**: AES-256-GCM (Advanced Encryption Standard with Galois/Counter Mode)
- **Key Derivation**: PBKDF2 with SHA-256 (100,000 iterations)
- **Key Strength**: 256-bit encryption keys
- **IV (Initialization Vector)**: Randomly generated 16-byte vector per message
- **Authentication**: Galois/Counter Mode (GCM) provides authenticated encryption with associated data (AEAD)

**Why AES-256-GCM?**
- Industry standard for data protection
- Provides both confidentiality (encryption) AND authenticity (authentication)
- Prevents tampering with encrypted data
- NIST approved for classified information

### Encrypted Data

All personally identifiable information (PII) and sensitive data is encrypted:

```
✅ Encrypted:
- Customer names
- Email addresses
- Phone numbers
- Delivery addresses
- Payment transaction details
- Quote request information

⚠️ Not Encrypted (but transmitted over HTTPS):
- Product titles and prices
- Item metadata (SKU, size, dimensions)
- Order IDs and status
- Timestamps
```

---

## Environment Setup

### Required Environment Variables

#### Development

```bash
# Create .env.local file with:
ENCRYPTION_KEY=your-dev-encryption-key-change-in-production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_***
STRIPE_SECRET_KEY=sk_test_***
STRIPE_WEBHOOK_SECRET=whsec_***
```

#### Production

```bash
# CRITICAL: Generate a strong random key for production
ENCRYPTION_KEY=$(openssl rand -hex 32)

# Export to your production environment:
# - AWS Secrets Manager
# - Google Cloud Secret Manager
# - HashiCorp Vault
# - Environment variables (with proper access controls)
```

### Generating a Strong Encryption Key

**Option 1: Using OpenSSL (Recommended)**
```bash
openssl rand -hex 32
# Output: a7e8f3c2b9d4e1f6a8c3d2e1f9b7a4e5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0

# Safe alternatives:
# macOS/Linux: head -c 32 /dev/urandom | base64
# Python: python -c "import secrets; print(secrets.token_hex(32))"
# Node.js: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Using Node.js**
```javascript
const crypto = require('crypto');
console.log(crypto.randomBytes(32).toString('hex'));
```

### Key Rotation

While AES-256-GCM doesn't require frequent rotation, consider:

```
Rotation Schedule:
- Every 2 years for general data
- Annually for high-security environments
- Immediately if key is compromised

Process:
1. Generate new key with: openssl rand -hex 32
2. Set up dual keys (old and new) in system
3. Re-encrypt all data with new key
4. Verify all data is decrypted correctly
5. Remove old key after validation period
```

---

## Data Encryption

### Encryption Module Location

**File**: `app/lib/encryption.ts`

Key functions:

```typescript
// Encrypt data
encrypt(data: string | object): string
// Returns: "iv:authTag:encryptedData" (all hex-encoded)

// Decrypt data
decrypt<T>(encryptedData: string, parseJSON?: boolean): T

// Hash sensitive data (one-way, for comparisons)
hash(data: string): string

// Verify hashed data
verifyHash(data: string, hashedData: string): boolean

// Encrypt specific fields in an object
encryptFields<T>(obj: T, fieldsToEncrypt: (keyof T)[]): T

// Decrypt specific fields
decryptFields<T>(obj: T, fieldsToDecrypt: (keyof T)[], parseJSON?: boolean): T

// Check if data is encrypted
isEncrypted(data: string): boolean

// Sanitize data for logs
sanitizeForLogging(data: any): string
```

### Usage Examples

#### Encrypting Customer Data

```typescript
import { encrypt, decrypt } from '@/lib/encryption';

// Encrypt
const customer = {
  name: "John Doe",
  email: "john@example.com",
  phone: "1234567890"
};
const encrypted = encrypt(customer); // "a7e8f3c2:b9d4e1f6:encrypted_data_hex..."

// Decrypt
const decrypted = decrypt(encrypted, true); // { name, email, phone }
```

#### Encrypting Specific Fields

```typescript
import { encryptFields, decryptFields } from '@/lib/encryption';

const order = {
  id: "order_123",
  customer: { name: "John", email: "john@example.com" },
  total: 1000
};

// Encrypt only the customer field
const encrypted = encryptFields(order, ['customer']);
// { id: "order_123", customer: "a7e8f3c2:b9d4e1f6:...", total: 1000 }

// Decrypt
const decrypted = decryptFields(encrypted, ['customer'], true);
// { id: "order_123", customer: { name, email }, total: 1000 }
```

#### Logging Safely

```typescript
import { sanitizeForLogging } from '@/lib/encryption';

const sensitiveData = {
  email: "john@example.com",
  phone: "1234567890",
  name: "John Doe"
};

console.log(sanitizeForLogging(sensitiveData));
// Output: { email: "***REDACTED***", phone: "***REDACTED***", name: "***REDACTED***" }
```

### Orders Encryption

**File**: `app/lib/orders.ts`

Orders are automatically encrypted when saved and decrypted when read:

```typescript
// Writing orders (automatic encryption)
ordersLib.saveOrder({
  sessionId: "pi_3ABC123",
  customer: { name: "John", email: "john@example.com" },
  // ... other fields
});
// Stored on disk with customer data encrypted

// Reading orders (automatic decryption)
const orders = ordersLib.readOrders();
// Returns with customer data decrypted in memory
```

---

## Security Headers

### Headers Implemented

All API responses include these security headers:

```
X-Frame-Options: SAMEORIGIN
├─ Prevents clickjacking attacks
└─ Allows same-origin framing

X-Content-Type-Options: nosniff
├─ Prevents MIME-type sniffing
└─ Forces browser to respect Content-Type header

X-XSS-Protection: 1; mode=block
├─ Legacy XSS protection
└─ Enables browser XSS filter

Referrer-Policy: strict-origin-when-cross-origin
├─ Controls referrer information
└─ Balances privacy and functionality

Permissions-Policy: camera=(), microphone=(), geolocation=()
├─ Explicitly disables powerful features
└─ Reduces attack surface

[Production Only]
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
├─ Enforces HTTPS for entire domain
└─ Prevents SSL stripping attacks

[Optional - Enable if needed]
Content-Security-Policy: default-src 'self'; script-src 'self' https://js.stripe.com; ...
├─ Restricts content sources
└─ Prevents XSS and injection attacks
```

### Enabling Additional Headers

Production HSTS:
```bash
# In .env.production
ENABLE_HSTS=true
```

Content Security Policy:
```bash
# In .env.production
ENABLE_CSP=true
```

---

## Rate Limiting

### Implementation

**File**: `app/lib/security.ts`

Rate limiting is per-client IP address:

```typescript
// Default: 100 requests per 60 seconds per IP
isRateLimited(clientIP: string, max = 100, windowMs = 60000): boolean

// Custom limits per endpoint
async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  // 20 checkout attempts per minute
  if (isRateLimited(clientIP, 20, 60000)) {
    return error(429, 'Too many requests');
  }
}
```

### Rate Limit Configuration

Enable via environment variables:

```bash
# Maximum requests per window
RATE_LIMIT_MAX=100

# Time window in milliseconds
RATE_LIMIT_WINDOW=60000  # 1 minute
```

### Per-Endpoint Limits

```
✅ Recommended Limits:
- Quote Requests: 10/minute (quota-based sign-up forms)
- Checkout: 20/minute (payment processing)
- API Calls: 100/minute (general API)
- Login: 5/minute (brute-force protection)
- Password Reset: 3/hour (security measure)
```

---

## API Security

### Protected Endpoints

#### 1. Quote Request Endpoint

**Path**: `POST /api/request-quote`

**Security Features**:
- ✅ Rate limiting (10 req/min)
- ✅ Input sanitization
- ✅ Email/phone validation
- ✅ CORS checking
- ✅ Security headers
- ✅ Encrypted logging

**Example**:
```bash
curl -X POST http://localhost:3000/api/request-quote \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "artworkTitle": "Starry Night",
    "customWidth": "100",
    "customHeight": "80"
  }'
```

#### 2. Checkout Session Endpoint

**Path**: `POST /api/create-checkout-session`

**Security Features**:
- ✅ Rate limiting (20 req/min)
- ✅ Input sanitization
- ✅ Customer data sanitization
- ✅ Stripe API integration
- ✅ Order encryption storage
- ✅ Security headers

**Example**:
```bash
curl -X POST http://localhost:3000/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "title": "Starry Night",
        "price": 4200,
        "quantity": 1,
        "currency": "aed"
      }
    ],
    "customer": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Main St, City, Country"
    }
  }'
```

#### 3. Stripe Webhook Endpoint

**Path**: `POST /api/stripe-webhook`

**Security Features**:
- ✅ Webhook signature verification
- ✅ Event type validation
- ✅ Automatic order encryption
- ✅ Email sending integration
- ✅ Error handling

---

## Best Practices

### 1. Never Log Sensitive Data

```typescript
// ❌ WRONG - Logs expose sensitive data
console.log('Customer:', order.customer);

// ✅ CORRECT - Logs sanitized data
import { sanitizeForLogging } from '@/lib/encryption';
console.log('Customer:', sanitizeForLogging(order.customer));
```

### 2. Always Validate Input

```typescript
// ❌ WRONG - No validation
const email = req.body.email;

// ✅ CORRECT - Validated input
import { isValidEmail } from '@/lib/security';
if (!isValidEmail(email)) {
  return error(400, 'Invalid email');
}
```

### 3. Sanitize User Input

```typescript
// ❌ WRONG - Raw input stored
const name = req.body.name;

// ✅ CORRECT - Sanitized input
import { sanitizeInput } from '@/lib/security';
const name = sanitizeInput(req.body.name);
```

### 4. Use Security Middleware

```typescript
// ❌ WRONG - No security middleware
export async function POST(request: NextRequest) {
  // ... handler code
  return NextResponse.json({ ... });
}

// ✅ CORRECT - With security headers
import { withSecurityHeaders } from '@/lib/security';
export async function POST(request: NextRequest) {
  // ... handler code
  return withSecurityHeaders(NextResponse.json({ ... }));
}
```

### 5. Handle Errors Safely

```typescript
// ❌ WRONG - Exposes internal errors
catch (error) {
  return NextResponse.json({ error: error.message }, { status: 500 });
}

// ✅ CORRECT - Generic error message
catch (error) {
  console.error('Internal error:', error); // Safe internal logging
  return NextResponse.json(
    { error: 'An error occurred. Please try again later.' },
    { status: 500 }
  );
}
```

### 6. Environment Variables

```bash
# ❌ WRONG - Hardcoded secrets
const key = 'sk_test_abc123def456';

# ✅ CORRECT - Environment variables
const key = process.env.STRIPE_SECRET_KEY;
if (!key) throw new Error('Missing STRIPE_SECRET_KEY');
```

---

## Data Migration

### Migrating Existing Unencrypted Orders

If you have existing orders that are not encrypted, run the migration script:

```bash
# Run migration
npm run migrate:encrypt-orders
# Or manually:
npx tsx scripts/encrypt-existing-orders.ts
```

**Migration Process**:
1. Creates backup: `data/orders.backup.json`
2. Encrypts all customer and payment data
3. Writes encrypted orders back to `data/orders.json`
4. Reports encryption status

**Important**:
- ✅ Always create a backup before migrating
- ✅ Test in development environment first
- ✅ Verify all orders decrypt correctly
- ✅ Keep backup file in secure location

---

## Troubleshooting

### Issue: "ENCRYPTION_KEY environment variable is required"

**Solution**:
```bash
# Generate key
openssl rand -hex 32

# Add to .env.local (development) or environment variables (production)
ENCRYPTION_KEY=your-generated-key-here

# Restart application
npm run dev
```

### Issue: "Failed to decrypt data"

**Possible Causes**:
1. Wrong encryption key being used
2. Data corrupted or truncated
3. Legacy unencrypted data (expected during migration)

**Solution**:
```typescript
// Check if data is encrypted
import { isEncrypted } from '@/lib/encryption';
if (isEncrypted(data)) {
  // Data is encrypted, try to decrypt
  const decrypted = decrypt(data);
} else {
  // Data is plain text, use as-is
  // This is normal during migration
}
```

### Issue: Rate limit too strict

**Solution**: Adjust environment variables
```bash
# Increase limits for development
RATE_LIMIT_MAX=1000
RATE_LIMIT_WINDOW=60000
```

### Issue: Decryption fails for some orders

**Possible Causes**:
- Orders were encrypted with different key
- Orders partially encrypted during migration
- Database corruption

**Solution**:
```bash
# Check backup
cat data/orders.backup.json

# Review failed order IDs from migration script
# Manually decrypt specific orders for investigation
npx tsx -e "
import { decrypt } from './app/lib/encryption';
const encrypted = 'your-encrypted-data-here';
console.log(decrypt(encrypted, true));
"
```

---

## Compliance

### Standards Compliance

✅ **GDPR** (General Data Protection Regulation)
- Encryption of personal data at rest
- Right to access: Can decrypt and return data
- Right to be forgotten: Can delete encrypted data
- Data minimization: Only encrypt necessary fields

✅ **PCI DSS** (Payment Card Industry Data Security Standard)
- AES-256-GCM encryption
- Secure key management
- Data encryption in transit (HTTPS)
- Regular security audits

✅ **CCPA** (California Consumer Privacy Act)
- Encryption of consumer data
- Secure deletion capabilities
- Transparency in data handling

### Data Protection Best Practices

```
Policy: Data Encryption at Rest
├─ AES-256-GCM encryption
├─ Random IV per message
├─ Authenticated encryption (AEAD)
└─ Secure key derivation (PBKDF2)

Policy: Data Encryption in Transit
├─ HTTPS/TLS 1.2+
├─ Certificate validation
└─ No downgrade attacks

Policy: Key Management
├─ Strong key generation
├─ Secure storage in environment variables
├─ Regular rotation schedule
└─ Access control

Policy: Data Retention
├─ Delete after 90 days (retention period)
├─ Archive for compliance (7 years)
└─ Secure deletion with multiple passes
```

### Security Audit Checklist

```
Before Production Deployment:
☐ ENCRYPTION_KEY set in production environment
☐ All existing data migrated and encrypted
☐ Rate limiting configured appropriately
☐ Security headers enabled
☐ HTTPS/TLS configured
☐ Stripe webhook signature verification working
☐ Error handling doesn't expose sensitive data
☐ Logging sanitizes sensitive information
☐ Backup strategy in place
☐ Disaster recovery plan tested
☐ Security headers validated
☐ CORS properly configured
☐ Database backups encrypted
☐ Admin access logs enabled
```

---

## Support & Documentation

### Additional Resources

- **Node.js Crypto**: https://nodejs.org/api/crypto.html
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **NIST Encryption Standards**: https://csrc.nist.gov/publications/detail/sp/800-38d/final
- **Stripe Security**: https://stripe.com/docs/security

### Questions?

For security concerns or questions:
1. Check this documentation first
2. Review the source code in `app/lib/encryption.ts` and `app/lib/security.ts`
3. Contact security team for sensitive issues
4. Never commit sensitive keys to version control

---

**Last Updated**: February 10, 2026  
**Version**: 1.0  
**Status**: ✅ Production Ready
