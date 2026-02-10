import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Path to newsletter subscribers file
const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'newsletter-subscribers.json');

// Ensure data directory exists
function ensureDataDirectory() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

// Load existing subscribers
function loadSubscribers(): Array<{ email: string; subscribedAt: string }> {
    ensureDataDirectory();
    if (!fs.existsSync(SUBSCRIBERS_FILE)) {
        return [];
    }
    try {
        const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// Save subscribers
function saveSubscribers(subscribers: Array<{ email: string; subscribedAt: string }>) {
    ensureDataDirectory();
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), 'utf-8');
}

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        // Validate email
        if (!email || !EMAIL_REGEX.test(email)) {
            return NextResponse.json(
                { error: 'Please provide a valid email address.' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Load existing subscribers
        const subscribers = loadSubscribers();

        // Check if already subscribed
        const alreadySubscribed = subscribers.some(
            (sub) => sub.email.toLowerCase() === normalizedEmail
        );

        if (alreadySubscribed) {
            return NextResponse.json(
                { message: 'You are already subscribed to our newsletter!' },
                { status: 200 }
            );
        }

        // Add new subscriber
        const newSubscriber = {
            email: normalizedEmail,
            subscribedAt: new Date().toISOString(),
        };

        subscribers.push(newSubscriber);
        saveSubscribers(subscribers);

        // Send notification email to info@artmasons.com
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: process.env.SMTP_FROM || 'noreply@artmasons.com',
                to: 'info@artmasons.com',
                subject: 'New Newsletter Subscription',
                html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
            <h2 style="color: #800000;">New Newsletter Subscriber</h2>
            <p>A new user has subscribed to the Art Masons newsletter:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #800000; margin: 20px 0;">
              <strong>Email:</strong> ${normalizedEmail}<br>
              <strong>Subscribed At:</strong> ${new Date(newSubscriber.subscribedAt).toLocaleString()}
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              This is an automated notification from the Art Masons website.
            </p>
          </div>
        `,
            });
        } catch (emailError) {
            console.error('Failed to send notification email:', emailError);
            // Don't fail the subscription if email fails
        }

        return NextResponse.json(
            { message: 'Thank you for subscribing! You will receive our latest updates and special offers.' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return NextResponse.json(
            { error: 'An error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}
