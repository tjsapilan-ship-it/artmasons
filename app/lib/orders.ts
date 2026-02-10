import fs from 'fs';
import path from 'path';
import { encrypt, decrypt, encryptFields, decryptFields, isEncrypted } from './encryption';

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

/**
 * Encrypt sensitive customer data before storage
 * @param order - The order to encrypt
 * @returns Order with encrypted customer data
 */
function encryptOrderData(order: StoredOrder): StoredOrder {
  const encrypted = { ...order };
  
  // Encrypt customer information if present
  if (encrypted.customer && typeof encrypted.customer === 'object') {
    encrypted.customer = encrypt(encrypted.customer);
  }
  
  // Encrypt raw payment data if present (may contain sensitive info)
  if (encrypted.raw && typeof encrypted.raw === 'object') {
    encrypted.raw = encrypt(encrypted.raw);
  }
  
  return encrypted;
}

/**
 * Decrypt sensitive customer data after reading
 * @param order - The order to decrypt
 * @returns Order with decrypted customer data
 */
function decryptOrderData(order: StoredOrder): StoredOrder {
  const decrypted = { ...order };
  
  try {
    // Decrypt customer information if present and encrypted
    if (decrypted.customer && typeof decrypted.customer === 'string' && isEncrypted(decrypted.customer)) {
      decrypted.customer = decrypt(decrypted.customer, true);
    }
    
    // Decrypt raw payment data if present and encrypted
    if (decrypted.raw && typeof decrypted.raw === 'string' && isEncrypted(decrypted.raw as string)) {
      decrypted.raw = decrypt(decrypted.raw as string, true);
    }
  } catch (error) {
    console.error('Error decrypting order data:', error);
    // Return as-is if decryption fails (might be legacy unencrypted data)
  }
  
  return decrypted;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, JSON.stringify([]), 'utf8');
}

export function readOrders(): StoredOrder[] {
  try {
    ensureDataDir();
    const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
    const orders = JSON.parse(raw || '[]');
    
    // Decrypt all orders when reading
    return orders.map((order: StoredOrder) => decryptOrderData(order));
  } catch (e) {
    console.error('Failed to read orders file', e);
    return [];
  }
}

export function writeOrders(orders: StoredOrder[]) {
  try {
    ensureDataDir();
    
    // Encrypt all orders before writing
    const encryptedOrders = orders.map(order => encryptOrderData(order));
    
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(encryptedOrders, null, 2), 'utf8');
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
