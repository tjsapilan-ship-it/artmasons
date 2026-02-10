import { NextRequest, NextResponse } from 'next/server';
import { sendQuoteRequest } from '../../lib/mailer';
import { sanitizeInput, isValidEmail, isValidPhone, getClientIP, isRateLimited, withSecurityHeaders } from '../../lib/security';
import { encrypt, sanitizeForLogging } from '../../lib/encryption';

// Basic email validation
function isValidEmailLocal(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Basic phone validation (allows various formats)
function isValidPhoneLocal(phone: string): boolean {
    // Remove common separators and spaces
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    // Check if it's between 7 and 15 digits (international range)
    return /^\+?\d{7,15}$/.test(cleaned);
}

// Validate custom size input
function isValidSize(size: string): boolean {
    const num = parseFloat(size);
    return !isNaN(num) && num > 0 && num < 10000; // reasonable range in cm
}

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const clientIP = getClientIP(request);
        if (isRateLimited(clientIP, 10, 60000)) { // 10 requests per minute for quotes
            return withSecurityHeaders(
                NextResponse.json(
                    { success: false, message: 'Too many requests. Please try again later.' },
                    { status: 429 }
                )
            );
        }

        const body = await request.json();

        // Validate required fields
        const { customerName, email, phone } = body;

        if (!customerName || typeof customerName !== 'string' || customerName.trim().length === 0) {
            return withSecurityHeaders(
                NextResponse.json(
                    { success: false, message: 'Customer name is required' },
                    { status: 400 }
                )
            );
        }

        if (!email || typeof email !== 'string' || !isValidEmailLocal(email)) {
            return withSecurityHeaders(
                NextResponse.json(
                    { success: false, message: 'Valid email address is required' },
                    { status: 400 }
                )
            );
        }

        if (!phone || typeof phone !== 'string' || !isValidPhoneLocal(phone)) {
            return withSecurityHeaders(
                NextResponse.json(
                    { success: false, message: 'Valid phone number is required' },
                    { status: 400 }
                )
            );
        }

        // Validate custom size if provided
        const { customWidth, customHeight } = body;
        if (customWidth && !isValidSize(customWidth)) {
            return withSecurityHeaders(
                NextResponse.json(
                    { success: false, message: 'Invalid custom width value' },
                    { status: 400 }
                )
            );
        }

        if (customHeight && !isValidSize(customHeight)) {
            return withSecurityHeaders(
                NextResponse.json(
                    { success: false, message: 'Invalid custom height value' },
                    { status: 400 }
                )
            );
        }

        // Validate quantity if provided
        const quantity = body.quantity ? parseInt(body.quantity) : undefined;
        if (quantity !== undefined && (isNaN(quantity) || quantity < 1 || quantity > 1000)) {
            return withSecurityHeaders(
                NextResponse.json(
                    { success: false, message: 'Invalid quantity value' },
                    { status: 400 }
                )
            );
        }

        // Sanitize and prepare quote request data
        const quoteRequest = {
            customerName: sanitizeInput(customerName.trim()),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            artworkTitle: body.artworkTitle ? sanitizeInput(body.artworkTitle.trim()) : undefined,
            artworkArtist: body.artworkArtist ? sanitizeInput(body.artworkArtist.trim()) : undefined,
            customWidth: customWidth?.trim() || undefined,
            customHeight: customHeight?.trim() || undefined,
            framePreference: body.framePreference ? sanitizeInput(body.framePreference.trim()) : undefined,
            quantity,
            additionalNotes: body.additionalNotes ? sanitizeInput(body.additionalNotes.trim()) : undefined,
            requestedAt: new Date().toISOString(),
            ipAddress: clientIP, // Track for audit purposes
        };

        // Log sanitized request (without sensitive data)
        console.log('Quote request received:', sanitizeForLogging(quoteRequest));

        // Send the quote request email
        try {
            await sendQuoteRequest(quoteRequest);

            return withSecurityHeaders(
                NextResponse.json(
                    {
                        success: true,
                        message: 'Quote request sent successfully. We will contact you shortly!'
                    },
                    { status: 200 }
                )
            );
        } catch (emailError) {
            console.error('Failed to send quote request email:', emailError);

            // Don't expose internal error details to the client
            return withSecurityHeaders(
                NextResponse.json(
                    {
                        success: false,
                        message: 'Failed to send quote request. Please try again or contact us directly at info@artmasons.com'
                    },
                    { status: 500 }
                )
            );
        }
    } catch (error) {
        console.error('Quote request error:', error);

        // Handle JSON parsing errors or other unexpected errors
        const message = error instanceof SyntaxError
            ? 'Invalid request format'
            : 'An unexpected error occurred. Please try again later.';

        return withSecurityHeaders(
            NextResponse.json(
                { success: false, message },
                { status: 500 }
            )
        );
    }
}
