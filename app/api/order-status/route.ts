import { NextResponse } from 'next/server';
import ordersLib from '../../lib/orders';
import { getStripe } from '../../lib/stripe';
import { sendOrderConfirmation, sendOrderInvoice } from '../../lib/mailer';
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

function getRecipientFromOrder(order: StoredOrder): string | null {
  const email = readString(order.customer, 'email') || readString(order.raw, 'receipt_email');
  return email || null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');
  const paymentIntentId = searchParams.get('payment_intent');

  const id = paymentIntentId || sessionId;

  if (!id) {
    return NextResponse.json({ error: 'Missing session_id or payment_intent' }, { status: 400 });
  }

  const order = ordersLib.findOrderBySession(id);
  if (!order) {
    return NextResponse.json({ status: 'not_found' }, { status: 404 });
  }

  // If already paid but invoice hasn't been sent (e.g. SMTP was configured later), try once here.
  if (order.status === 'paid') {
    const recipient = getRecipientFromOrder(order);
    if (recipient) {
      if (!order.orderConfirmationSentAt) {
        try {
          await sendOrderConfirmation(order, recipient);
          ordersLib.markOrderConfirmationSent(id);
        } catch (e) {
          console.error('Failed to send order confirmation email for already-paid order', e);
        }
      }
      if (!order.invoiceSentAt) {
        try {
          await sendOrderInvoice(order, recipient);
          ordersLib.markInvoiceSent(id);
        } catch (e) {
          console.error('Failed to send invoice email for already-paid order', e);
        }
      }
    }
  }

  // If pending, opportunistically confirm with Stripe to reduce reliance on webhooks during dev.
  if (order.status === 'pending') {
    try {
      const stripe = getStripe();

      // Support both Stripe Checkout Sessions (cs_*) and PaymentIntents (pi_*).
      if (id.startsWith('pi_')) {
        const pi = await stripe.paymentIntents.retrieve(id);
        if (pi.status === 'succeeded') {
          const updated = ordersLib.markOrderPaid(id, {
            id: pi.id,
            status: pi.status,
            amount: pi.amount,
            currency: pi.currency,
          });

          // Opportunistically send invoice on first successful verification (dev-friendly).
          if (updated && !updated.invoiceSentAt) {
            const recipient = readString(updated.customer, 'email') || pi.receipt_email || readString(updated.raw, 'receipt_email') || null;
            if (recipient) {
              try {
                if (!updated.orderConfirmationSentAt) {
                  await sendOrderConfirmation(updated, recipient);
                  ordersLib.markOrderConfirmationSent(id);
                }
                await sendOrderInvoice(updated, recipient);
                ordersLib.markInvoiceSent(id);
              } catch (e) {
                console.error('Failed to send invoice email from order-status route', e);
              }
            }
          }

          return NextResponse.json({ status: updated?.status || 'paid' });
        }
        if (pi.status === 'canceled') {
          return NextResponse.json({ status: 'failed' });
        }
      } else {
        const session = await stripe.checkout.sessions.retrieve(id);

        if (session.payment_status === 'paid' || session.payment_status === 'no_payment_required') {
          const updated = ordersLib.markOrderPaid(id, {
            id: session.id,
            payment_status: session.payment_status,
            status: session.status,
            amount_total: session.amount_total,
            currency: session.currency,
          });

          if (updated && !updated.invoiceSentAt) {
            const recipient =
              readString(updated.customer, 'email') ||
              (session.customer_details && session.customer_details.email) ||
              readString(updated.raw, 'receipt_email') ||
              null;
            if (recipient) {
              try {
                if (!updated.orderConfirmationSentAt) {
                  await sendOrderConfirmation(updated, recipient);
                  ordersLib.markOrderConfirmationSent(id);
                }
                await sendOrderInvoice(updated, recipient);
                ordersLib.markInvoiceSent(id);
              } catch (e) {
                console.error('Failed to send invoice email from order-status route', e);
              }
            }
          }

          return NextResponse.json({ status: updated?.status || 'paid' });
        }

        if (session.status === 'expired') {
          // Keep it simple: report failed but don't mutate if you prefer.
          return NextResponse.json({ status: 'failed' });
        }
      }
    } catch {
      // If Stripe isn't configured, fall back to local file.
    }
  }

  return NextResponse.json({ status: order.status });
}
