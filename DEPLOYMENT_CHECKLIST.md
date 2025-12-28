# Deployment Checklist

## Pre-Deployment Steps

### 1. Environment Variables
Ensure all required environment variables are set in your deployment platform:

#### Required for Core Functionality:
- ✅ `STRIPE_SECRET_KEY` - Your Stripe secret key
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- ✅ `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- ✅ `SMTP_HOST` - SMTP server hostname
- ✅ `SMTP_PORT` - SMTP server port (usually 587)
- ✅ `SMTP_USER` - SMTP username
- ✅ `SMTP_PASS` - SMTP password
- ✅ `MAIL_FROM` - Email address to send from
- ✅ `NODE_ENV` - Set to `production`

#### Optional (Firebase - Currently Disabled):
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

### 2. Stripe Configuration
1. Set up your Stripe account in production mode
2. Configure webhook endpoint: `https://yourdomain.com/api/stripe-webhook`
3. Subscribe to these events:
   - `checkout.session.completed`
   - `checkout.session.async_payment_failed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 3. SMTP Email Configuration
1. Set up your SMTP service (Gmail, SendGrid, AWS SES, etc.)
2. Configure SMTP credentials in environment variables
3. Test email sending functionality

### 4. Build Test
Run a production build locally to catch any issues:
```bash
npm run build
npm run start
```

### 5. Code Quality
- ✅ No TypeScript errors
- ✅ All ESLint issues resolved
- ✅ Console logs reviewed (production logs in place)
- ✅ Error boundaries implemented
- ✅ 404 and error pages created

## Deployment Platforms

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms (Netlify, AWS, etc.)
1. Ensure Node.js version is 18.x or higher
2. Build command: `npm run build`
3. Output directory: `.next`
4. Set all environment variables in platform dashboard

## Post-Deployment Verification

### 1. Test Core Functionality
- [ ] Homepage loads correctly
- [ ] Artwork pages display properly
- [ ] Cart functionality works
- [ ] Checkout process completes
- [ ] Stripe payment processing works
- [ ] Order confirmation emails are sent
- [ ] 404 page displays correctly

### 2. Test API Endpoints
- [ ] `/api/create-checkout-session` - Creates checkout sessions
- [ ] `/api/stripe-webhook` - Receives Stripe events
- [ ] `/api/order-status` - Returns order status
- [ ] `/api/send-invoice` - Sends invoice emails

### 3. Performance Check
- [ ] Page load times are acceptable
- [ ] Images load properly
- [ ] Mobile responsiveness verified
- [ ] Browser console has no errors

### 4. SEO Verification
- [ ] `robots.txt` is accessible
- [ ] Meta tags are present on all pages
- [ ] Open Graph images configured
- [ ] Sitemap available (if implemented)

## Security Checklist
- ✅ All API routes use proper authentication
- ✅ Environment variables are not exposed to client
- ✅ Security headers configured in next.config.ts
- ✅ Stripe webhook signature verification enabled
- ✅ CORS properly configured
- ✅ No sensitive data in console logs

## Monitoring & Maintenance
- Set up error monitoring (Sentry, LogRocket, etc.)
- Monitor Stripe dashboard for payment issues
- Check email delivery rates
- Monitor server logs for errors
- Set up uptime monitoring

## Known Limitations
1. Firebase functionality is currently disabled
2. Admin panel requires Firebase re-enablement
3. Orders are stored in local JSON file (not scalable for high volume)
4. No automated backup system for orders.json

## Rollback Plan
If issues occur:
1. Revert to previous deployment in platform dashboard
2. Check environment variables are correct
3. Review deployment logs for errors
4. Test in staging environment before redeploying

## Support Contacts
- Stripe Support: https://support.stripe.com
- Next.js Documentation: https://nextjs.org/docs
- Vercel Support: https://vercel.com/support

---

**Last Updated:** December 28, 2025
**Version:** 1.0.0
