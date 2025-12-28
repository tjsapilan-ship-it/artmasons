import Stripe from 'stripe';

const STRIPE_API_VERSION = '2025-01-27.acacia' as Stripe.LatestApiVersion;

let stripeSingleton: Stripe | null = null;

export function getStripe(): Stripe {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }

  if (!stripeSingleton) {
    stripeSingleton = new Stripe(stripeSecretKey, {
      apiVersion: STRIPE_API_VERSION,
    });
  }

  return stripeSingleton;
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}
