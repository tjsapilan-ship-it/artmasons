import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Security middleware for Next.js
 * Adds security headers and rate limiting
 */

// Simple in-memory rate limiter (consider Redis for production with multiple instances)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10); // 1 minute

/**
 * Rate limiting function
 * @param identifier - Unique identifier (IP address or user ID)
 * @param max - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if rate limit exceeded
 */
export function isRateLimited(identifier: string, max = RATE_LIMIT_MAX, windowMs = RATE_LIMIT_WINDOW): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    // Create new record or reset
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  // Increment count
  record.count++;

  if (record.count > max) {
    return true;
  }

  return false;
}

/**
 * Get client IP address from request
 * @param request - Next.js request object
 * @returns IP address string
 */
export function getClientIP(request: NextRequest): string {
  // Try various headers for IP (considering proxies, load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp.trim();
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  
  return 'unknown';
}

/**
 * Security headers to add to all responses
 */
export function getSecurityHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    // Prevent clickjacking
    'X-Frame-Options': 'SAMEORIGIN',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Enable XSS protection (legacy, but still good)
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions policy
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };

  // Add HSTS in production
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_HSTS === 'true') {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
  }

  // Content Security Policy (customize based on your needs)
  if (process.env.ENABLE_CSP === 'true') {
    headers['Content-Security-Policy'] = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.stripe.com",
      "frame-src 'self' https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join('; ');
  }

  return headers;
}

/**
 * Apply security headers to a response
 * @param response - Next.js response object
 * @returns Response with security headers
 */
export function withSecurityHeaders(response: NextResponse): NextResponse {
  const headers = getSecurityHeaders();
  
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

/**
 * Sanitize user input to prevent XSS
 * @param input - User input string
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns true if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 * @param phone - Phone number to validate
 * @returns true if valid phone format
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  return /^\+?\d{7,15}$/.test(cleaned);
}

/**
 * Check if request is from a whitelisted origin
 * @param request - Next.js request object
 * @returns true if origin is whitelisted
 */
export function isWhitelistedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  const whitelist = [
    siteUrl,
    'http://localhost:3000',
    'http://localhost:3001',
    'https://artmasons.com',
    'https://www.artmasons.com',
  ];
  
  return origin ? whitelist.includes(origin) : true;
}

/**
 * Middleware for API routes with security checks
 * @param handler - The API route handler
 * @returns Wrapped handler with security checks
 */
export function withSecurity(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Check rate limit
    const clientIP = getClientIP(req);
    if (isRateLimited(clientIP)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      );
    }
    
    // Check origin for POST requests
    if (req.method === 'POST' && !isWhitelistedOrigin(req)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid origin' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Execute the handler
    const response = await handler(req);
    
    // Add security headers
    return withSecurityHeaders(response);
  };
}

const security = {
  isRateLimited,
  getClientIP,
  getSecurityHeaders,
  withSecurityHeaders,
  sanitizeInput,
  isValidEmail,
  isValidPhone,
  isWhitelistedOrigin,
  withSecurity,
};

export default security;
