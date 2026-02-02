import { NextResponse } from 'next/server';
import ordersLib from '../../lib/orders';
import { getStripe } from '../../lib/stripe';

export const runtime = 'nodejs';

type CheckoutItem = {
  title: string;
  price: number;
  quantity: number;
  sku?: string;
  currency?: string;
  size?: string;
  dimensions?: string;
};

type CheckoutRequestBody = {
  items: CheckoutItem[];
  customer?: {
    name?: string;
    email?: string;
    address?: string;
    phone?: string;
  };
};

function getBaseUrl(req: Request): string {
  const origin = req.headers.get('origin');
  if (origin) return origin;
  const host = req.headers.get('host');
  if (host) return `https://${host}`;
  return 'http://localhost:3000';
}

function toUnitAmount(priceMajor: number): number {
  if (!Number.isFinite(priceMajor) || priceMajor <= 0) return 0;
  return Math.round(priceMajor * 100);
}

export async function POST(req: Request) {
  let body: CheckoutRequestBody;
  try {
    body = (await req.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body?.items?.length) {
    return NextResponse.json({ error: 'No items provided' }, { status: 400 });
  }

  const stripe = getStripe();
  const baseUrl = getBaseUrl(req);

  const items = body.items
    .map((it) => ({
      title: String(it.title || '').trim(),
      price: Number(it.price),
      quantity: Number(it.quantity),
      sku: it.sku ? String(it.sku) : undefined,
      currency: (it.currency || 'aed').toLowerCase(),
      size: it.size ? String(it.size) : undefined,
      dimensions: it.dimensions ? String(it.dimensions) : undefined,
    }))
    .filter((it) => it.title && Number.isFinite(it.price) && Number.isFinite(it.quantity));

  if (items.length === 0) {
    return NextResponse.json({ error: 'Invalid items' }, { status: 400 });
  }

  const currency = items[0].currency;
  if (!/^[a-z]{3}$/.test(currency)) {
    return NextResponse.json({ error: 'Invalid currency' }, { status: 400 });
  }
  if (items.some((it) => it.currency !== currency)) {
    return NextResponse.json({ error: 'All items must have the same currency' }, { status: 400 });
  }

  const line_items = items.map((it) => {
    const unit_amount = toUnitAmount(it.price);
    if (!Number.isInteger(it.quantity) || it.quantity <= 0) {
      throw new Error('Invalid quantity');
    }
    if (!Number.isInteger(unit_amount) || unit_amount <= 0) {
      throw new Error('Invalid unit amount');
    }

    return {
      quantity: it.quantity,
      price_data: {
        currency,
        unit_amount,
        product_data: {
          name: it.title,
          metadata: it.sku ? { sku: it.sku } : undefined,
        },
      },
    };
  });

  const customer = body.customer || {};

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      customer_email: customer.email ? String(customer.email) : undefined,
      metadata: {
        customer_name: customer.name ? String(customer.name) : '',
        customer_phone: customer.phone ? String(customer.phone) : '',
        customer_address: customer.address ? String(customer.address) : '',
      },
    });

    ordersLib.saveOrder({
      sessionId: session.id,
      status: 'pending',
      items,
      customer: {
        name: customer.name,
        email: customer.email,
        address: customer.address,
        phone: customer.phone,
      },
      raw: {
        id: session.id,
        payment_status: session.payment_status,
        url: session.url,
      },
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: unknown) {
    console.error('Failed to create checkout session', err);
    const message = err instanceof Error ? err.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
