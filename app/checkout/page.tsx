"use client";

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import { ArrowRight, Lock, ShoppingBag } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useRouter } from 'next/navigation';
import StripePaymentModal from './StripePaymentModal';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { addToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '', phone: '' });
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || items.length === 0) {
      addToast('Please provide name, email and at least one cart item', 'error');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        items: items.map((it) => ({ title: it.title, price: it.price, quantity: it.quantity, currency: it.currency || 'aed' })),
        customer: {
          name: form.name,
          email: form.email,
          address: form.address,
          phone: form.phone,
        },
      };

      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to initialize payment');
      if (data.clientSecret && data.paymentIntentId) {
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
        try {
          if (typeof window !== 'undefined' && data.paymentIntentId) {
            window.sessionStorage.setItem('last_payment_intent', data.paymentIntentId);
          }
        } catch {
          // ignore storage failures
        }
        setPaymentModalOpen(true);
        return;
      }
      throw new Error('Missing client secret from server');
    } catch (err: unknown) {
      console.error('Checkout error', err);
      const message = err instanceof Error ? err.message : 'Checkout failed';
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClosePaymentModal = () => {
    setPaymentModalOpen(false);
  };

  const handlePaymentSuccess = () => {
    setPaymentModalOpen(false);
    if (paymentIntentId) {
      router.push(`/checkout/success?payment_intent=${encodeURIComponent(paymentIntentId)}`);
    } else {
      router.push('/checkout/success');
    }
  };

  return (
    <main className={`${playfair.variable} min-h-screen bg-art-texture text-black`}>
      {/* Linen Canvas Background Pattern */}
      <style jsx global>{`
        .bg-art-texture {
          background-color: #fdfbf7;
          background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23800000' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>

      <div className="w-full px-4 py-12 relative z-10">
        <div className="mb-8">
          <Breadcrumbs items={[{ label: 'Checkout', href: '/checkout' }]} />
        </div>

        <header className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#800000]">Checkout</h1>
            <p className="font-serif text-gray-600 mt-2">Secure checkout — your payment is processed by Stripe.</p>
          </div>
          {items.length > 0 && (
            <div className="font-serif text-sm text-gray-600">
              <span className="font-bold text-[#800000] tabular-nums">{items.length}</span>{' '}
              <span>{items.length === 1 ? 'item' : 'items'}</span>
            </div>
          )}
        </header>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white/60 rounded-lg shadow-sm border border-[#800000]/10">
            <div className="inline-block p-6 bg-white rounded-full mb-6 shadow-sm">
              <ShoppingBag size={64} className="text-gray-400" />
            </div>
            <h2 className="font-serif text-3xl font-bold mb-4 text-gray-800">Your Cart is Empty</h2>
            <p className="font-serif text-lg text-gray-600 mb-8">Discover our collection of museum-quality masterpieces</p>
            <Link
              href="/artists-a-z"
              className="inline-flex items-center gap-2 bg-[#800000] text-white px-8 py-4 rounded-lg font-serif font-bold text-lg hover:bg-[#600000] transition-colors cursor-pointer"
            >
              Browse Collection
              <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Details */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 space-y-6 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-gray-800">Customer Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="font-serif text-sm font-semibold text-gray-700 mb-2 block">
                      Full name
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="font-serif text-sm font-semibold text-gray-700 mb-2 block">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="phone" className="font-serif text-sm font-semibold text-gray-700 mb-2 block">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="font-serif text-sm font-semibold text-gray-700 mb-2 block">
                      Shipping address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      autoComplete="shipping street-address"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#800000] text-white px-6 py-4 rounded-lg font-serif font-bold text-lg hover:bg-[#600000] transition-colors disabled:opacity-60 cursor-pointer"
                >
                  <Lock size={20} />
                  {loading ? 'Processing…' : 'Proceed to Payment'}
                </button>

                <p className="font-serif text-sm text-gray-500">
                  Payment will open in a secure Stripe modal.
                </p>
              </form>
            </div>

            {/* Order Summary */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="bg-white/90 border border-gray-200 rounded-lg p-6 shadow-sm backdrop-blur-sm sticky top-6">
                <h2 className="font-serif text-2xl font-bold mb-6 text-gray-800">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  {items.map((it) => (
                    <div key={it.id} className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-serif text-sm font-semibold text-gray-800 truncate">{it.title}</p>
                        <p className="font-serif text-xs text-gray-500">Qty: {it.quantity}</p>
                      </div>
                      <div className="font-serif text-sm font-bold text-[#800000] tabular-nums whitespace-nowrap">
                        AED {(it.price * it.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-300">
                  <div className="flex justify-between items-baseline font-serif">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-semibold tabular-nums">AED {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-baseline font-serif">
                    <span className="text-gray-700">Shipping:</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline font-serif text-xl font-bold">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-[#800000] tabular-nums">AED {subtotal.toLocaleString()}</span>
                </div>

                <div className="pt-6">
                  <Link
                    href="/cart"
                    className="inline-flex items-center gap-2 text-[#800000] hover:underline font-serif font-semibold cursor-pointer"
                  >
                    ← Back to cart
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      <StripePaymentModal
        open={paymentModalOpen}
        clientSecret={clientSecret}
        paymentIntentId={paymentIntentId}
        onClose={handleClosePaymentModal}
        onSuccess={handlePaymentSuccess}
      />
    </main>
  );
}