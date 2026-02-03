# Art Masons - Museum-Quality Oil Painting Reproductions

A Next.js 16 App Router e-commerce platform for hand-painted art reproductions with Stripe payments, SMTP email automation, and PDF invoicing.

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Stripe account (payments)
- SMTP server (transactional emails)

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure your environment variables in .env.local
# See .env.example for required variables

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
artmasons/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (Stripe, email, orders)
│   ├── components/        # Reusable UI components
│   ├── context/           # Cart + toast providers
│   ├── lib/               # Stripe, mailer, orders helpers
│   ├── artworks/          # Dynamic artwork pages
│   ├── checkout/          # Checkout + Stripe Elements modal
│   └── ...                # Other routes
├── data/                  # Static data + local order storage
│   ├── artworks.ts        # Artwork catalog (5600+ artworks)
│   └── orders.json        # Local order persistence
├── public/                # Static assets and images
├── scripts/               # Data + image processing scripts
└── ...config files
```

## 🔧 Configuration

### Environment Variables

Create a .env.local file with the following variables:

```env
# Stripe (Required)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Webhooks (Recommended)
STRIPE_WEBHOOK_SECRET=whsec_...

# SMTP Email (Required for order emails)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
MAIL_FROM=noreply@artmasons.com

# Environment
NODE_ENV=production
```

See [.env.example](.env.example) for complete configuration options.

## 🛠️ Available Scripts

- npm run dev - Start development server
- npm run build - Create production build
- npm run start - Start production server
- npm run lint - Run ESLint checks
- npm run parse:popular - Parse popular art data from PDF
- npm run convert:images - Convert images to WebP
- npm run scan:images - Scan for missing image references
- npm run update:image-refs - Update image references after conversion

## 🎨 Features

- 5600+ artworks with artist and category routes
- Stripe Payment Intents with embedded Stripe Elements modal checkout
- Order status verification endpoint with Stripe fallbacks for dev
- Automated order confirmation and PDF invoice emails
- Shipment confirmation emails
- Quote request workflow for custom sizing
- Persistent cart with localStorage
- SEO-ready routes, sitemap, and robots.txt
- Security headers and image optimization settings

## 📦 Deployment

### Recommended: Vercel

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy automatically

### Alternative Platforms

For other platforms (Netlify, AWS, etc.):
- Build command: npm run build
- Output directory: .next
- Node.js version: 18.x or higher

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for detailed deployment instructions.

## 🔒 Security

- Stripe webhook signature verification
- Environment variable validation
- XSS and CSRF protection headers
- No sensitive data in client bundles
- Secure session handling

## 📧 Email Configuration

The application sends order confirmation, invoice, and shipment emails with a PDF invoice attachment. Configure your SMTP settings:

1. Use a reliable SMTP service (Gmail, SendGrid, AWS SES)
2. Set SMTP credentials in environment variables
3. Test email delivery before production deployment

## 🐛 Known Issues & Limitations

1. Firebase authentication and Firestore are currently disabled
2. Orders are stored locally in data/orders.json (not scalable)
3. No database configured for production scale

See [FIREBASE_REMOVAL_SUMMARY.md](FIREBASE_REMOVAL_SUMMARY.md) for details on re-enabling Firebase.

## 🤝 Contributing

This is a private project. For issues or questions, contact the development team.

## 📄 License

All rights reserved - Art Masons

## 💳 Payments & Order Flow

- Checkout uses Stripe Payment Intents and a Stripe Elements modal.
- Orders are saved locally and updated via webhooks or the order-status endpoint.
- Webhooks are recommended for reliable fulfillment in production.

Webhook endpoint: /api/stripe-webhook
Order status endpoint: /api/order-status

Optional legacy endpoint: /api/create-checkout-session

## 🆘 Support

For technical issues:
- Check [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- Review environment variables
- Check server logs
- Verify Stripe webhook configuration

---

**Version:** 1.0.0  
**Last Updated:** February 4, 2026  
**Framework:** Next.js 16.0.10 with React 19 and Tailwind CSS 4
