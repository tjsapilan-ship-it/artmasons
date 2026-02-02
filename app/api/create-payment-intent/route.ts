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

  let amount = 0;
  try {
    for (const it of items) {
      if (!Number.isInteger(it.quantity) || it.quantity <= 0) {
        throw new Error('Invalid quantity');
      }
      const unit = toUnitAmount(it.price);
      if (!Number.isInteger(unit) || unit <= 0) {
        throw new Error('Invalid unit amount');
      }
      amount += unit * it.quantity;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid items';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const customer = body.customer || {};

  try {
    const stripe = getStripe();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      receipt_email: customer.email ? String(customer.email) : undefined,
      metadata: {
        customer_name: customer.name ? String(customer.name) : '',
        customer_phone: customer.phone ? String(customer.phone) : '',
        customer_address: customer.address ? String(customer.address) : '',
        items_count: String(items.length),
      },
    });

    ordersLib.saveOrder({
      sessionId: paymentIntent.id,
      status: 'pending',
      items,
      customer: {
        name: customer.name,
        email: customer.email,
        address: customer.address,
        phone: customer.phone,
      },
      raw: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      },
    });

    return NextResponse.json({ paymentIntentId: paymentIntent.id, clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    console.error('Failed to create payment intent', err);
    const message = err instanceof Error ? err.message : 'Failed to create payment intent';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
