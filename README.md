# Art Masons - Museum-Quality Oil Painting Reproductions

A Next.js e-commerce platform for hand-painted art reproductions with integrated Stripe payments and email functionality.

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Stripe account (for payments)
- SMTP server (for emails)

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
├── app/                    # Next.js app directory
│   ├── api/               # API routes (Stripe, email, orders)
│   ├── components/        # Reusable React components
│   ├── context/           # React context providers
│   ├── lib/               # Utility functions and helpers
│   ├── artworks/          # Dynamic artwork pages
│   ├── checkout/          # Checkout and payment flow
│   └── ...                # Other routes
├── data/                  # Static data files
│   └── artworks.ts        # Artwork catalog (5600+ artworks)
├── public/                # Static assets
│   ├── image/             # Artwork images (670+ images)
│   └── robots.txt         # SEO configuration
├── scripts/               # Data processing scripts
└── ...config files
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Stripe (Required)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SMTP Email (Required)
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

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code quality checks

## 🎨 Features

- **5600+ Artworks** - Comprehensive catalog of famous paintings
- **Secure Payments** - Stripe integration with webhook support
- **Email Invoices** - Automated order confirmation emails with PDF invoices
- **Responsive Design** - Mobile-first, optimized for all devices
- **Shopping Cart** - Persistent cart with localStorage
- **Dynamic Routing** - Artist pages, artwork details, categories
- **Error Handling** - Global error boundaries and custom error pages
- **SEO Optimized** - Meta tags, robots.txt, sitemap ready
- **Security Headers** - XSS protection, content security policy

## 📦 Deployment

### Recommended: Vercel

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy automatically

### Alternative Platforms

For other platforms (Netlify, AWS, etc.):
- Build command: `npm run build`
- Output directory: `.next`
- Node.js version: 18.x or higher

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for detailed deployment instructions.

## 🔒 Security

- Stripe webhook signature verification
- Environment variable validation
- XSS and CSRF protection headers
- No sensitive data in client bundles
- Secure session handling

## 📧 Email Configuration

The application sends order confirmation emails with PDF invoices. Configure your SMTP settings:

1. Use a reliable SMTP service (Gmail, SendGrid, AWS SES)
2. Set SMTP credentials in environment variables
3. Test email delivery before production deployment

## 🐛 Known Issues & Limitations

1. **Firebase Disabled**: Authentication and Firestore features are currently commented out
2. **Local Orders Storage**: Orders stored in `data/orders.json` (not scalable for high volume)
3. **Admin Panel**: Requires Firebase re-enablement
4. **No Database**: Consider adding PostgreSQL/MongoDB for production

See [FIREBASE_REMOVAL_SUMMARY.md](FIREBASE_REMOVAL_SUMMARY.md) for details on re-enabling Firebase.

## 🤝 Contributing

This is a private project. For issues or questions, contact the development team.

## 📄 License

All rights reserved - Art Masons

## 🆘 Support

For technical issues:
- Check [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- Review environment variables
- Check server logs
- Verify Stripe webhook configuration

---

**Version:** 1.0.0  
**Last Updated:** December 28, 2025  
**Framework:** Next.js 16.0.10 with Turbopack

```
STRIPE_SECRET_KEY=sk_test_...
```

- Start dev server:

```bash
npm run dev
```

- Add items to the cart and use the Checkout page. The app will call the API to create a Checkout Session and redirect you to Stripe's hosted test checkout.

Note: This is a minimal integration for testing purposes. For production, follow Stripe's security and webhook guidance.

### Webhook (optional)

To receive server-side confirmation of payment and fulfill orders, set up a webhook endpoint and configure the `STRIPE_WEBHOOK_SECRET` environment variable. Example endpoint in this repo: `/api/stripe-webhook`.

```
STRIPE_WEBHOOK_SECRET=whsec_...
```

When running locally you can use `stripe listen --forward-to localhost:3000/api/stripe-webhook` to forward test events to your local dev server.
