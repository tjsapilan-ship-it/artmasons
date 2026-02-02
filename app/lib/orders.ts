import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

export type OrderItem = {
  title?: string;
  price?: number;
  quantity?: number;
  sku?: string;
  currency?: string;
  size?: string;
  dimensions?: string;
};

export type Customer = {
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
};

export type StoredOrder = {
  sessionId: string;
  status: 'pending' | 'paid' | 'failed';
  createdAt: string;
  invoiceSentAt?: string;
  orderConfirmationSentAt?: string;
  shipmentConfirmationSentAt?: string;
  items: OrderItem[];
  customer?: Customer | Record<string, unknown> | unknown;
  raw?: Record<string, unknown> | unknown;
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, JSON.stringify([]), 'utf8');
}

export function readOrders(): StoredOrder[] {
  try {
    ensureDataDir();
    const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    console.error('Failed to read orders file', e);
    return [];
  }
}

export function writeOrders(orders: StoredOrder[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write orders file', e);
  }
}

export function saveOrder(order: Omit<StoredOrder, 'createdAt'>) {
  const orders = readOrders();
  const entry: StoredOrder = { ...order, createdAt: new Date().toISOString() } as StoredOrder;
  orders.push(entry);
  writeOrders(orders);
  return entry;
}

export function findOrderBySession(sessionId: string) {
  const orders = readOrders();
  return orders.find((o) => o.sessionId === sessionId) || null;
}

export function markOrderPaid(sessionId: string, payload?: unknown) {
  const orders = readOrders();
  const idx = orders.findIndex((o) => o.sessionId === sessionId);
  if (idx >= 0) {
    orders[idx].status = 'paid';
    if (payload) orders[idx].raw = payload;
    writeOrders(orders);
    return orders[idx];
  }
  return null;
}

export function markOrderFailed(sessionId: string, payload?: unknown) {
  const orders = readOrders();
  const idx = orders.findIndex((o) => o.sessionId === sessionId);
  if (idx >= 0) {
    orders[idx].status = 'failed';
    if (payload) orders[idx].raw = payload;
    writeOrders(orders);
    return orders[idx];
  }
  return null;
}

export function markInvoiceSent(sessionId: string, sentAt = new Date().toISOString()) {
  const orders = readOrders();
  const idx = orders.findIndex((o) => o.sessionId === sessionId);
  if (idx >= 0) {
    orders[idx].invoiceSentAt = sentAt;
    writeOrders(orders);
    return orders[idx];
  }
  return null;
}

export function markOrderConfirmationSent(sessionId: string, sentAt = new Date().toISOString()) {
  const orders = readOrders();
  const idx = orders.findIndex((o) => o.sessionId === sessionId);
  if (idx >= 0) {
    orders[idx].orderConfirmationSentAt = sentAt;
    writeOrders(orders);
    return orders[idx];
  }
  return null;
}

export function markShipmentConfirmationSent(sessionId: string, sentAt = new Date().toISOString()) {
  const orders = readOrders();
  const idx = orders.findIndex((o) => o.sessionId === sessionId);
  if (idx >= 0) {
    orders[idx].shipmentConfirmationSentAt = sentAt;
    writeOrders(orders);
    return orders[idx];
  }
  return null;
}

const ordersLib = {
  readOrders,
  writeOrders,
  saveOrder,
  findOrderBySession,
  markOrderPaid,
  markOrderFailed,
  markInvoiceSent,
  markOrderConfirmationSent,
  markShipmentConfirmationSent,
};
export default ordersLib;
