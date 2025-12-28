import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import ordersLib from '../../lib/orders';
import { sendOrderInvoice } from '../../lib/mailer';
// import { firestore } from '../../lib/firebaseAdmin';
import type { StoredOrder } from '../../lib/orders';

export const runtime = 'nodejs';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readString(source: unknown, key: string): string | undefined {
  if (!isRecord(source)) return undefined;
  const value = source[key];
  return typeof value === 'string' ? value : undefined;
}

function recipientFromOrder(order: StoredOrder): string | null {
  return readString(order.customer, 'email') || readString(order.raw, 'receipt_email') || null;
}

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion }) : null;

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured (STRIPE_SECRET_KEY)' }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  if (!webhookSecret) {
    // Only allow unverified events in development.
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Stripe webhook not configured (STRIPE_WEBHOOK_SECRET)' }, { status: 500 });
    }

    const evt = JSON.parse(body);
    console.warn('Received stripe event WITHOUT verification (development only):', evt.type || evt);
    return NextResponse.json({ received: true });
  }

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log('Verified Stripe webhook event:', event.type);

    // Handle events of interest (expand as needed)
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Checkout session completed:', event.data.object);
        // Mark order paid if we have a saved record (Firebase/Firestore temporarily disabled)
        try {
          const sessionObj = event.data.object as Stripe.Checkout.Session;
          const sessionId = sessionObj.id;
          const result = await ordersLib.markOrderPaid(sessionId, sessionObj);
          console.log('Local order mark result', result);
          if (result && !result.invoiceSentAt) {
            try {
              const recipient =
                recipientFromOrder(result) ||
                (sessionObj.customer_details && sessionObj.customer_details.email) ||
                null;
              if (recipient) {
                await sendOrderInvoice(result, recipient);
                ordersLib.markInvoiceSent(sessionId);
                console.log('Sent invoice email for', sessionId, 'to', recipient);
              } else {
                console.log('No recipient email available for order', sessionId);
              }
            } catch (e) {
              console.error('Failed to send invoice email for session', sessionId, e);
            }
          }
        } catch (e) {
          console.error('Failed to mark order paid', e);
        }
        break;
      case 'payment_intent.succeeded':
        console.log('Payment intent succeeded:', event.data.object);
        try {
          const pi = event.data.object as Stripe.PaymentIntent;
          const result = await ordersLib.markOrderPaid(pi.id, pi);
          console.log('Local order mark result', result);
          if (result && !result.invoiceSentAt) {
            try {
              const recipient =
                recipientFromOrder(result) ||
                pi.receipt_email ||
                null;
              if (recipient) {
                await sendOrderInvoice(result, recipient);
                ordersLib.markInvoiceSent(pi.id);
                console.log('Sent invoice email for', pi.id, 'to', recipient);
              } else {
                console.log('No recipient email available for order', pi.id);
              }
            } catch (e) {
              console.error('Failed to send invoice email for payment intent', pi.id, e);
            }
          }
        } catch (e) {
          console.error('Failed to mark order paid', e);
        }
        break;
      case 'checkout.session.async_payment_failed':
        try {
          const sessionObj = event.data.object as Stripe.Checkout.Session;
          const sessionId = sessionObj.id;
          const result = await ordersLib.markOrderFailed(sessionId, sessionObj);
          console.log('Local order mark failed result', result);
        } catch (e) {
          console.error('Failed to mark order failed', e);
        }
        break;
      case 'payment_intent.payment_failed':
      case 'payment_intent.canceled':
        try {
          const pi = event.data.object as Stripe.PaymentIntent;
          const result = await ordersLib.markOrderFailed(pi.id, pi);
          console.log('Local order mark failed result', result);
        } catch (e) {
          console.error('Failed to mark order failed', e);
        }
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed.', message);
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }
}
