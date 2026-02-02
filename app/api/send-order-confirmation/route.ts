import { NextResponse } from 'next/server';
import ordersLib from '../../lib/orders';
import { sendOrderConfirmation } from '../../lib/mailer';
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

function getRecipient(order: StoredOrder, to?: unknown): string | null {
  if (typeof to === 'string' && to.trim()) return to.trim();
  return readString(order.customer, 'email') || readString(order.raw, 'receipt_email') || null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sessionId = body?.sessionId;
    const to = body?.to;
    if (!sessionId) return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });

    const order = ordersLib.findOrderBySession(sessionId);
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const recipient = getRecipient(order, to);
    if (!recipient) return NextResponse.json({ error: 'No recipient email available' }, { status: 400 });

    await sendOrderConfirmation(order, recipient);

    try {
      ordersLib.markOrderConfirmationSent(sessionId);
    } catch {
      // ignore
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error('Failed to send order confirmation', err);
    const message = err instanceof Error ? err.message : 'Failed to send order confirmation';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
