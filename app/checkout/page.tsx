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

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap', preload: false });

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { addToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'home' | 'local'>('home');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  // Calculate tax (5%) and total
  const taxRate = 0.05;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // 13) Customer Details
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
  });

  // Home Delivery Fields
  const [homeDelivery, setHomeDelivery] = useState({
    country: '',
    city: '',
    road: '',
    buildingName: '',
    apartmentVilla: '',
    area: '',
    postalCode: '',
  });

  // 14) Local Framer Delivery Fields
  const [framerDelivery, setFramerDelivery] = useState({
    companyName: '',
    contactFirstName: '',
    contactLastName: '',
    email: '',
    mobileNumber: '',
    shopTelephone: '',
    country: '',
    city: '',
    road: '',
    buildingName: '',
    shopUnit: '',
    area: '',
    postalCode: '',
  });

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
  };

  const handleHomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHomeDelivery({ ...homeDelivery, [e.target.name]: e.target.value });
  };

  const handleFramerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFramerDelivery({ ...framerDelivery, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerDetails.firstName || !customerDetails.lastName || !customerDetails.email || items.length === 0) {
      addToast('Please provide your name, email and at least one cart item', 'error');
      return;
    }

    let compiledAddress = '';
    let customerPhone = customerDetails.mobileNumber;

    if (deliveryType === 'home') {
      compiledAddress = `HOME DELIVERY:
Country: ${homeDelivery.country}
City: ${homeDelivery.city}
Road: ${homeDelivery.road}
Building: ${homeDelivery.buildingName}
Apartment/Villa: ${homeDelivery.apartmentVilla}
Area: ${homeDelivery.area}
ZIP: ${homeDelivery.postalCode}`;
    } else {
      customerPhone = customerDetails.mobileNumber; // Still use customer's mobile as primary? Or framer's? Usually stripes needs customer phone.
      // We can append framer contact to address.
      compiledAddress = `LOCAL FRAMER DELIVERY:
Company: ${framerDelivery.companyName}
Contact: ${framerDelivery.contactFirstName} ${framerDelivery.contactLastName}
Framer Email: ${framerDelivery.email}
Framer Mobile: ${framerDelivery.mobileNumber}
Shop Tel: ${framerDelivery.shopTelephone}
Country: ${framerDelivery.country}
City: ${framerDelivery.city}
Road: ${framerDelivery.road}
Building: ${framerDelivery.buildingName}
Shop/Unit: ${framerDelivery.shopUnit}
Area: ${framerDelivery.area}
ZIP: ${framerDelivery.postalCode}`;
    }

    setLoading(true);
    try {
      // Calculate total with tax for each item proportionally
      const itemsWithTax = items.map((it) => {
        const itemSubtotal = it.price * it.quantity;
        const itemTax = itemSubtotal * taxRate;
        const itemTotal = itemSubtotal + itemTax;
        const priceWithTax = itemTotal / it.quantity;

        return {
          title: it.title,
          price: priceWithTax,
          quantity: it.quantity,
          currency: it.currency || 'aed',
          size: it.size || it.dimensions || undefined,
          dimensions: it.dimensions || undefined,
        };
      });

      const payload = {
        items: itemsWithTax,
        customer: {
          name: `${customerDetails.firstName} ${customerDetails.lastName}`,
          email: customerDetails.email,
          address: compiledAddress,
          phone: customerPhone,
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
              <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">Customer Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">First Name</label>
                    <input name="firstName" value={customerDetails.firstName} onChange={handleCustomerChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                  </div>
                  <div>
                    <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Last Name</label>
                    <input name="lastName" value={customerDetails.lastName} onChange={handleCustomerChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                  </div>
                  <div>
                    <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Email</label>
                    <input type="email" name="email" value={customerDetails.email} onChange={handleCustomerChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                  </div>
                  <div>
                    <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Mobile Number</label>
                    <input type="tel" name="mobileNumber" value={customerDetails.mobileNumber} onChange={handleCustomerChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-8">
                  <label className="font-serif text-lg font-bold text-gray-800 block mb-4">Select Home Or Local Framer Delivery</label>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:border-[#800000] transition-colors bg-gray-50/50">
                      <input type="radio" name="deliveryType" checked={deliveryType === 'home'} onChange={() => setDeliveryType('home')} className="accent-[#800000] w-5 h-5" />
                      <span className="font-serif font-semibold">Home Delivery</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:border-[#800000] transition-colors bg-gray-50/50">
                      <input type="radio" name="deliveryType" checked={deliveryType === 'local'} onChange={() => setDeliveryType('local')} className="accent-[#800000] w-5 h-5" />
                      <span className="font-serif font-semibold">Local Framer Delivery</span>
                    </label>
                  </div>
                </div>

                {deliveryType === 'home' && (
                  <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="font-serif text-xl font-bold text-gray-800 border-b border-gray-100 pb-2">Home Delivery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Country</label>
                        <input name="country" value={homeDelivery.country} onChange={handleHomeChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                      <div>
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">City</label>
                        <input name="city" value={homeDelivery.city} onChange={handleHomeChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Road</label>
                        <input name="road" value={homeDelivery.road} onChange={handleHomeChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                      <div>
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Building Name</label>
                        <input name="buildingName" value={homeDelivery.buildingName} onChange={handleHomeChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                      <div>
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Apartment / Villa Number</label>
                        <input name="apartmentVilla" value={homeDelivery.apartmentVilla} onChange={handleHomeChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                      <div>
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Area</label>
                        <input name="area" value={homeDelivery.area} onChange={handleHomeChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                      <div>
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Postal / ZIP Code</label>
                        <input name="postalCode" value={homeDelivery.postalCode} onChange={handleHomeChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                    </div>
                  </div>
                )}

                {deliveryType === 'local' && (
                  <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="font-serif text-xl font-bold text-gray-800 border-b border-gray-100 pb-2">Local Framer Delivery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Company Name</label>
                        <input name="companyName" value={framerDelivery.companyName} onChange={handleFramerChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                      <div>
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Contact First Name</label>
                        <input name="contactFirstName" value={framerDelivery.contactFirstName} onChange={handleFramerChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                      <div>
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Last Name</label>
                        <input name="contactLastName" value={framerDelivery.contactLastName} onChange={handleFramerChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                      <div>
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Email</label>
                        <input type="email" name="email" value={framerDelivery.email} onChange={handleFramerChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                      <div>
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Mobile Number</label>
                        <input type="tel" name="mobileNumber" value={framerDelivery.mobileNumber} onChange={handleFramerChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                      <div>
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Shop Telephone Number</label>
                        <input type="tel" name="shopTelephone" value={framerDelivery.shopTelephone} onChange={handleFramerChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                      <div>
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Country</label>
                        <input name="country" value={framerDelivery.country} onChange={handleFramerChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                      <div>
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">City</label>
                        <input name="city" value={framerDelivery.city} onChange={handleFramerChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                      <div>
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Road</label>
                        <input name="road" value={framerDelivery.road} onChange={handleFramerChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                      <div>
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Building Name</label>
                        <input name="buildingName" value={framerDelivery.buildingName} onChange={handleFramerChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                      <div>
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Shop / Unit Number</label>
                        <input name="shopUnit" value={framerDelivery.shopUnit} onChange={handleFramerChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                      <div>
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Area</label>
                        <input name="area" value={framerDelivery.area} onChange={handleFramerChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                      <div>
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Postal / ZIP Code</label>
                        <input name="postalCode" value={framerDelivery.postalCode} onChange={handleFramerChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg font-serif focus:outline-none focus:border-[#800000]" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="font-serif text-sm font-semibold text-gray-700 mb-2 block">Upload ID of contact for customs clearance</label>
                        <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#800000]/10 file:text-[#800000] hover:file:bg-[#800000]/20 cursor-pointer" />
                        <p className="mt-2 text-xs text-gray-500">Optional: You can also email this later.</p>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-lg text-sm text-gray-700 font-serif leading-relaxed">
                      <strong>Note:</strong> Don’t have these details now? No problem you can e-mail them together with your email order number to <a href="mailto:info@artmasons.com" className="text-[#800000] underline">info@artmasons.com</a> we will need them within 5 business days of placing your online order.
                    </div>
                  </div>
                )}

                <div className="mt-10">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#800000] text-white px-6 py-4 rounded-lg font-serif font-bold text-lg hover:bg-[#600000] transition-colors disabled:opacity-60 cursor-pointer"
                  >
                    <Lock size={20} />
                    {loading ? 'Processing…' : 'Proceed to Payment'}
                  </button>

                  <p className="font-serif text-sm text-gray-500 mt-4 text-center">
                    Payment will open in a secure Stripe modal.
                  </p>
                </div>
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
                    <span className="text-gray-700">Tax (5%):</span>
                    <span className="font-semibold tabular-nums">AED {tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-baseline font-serif">
                    <span className="text-gray-700">Shipping:</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline font-serif text-xl font-bold">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-[#800000] tabular-nums">AED {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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