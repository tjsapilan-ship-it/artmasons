/**
 * Data Migration Script: Encrypt Existing Orders
 * 
 * This script encrypts all existing unencrypted customer data in orders.json
 * Run this once before deploying the encryption system to production
 * 
 * Usage: npx tsx scripts/encrypt-existing-orders.ts
 */

import fs from 'fs';
import path from 'path';
import { encrypt, isEncrypted, sanitizeForLogging } from '../app/lib/encryption';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const BACKUP_FILE = path.join(DATA_DIR, 'orders.backup.json');

interface OrderItem {
  title?: string;
  price?: number;
  quantity?: number;
  sku?: string;
  currency?: string;
  size?: string;
  dimensions?: string;
}

interface StoredOrder {
  sessionId: string;
  status: 'pending' | 'paid' | 'failed';
  createdAt: string;
  invoiceSentAt?: string;
  orderConfirmationSentAt?: string;
  shipmentConfirmationSentAt?: string;
  items: OrderItem[];
  customer?: Record<string, unknown> | string | unknown;
  raw?: Record<string, unknown> | string | unknown;
}

async function migrateOrders() {
  try {
    console.log('🔐 Starting order encryption migration...\n');

    // Check if orders file exists
    if (!fs.existsSync(ORDERS_FILE)) {
      console.log('✅ No orders file found. Migration not needed.');
      return;
    }

    // Read existing orders
    console.log(`📂 Reading orders from: ${ORDERS_FILE}`);
    const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
    const orders: StoredOrder[] = JSON.parse(raw || '[]');

    if (orders.length === 0) {
      console.log('✅ No orders to migrate.');
      return;
    }

    console.log(`📊 Found ${orders.length} order(s) to process.\n`);

    // Create backup
    console.log('💾 Creating backup...');
    fs.copyFileSync(ORDERS_FILE, BACKUP_FILE);
    console.log(`✅ Backup created: ${BACKUP_FILE}\n`);

    // Process each order
    let encryptedCount = 0;
    let skippedCount = 0;

    const updatedOrders = orders.map((order, index) => {
      const updated = { ...order };
      
      // Encrypt customer data if not already encrypted
      if (updated.customer && typeof updated.customer === 'object') {
        console.log(`  [${index + 1}/${orders.length}] Processing order: ${order.sessionId}`);
        console.log(`    Customer: ${sanitizeForLogging(updated.customer)}`);
        
        try {
          updated.customer = encrypt(updated.customer);
          console.log('    ✅ Customer data encrypted');
          encryptedCount++;
        } catch (error) {
          console.error(`    ❌ Failed to encrypt customer data:`, error);
          skippedCount++;
        }
      } else if (updated.customer && typeof updated.customer === 'string' && isEncrypted(updated.customer)) {
        console.log(`  [${index + 1}/${orders.length}] Order already encrypted: ${order.sessionId}`);
        skippedCount++;
      }
      
      // Encrypt raw payment data if present and not already encrypted
      if (updated.raw && typeof updated.raw === 'object') {
        try {
          updated.raw = encrypt(updated.raw);
          console.log('    ✅ Payment data encrypted');
        } catch (error) {
          console.error(`    ❌ Failed to encrypt payment data:`, error);
        }
      } else if (updated.raw && typeof updated.raw === 'string' && isEncrypted(updated.raw as string)) {
        console.log('    (Payment data already encrypted)');
      }
      
      return updated;
    });

    // Write updated orders
    console.log(`\n📝 Writing encrypted orders back to file...`);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(updatedOrders, null, 2), 'utf8');

    console.log(`\n✅ Migration completed!`);
    console.log(`   📊 Orders processed: ${orders.length}`);
    console.log(`   🔒 Orders encrypted: ${encryptedCount}`);
    console.log(`   ⏭️  Orders skipped: ${skippedCount}`);
    console.log(`   💾 Backup location: ${BACKUP_FILE}`);
    console.log(`\n⚠️  IMPORTANT:`);
    console.log('   1. Make sure ENCRYPTION_KEY environment variable is set');
    console.log('   2. Keep the backup file in a safe place');
    console.log('   3. Test the application with encrypted data before deploying');
    console.log('   4. Delete the backup file after confirming everything works\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateOrders().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
